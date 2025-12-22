import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/loan-requests
 * Fetch loan requests for groups where the authenticated user is an owner or admin
 * Supports filtering by status and groupId, with pagination
 */
export async function GET(req: Request) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find user in database
        const dbUser = await prisma.user.findFirst({
            where: { clerkUserId },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "PENDING";
        const groupId = searchParams.get("groupId");
        const page = parseInt(searchParams.get("page") || "1");
        const pageSize = parseInt(searchParams.get("pageSize") || "10");

        // Calculate skip for pagination
        const skip = (page - 1) * pageSize;

        // Build where clause for groups where user is owner or admin
        const groupsWhere: any = {
            memberships: {
                some: {
                    userId: dbUser.id,
                    role: {
                        in: ["OWNER", "ADMIN"],
                    },
                    status: "ACTIVE",
                },
            },
        };

        if (groupId) {
            groupsWhere.id = groupId;
        }

        // Fetch groups where user is owner/admin
        const groups = await prisma.group.findMany({
            where: groupsWhere,
            select: {
                id: true,
                name: true,
            },
        });

        const groupIds = groups.map((g) => g.id);

        if (groupIds.length === 0) {
            return NextResponse.json({
                success: true,
                loanRequests: [],
                count: 0,
                total: 0,
                page,
                pageSize,
                totalPages: 0,
            });
        }

        // Build where clause for loan requests
        const loanRequestWhere: any = {
            groupId: {
                in: groupIds,
            },
        };

        // Add status filter if not "all"
        if (status && status.toUpperCase() !== "ALL") {
            loanRequestWhere.status = status.toUpperCase();
        }

        // Get total count for pagination
        const total = await prisma.loanRequest.count({
            where: loanRequestWhere,
        });

        // Fetch loan requests with pagination
        const loanRequests = await prisma.loanRequest.findMany({
            where: loanRequestWhere,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
                group: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                    },
                },
                votes: {
                    select: {
                        vote: true,
                        membershipId: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
            skip,
            take: pageSize,
        });

        // Get active member counts for each group (for majority calculation)
        const groupMemberCounts = await Promise.all(
            loanRequests.map(async (request) => {
                const count = await prisma.membership.count({
                    where: {
                        groupId: request.groupId,
                        status: "ACTIVE",
                    },
                });
                return { groupId: request.groupId, count };
            })
        );

        // Create a map for quick lookup
        const memberCountMap = new Map(
            groupMemberCounts.map((item) => [item.groupId, item.count])
        );

        // Transform to match expected format
        const formattedRequests = loanRequests.map((request) => {
            const approveVotes = request.votes.filter((v) => v.vote === true).length;
            const rejectVotes = request.votes.filter((v) => v.vote === false).length;
            const totalVoted = approveVotes + rejectVotes;
            
            // Get total active members for this group
            const totalMembers = memberCountMap.get(request.groupId) || 1;
            
            // Calculate majority threshold: floor(totalMembers / 2) + 1
            const majorityNeeded = Math.floor(totalMembers / 2) + 1;

            return {
                id: request.id,
                requester: {
                    id: request.user.id,
                    name: request.user.name || "Unknown User",
                    avatar: request.user.avatar || "/placeholder.svg",
                },
                group: request.group.name,
                groupId: request.groupId,
                amount: Number(request.amount),
                purpose: request.purpose,
                repaymentDate: request.repaymentDate.toISOString(),
                installments: request.installments,
                interestRate: Number(request.interestRate),
                status: request.status,
                createdAt: request.createdAt.toISOString(),
                votes: {
                    approve: approveVotes,
                    reject: rejectVotes,
                    totalVoted: totalVoted,           // How many members have voted so far
                    totalMembers: totalMembers,       // Total active members in group
                    majorityNeeded: majorityNeeded,   // Votes needed for majority
                    // Legacy fields for backwards compatibility
                    total: totalMembers,
                    threshold: majorityNeeded,
                },
                comments: 0, // TODO: Implement comments if needed
            };
        });

        return NextResponse.json({
            success: true,
            loanRequests: formattedRequests,
            count: formattedRequests.length,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (error) {
        console.error("Error fetching loan requests:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");

        // Log the specific error details
        if (error instanceof Error) {
            console.error("Error name:", error.name);
            console.error("Error message:", error.message);
        }

        return NextResponse.json(
            {
                error: "Failed to fetch loan requests",
                details: error instanceof Error ? error.message : "Unknown error",
                type: error instanceof Error ? error.name : typeof error,
            },
            { status: 500 }
        );
    }
}
