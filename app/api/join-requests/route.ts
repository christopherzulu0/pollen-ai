import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/join-requests
 * Fetch pending membership requests for groups where the authenticated user is an owner/admin
 * Query params:
 * - status: Filter by status (default: PENDING)
 * - groupId: Filter by specific group
 */
export async function GET(req: Request) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user from database
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
                joinRequests: [],
                count: 0,
                total: 0,
                page,
                pageSize,
                totalPages: 0,
            });
        }

        // Build where clause for memberships
        const membershipWhere: any = {
            groupId: {
                in: groupIds,
            },
            status: status as any,
        };

        // Get total count for pagination
        const total = await prisma.membership.count({
            where: membershipWhere,
        });

        // Fetch pending memberships for these groups with pagination
        const joinRequests = await prisma.membership.findMany({
            where: membershipWhere,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        avatar: true,
                    },
                },
                group: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        logo: true,
                    },
                },
            },
            orderBy: {
                joinedAt: "desc",
            },
            skip,
            take: pageSize,
        });

        // Transform to match the expected format
        const formattedRequests = joinRequests.map((request) => ({
            id: request.id,
            user: {
                id: request.user.id,
                name: request.user.name || "Unknown User",
                email: request.user.email,
                phone: request.user.phone || "",
                avatar: request.user.avatar || "/placeholder.svg",
            },
            group: request.group.name,
            groupId: request.groupId,
            status: request.status,
            createdAt: request.joinedAt.toISOString(),
            message: "", // Membership model doesn't have message field, can add later if needed
        }));

        return NextResponse.json({
            success: true,
            joinRequests: formattedRequests,
            count: formattedRequests.length,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    } catch (error) {
        console.error("Error fetching join requests:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch join requests",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
