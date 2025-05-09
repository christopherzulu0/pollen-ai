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

    // Create personal savings record
    const personalSavings = await prisma.personalSavings.create({
      data: {
        userId: dbUser.id,
        balance: 0,
      }
    });

    return NextResponse.json({ success: true, personalSavings });
  } catch (error) {
    console.error("Error creating personal savings:", error);
    return NextResponse.json(
      { error: "Failed to create personal savings" },
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

    // Get the user's personal savings
    const dbUser = await prisma.user.findFirst({
      where: { clerkUserId },
      include: {
        personalSavings: true,
        savingsGoals: true
      }
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      personalSavings: dbUser.personalSavings,
      savingsGoals: dbUser.savingsGoals
    });
  } catch (error) {
    console.error("Error fetching personal savings:", error);
    return NextResponse.json(
      { error: "Failed to fetch personal savings" },
      { status: 500 }
    );
  }
} 