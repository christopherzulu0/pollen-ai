import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ authorName: string }> }
) {
  try {
    const { userId } = await auth();
    const { authorName } = await params;

    if (!userId) {
      return NextResponse.json({ isFollowing: false });
    }

    // Decode author name (URL encoded)
    const decodedAuthorName = decodeURIComponent(authorName);

    const follow = await prisma.userFollow.findUnique({
      where: {
        follower_id_author_name: {
          follower_id: userId,
          author_name: decodedAuthorName,
        },
      },
    });

    return NextResponse.json({ isFollowing: !!follow });
  } catch (error) {
    console.error("Error checking follow status:", error);
    return NextResponse.json(
      { error: "Failed to check follow status" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ authorName: string }> }
) {
  try {
    const { userId } = await auth();
    const { authorName } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Decode author name (URL encoded)
    const decodedAuthorName = decodeURIComponent(authorName);

    // Check if already following
    const existingFollow = await prisma.userFollow.findUnique({
      where: {
        follower_id_author_name: {
          follower_id: userId,
          author_name: decodedAuthorName,
        },
      },
    });

    if (existingFollow) {
      return NextResponse.json({ isFollowing: true, message: "Already following this author" });
    }

    // Create follow
    await prisma.userFollow.create({
      data: {
        follower_id: userId,
        author_name: decodedAuthorName,
      },
    });

    return NextResponse.json({ isFollowing: true, message: "Successfully followed author" });
  } catch (error) {
    console.error("Error following author:", error);
    return NextResponse.json(
      { error: "Failed to follow author" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ authorName: string }> }
) {
  try {
    const { userId } = await auth();
    const { authorName } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Decode author name (URL encoded)
    const decodedAuthorName = decodeURIComponent(authorName);

    await prisma.userFollow.deleteMany({
      where: {
        follower_id: userId,
        author_name: decodedAuthorName,
      },
    });

    return NextResponse.json({ isFollowing: false, message: "Successfully unfollowed author" });
  } catch (error) {
    console.error("Error unfollowing author:", error);
    return NextResponse.json(
      { error: "Failed to unfollow author" },
      { status: 500 }
    );
  }
}

