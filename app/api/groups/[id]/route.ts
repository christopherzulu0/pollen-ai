import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || !session.userId) {
            return NextResponse.json({ error: "Not Authorized" }, { status: 401 });
        }

        const { id: groupId } = await params;

        const group = await prisma.group.findUnique({
            where: {
                id: groupId,
            },
            include: {
                memberships: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                avatar: true,
                            },
                        },
                    },
                },
                contributions: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 20,
                },
                loanRequests: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                    take: 20,
                },
                meetings: {
                    orderBy: { date: "asc" },
                    where: { date: { gte: new Date() } },
                },
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });

        if (!group) {
            return NextResponse.json({ error: "Group not found" }, { status: 404 });
        }

        return NextResponse.json(group);
    } catch (error) {
        console.error("GET /api/groups/[id] - Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch group details" },
            { status: 500 }
        );
    }
}
