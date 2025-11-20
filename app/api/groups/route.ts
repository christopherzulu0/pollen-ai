import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// Function to generate a unique group code
function generateGroupCode() {
  const prefix = "GRP-";
  const randomChars = Math.random().toString(36).substring(2, 8).toUpperCase();
  return prefix + randomChars;
}

export async function POST(req: Request) {
  try {

    const session = await auth()

    if(!session || !session.userId === null){
     return NextResponse.json({error:"Not Authorized"},{status:401})
    }

    // Check if user exists in our database, if not create it
    let dbUser = await prisma.user.findFirst({
      where: { 
        clerkUserId: session?.userId 
      }
    });

    const clerkUser = await currentUser();

    if (!dbUser) {
      // Create a new user in our database
      dbUser = await prisma.user.create({
        data: {
          clerkUserId: session?.userId,
          name: clerkUser?.firstName && clerkUser?.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser?.username || "User" + Date.now(), // Make sure name is unique
          email: clerkUser?.emailAddresses[0]?.emailAddress || `${session?.userId}@example.com`,
          password: "clerk-auth", // This is a placeholder since we're using Clerk for auth
          avatar: clerkUser?.imageUrl || null,
        }
      });
    }

    const data = await req.json();

    // Create the group with auto-generated group code
    const newGroup = await prisma.group.create({
      data: {
        name: data.name,
        description: data.description || "",
        logo: data.logo || "",
        ownerId: dbUser.id, // Use the database user ID
        privacy: data.privacy,
        groupCode: generateGroupCode(),
        governanceType: data.governanceType,
        contributionAmount: parseFloat(data.contributionAmount || "0"),
        contributionFrequency: data.contributionFrequency,
        depositGoal: data.depositGoal ? parseFloat(data.depositGoal) : null,
        latePenaltyFee: parseFloat(data.latePenaltyFee || "0"),
        gracePeriod: parseInt(data.gracePeriod || "3"),
        interestRate: parseFloat(data.interestRate || "0"),
        allowEarlyWithdrawal: data.allowEarlyWithdrawal,
        earlyWithdrawalFee: data.earlyWithdrawalFee ? parseFloat(data.earlyWithdrawalFee) : 0,
        requireApproval: data.requireApproval,
        autoReminders: data.autoReminders,
        votingThreshold: parseInt(data.votingThreshold || "50"),
        allowLateJoining: data.allowLateJoining,
        groupDuration: data.groupDuration ? parseInt(data.groupDuration) : null,
        maxMembers: data.maxMembers ? parseInt(data.maxMembers) : null,
        meetingFrequency: data.meetingFrequency,
        groupRules: data.groupRules || "",
        bylaws: data.bylaws || "",
        tags: data.tags || "",
        status: "ACTIVE",
      },
    });

    // Create a membership for the owner
    await prisma.membership.create({
      data: {
        userId: dbUser.id, // Use the database user ID
        groupId: newGroup.id,
        role: "OWNER",
        status: "ACTIVE",
        balance: 0,
        totalContributed: 0,
      },
    });

    return NextResponse.json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}

// Add the GET endpoint to fetch groups
export async function GET(req: Request) {

  try {
   const session = await auth()

   if(!session || !session.userId === null){
    return NextResponse.json({error:"Not Authorized"},{status:401})
   }

    try {
      const groups = await prisma.group.findMany({
        where: {
          memberships: {
            some: {
              user: {
                clerkUserId: session?.userId
              }
            }
          }
        },
        include: {
          memberships: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      });

      console.log(`GET /api/groups - Found ${groups.length} groups`);
      return NextResponse.json(groups);
    } catch (prismaError) {
      console.error("GET /api/groups - Prisma error:", prismaError);
      return NextResponse.json(
        { error: "Database error fetching groups" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("GET /api/groups - Unexpected error:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
} 
