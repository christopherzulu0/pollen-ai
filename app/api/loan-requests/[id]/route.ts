import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/loan-requests/[id]
 * Approve or reject a loan request
 * Only group owners/admins can perform this action
 */
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { action } = await req.json();

        if (!action || !["APPROVE", "REJECT"].includes(action)) {
            return NextResponse.json(
                { error: "Invalid action. Must be APPROVE or REJECT" },
                { status: 400 }
            );
        }

        // Find user in database
        const dbUser = await prisma.user.findFirst({
            where: { clerkUserId },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find the loan request
        const loanRequest = await prisma.loanRequest.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                group: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!loanRequest) {
            return NextResponse.json({ error: "Loan request not found" }, { status: 404 });
        }

        // Check if user is an ACTIVE member of the group
        const membership = await prisma.membership.findFirst({
            where: {
                userId: dbUser.id,
                groupId: loanRequest.groupId,
                status: "ACTIVE",
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: "Only active group members can vote on loan requests" },
                { status: 403 }
            );
        }

        // Record the vote
        const voteValue = action === "APPROVE";
        await prisma.loanVote.upsert({
            where: {
                userId_loanRequestId: {
                    userId: dbUser.id,
                    loanRequestId: id,
                },
            },
            update: {
                vote: voteValue,
                membershipId: membership.id,
            },
            create: {
                userId: dbUser.id,
                loanRequestId: id,
                vote: voteValue,
                membershipId: membership.id,
            },
        });

        // Recalculate votes and check majority
        const allVotes = await prisma.loanVote.findMany({
            where: { loanRequestId: id },
        });

        // Count active members for majority calculation
        const activeMembersCount = await prisma.membership.count({
            where: {
                groupId: loanRequest.groupId,
                status: "ACTIVE",
            },
        });

        const approveVotes = allVotes.filter((v) => v.vote).length;
        const rejectVotes = allVotes.filter((v) => !v.vote).length;
        const totalVoteCast = approveVotes + rejectVotes;
        const totalMembers = activeMembersCount || 1; // Avoid division by zero
        
        // Simple majority: More than 50% of total active members
        const majorityThreshold = Math.floor(totalMembers / 2) + 1;

        let newStatus = loanRequest.status;
        let statusMessage = "Vote recorded successfully";

        // Only change status if majority threshold is reached
        if (approveVotes >= majorityThreshold) {
            newStatus = "APPROVED";
            statusMessage = `Loan request approved! (${approveVotes}/${totalMembers} members voted to approve)`;
        } else if (rejectVotes >= majorityThreshold) {
            newStatus = "REJECTED";
            statusMessage = `Loan request rejected! (${rejectVotes}/${totalMembers} members voted to reject)`;
        } else {
            // Still pending - need more votes
            const votesNeeded = majorityThreshold - Math.max(approveVotes, rejectVotes);
            statusMessage = `Vote recorded. ${votesNeeded} more vote(s) needed to reach majority (${totalVoteCast}/${totalMembers} members have voted)`;
        }

        // Update status if it changed
        if (newStatus !== loanRequest.status) {
            await prisma.loanRequest.update({
                where: { id },
                data: { 
                    status: newStatus,
                    // Optionally update approvedAt or rejectedAt timestamps
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: statusMessage,
            loanRequest: {
                id: loanRequest.id,
                status: newStatus,
                votes: {
                    approve: approveVotes,
                    reject: rejectVotes,
                    totalVoted: totalVoteCast,
                    totalMembers: totalMembers,
                    majorityNeeded: majorityThreshold,
                }
            },
        });
    } catch (error) {
        console.error("Error updating loan request:", error);
        return NextResponse.json(
            {
                error: "Failed to update loan request",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
