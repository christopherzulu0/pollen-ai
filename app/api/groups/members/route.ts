import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();
    const url = new URL(request.url);
    const groupId = url.searchParams.get("groupId");

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find the user in the database
    const dbUser = await prisma.user.findUnique({
      where: {
        clerkUserId: session.userId,
      },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If groupId is "all" or not provided, fetch members from all groups the user is a member of
    if (!groupId || groupId === "all") {
      // Get all groups the user is a member of
      const userMemberships = await prisma.membership.findMany({
        where: {
          userId: dbUser.id,
          status: "ACTIVE",
        },
        select: {
          groupId: true,
        },
      });

      const groupIds = userMemberships.map(m => m.groupId);

      // Fetch members from all these groups
      const members = await prisma.membership.findMany({
        where: {
          groupId: {
            in: groupIds,
          },
          status: "ACTIVE", // Only fetch active members
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true,
              createdAt: true,
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

      return NextResponse.json(members);
    }

    // Check if the user is a member of the group
    const userMembership = await prisma.membership.findUnique({
      where: {
        userId_groupId: {
          userId: dbUser.id,
          groupId: groupId,
        },
      },
    });

    if (!userMembership) {
      return NextResponse.json({ error: "You are not a member of this group" }, { status: 403 });
    }

    // Fetch all members of the group
    const members = await prisma.membership.findMany({
      where: {
        groupId: groupId,
        status: "ACTIVE", // Only fetch active members
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching group members:", error);
    return NextResponse.json(
      { error: "Failed to fetch group members" },
      { status: 500 }
    );
  }
}
