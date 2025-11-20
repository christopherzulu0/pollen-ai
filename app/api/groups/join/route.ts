import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { groupCode } = await req.json();

    // Get or create the user in our database
    const clerkUser = await currentUser();
    let dbUser = await prisma.user.findFirst({
      where: { clerkUserId }
    });

    if (!dbUser) {
      // Create a new user in our database
      dbUser = await prisma.user.create({
        data: {
          clerkUserId,
          name: clerkUser?.firstName && clerkUser?.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser?.username || "User" + Date.now(),
          email: clerkUser?.emailAddresses[0]?.emailAddress || `${clerkUserId}@example.com`,
          password: "clerk-auth", // This is a placeholder since we're using Clerk for auth
          avatar: clerkUser?.imageUrl || null,
        }
      });
    }

    // Find the group by code
    const group = await prisma.group.findFirst({
      where: { groupCode },
      include: {
        owner: true,
        memberships: true
      }
    });

    if (!group) {
      return NextResponse.json({ error: "Group not found" }, { status: 404 });
    }

    // Check if user is already a member
    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: dbUser.id,
        groupId: group.id
      }
    });

    if (existingMembership) {
      return NextResponse.json({ error: "Already a member of this group" }, { status: 400 });
    }

    // Create new membership
    const membership = await prisma.membership.create({
      data: {
        userId: dbUser.id,
        groupId: group.id,
        role: "MEMBER",
        status: "ACTIVE",
        balance: 0,
        totalContributed: 0
      }
    });

    return NextResponse.json({ success: true, membership });
  } catch (error) {
    console.error("Error joining group:", error);
    return NextResponse.json(
      { error: "Failed to join group" },
      { status: 500 }
    );
  }
} 