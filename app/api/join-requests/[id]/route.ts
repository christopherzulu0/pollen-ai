import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * PATCH /api/join-requests/[id]
 * Approve or decline a join request (pending membership)
 * Body: { action: "ACCEPT" | "DECLINE" }
 */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId: clerkUserId } = await auth();
        if (!clerkUserId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { action } = await req.json();

        if (!action || !["ACCEPT", "DECLINE"].includes(action)) {
            return NextResponse.json(
                { error: "Invalid action. Must be ACCEPT or DECLINE" },
                { status: 400 }
            );
        }

        // Get user from database
        const dbUser = await prisma.user.findFirst({
            where: { clerkUserId },
        });

        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Find the membership (join request)
        const membership = await prisma.membership.findUnique({
            where: { id },
            include: {
                group: {
                    include: {
                        memberships: {
                            where: {
                                userId: dbUser.id,
                                role: {
                                    in: ["OWNER", "ADMIN"],
                                },
                                status: "ACTIVE",
                            },
                        },
                    },
                },
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!membership) {
            return NextResponse.json(
                { error: "Join request not found" },
                { status: 404 }
            );
        }

        // Check if current user is owner or admin of the group
        if (membership.group.memberships.length === 0) {
            return NextResponse.json(
                { error: "You don't have permission to manage this group" },
                { status: 403 }
            );
        }

        if (action === "ACCEPT") {
            // Update membership status to ACTIVE
            const updatedMembership = await prisma.membership.update({
                where: { id },
                data: {
                    status: "ACTIVE",
                },
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
                        },
                    },
                },
            });

            return NextResponse.json({
                success: true,
                message: `${updatedMembership.user.name} has been accepted to ${updatedMembership.group.name}`,
                membership: {
                    id: updatedMembership.id,
                    status: updatedMembership.status,
                    userId: updatedMembership.userId,
                    groupId: updatedMembership.groupId,
                    user: updatedMembership.user,
                    group: updatedMembership.group,
                },
            });
        } else {
            // DECLINE - set status to INACTIVE instead of deleting (keeps history)
            const updatedMembership = await prisma.membership.update({
                where: { id },
                data: {
                    status: "INACTIVE",
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            });

            return NextResponse.json({
                success: true,
                message: `Join request from ${updatedMembership.user.name} has been declined`,
                membership: {
                    id: updatedMembership.id,
                    status: updatedMembership.status,
                    userId: updatedMembership.userId,
                    groupId: updatedMembership.groupId,
                },
            });
        }
    } catch (error) {
        console.error("Error processing join request:", error);
        return NextResponse.json(
            {
                error: "Failed to process join request",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
