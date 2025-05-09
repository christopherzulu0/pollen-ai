import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const clerkUser = await currentUser();

    // Get or create the user in our database
    let dbUser = await prisma.user.findFirst({
      where: { clerkUserId }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkUserId,
          name: clerkUser?.firstName && clerkUser?.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}` 
            : clerkUser?.username || "User" + Date.now(),
          email: clerkUser?.emailAddresses[0]?.emailAddress || `${clerkUserId}@example.com`,
          password: "clerk-auth",
          avatar: clerkUser?.imageUrl || null,
        }
      });
    }

    // Create savings goal
    const savingsGoal = await prisma.savingsGoal.create({
      data: {
        userId: dbUser.id,
        name: data.name,
        targetAmount: data.targetAmount,
        currentAmount: data.currentAmount,
        deadline: data.deadline ? new Date(data.deadline) : null,
        isCompleted: false
      }
    });

    return NextResponse.json(savingsGoal);
  } catch (error) {
    console.error("Error creating savings goal:", error);
    return NextResponse.json(
      { error: "Failed to create savings goal" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the user's savings goals
    const dbUser = await prisma.user.findFirst({
      where: { clerkUserId },
      include: {
        savingsGoals: true
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(dbUser.savingsGoals);
  } catch (error) {
    console.error("Error fetching savings goals:", error);
    return NextResponse.json(
      { error: "Failed to fetch savings goals" },
      { status: 500 }
    );
  }
} 