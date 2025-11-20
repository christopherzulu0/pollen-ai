import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookmark = await prisma.blogBookmark.findUnique({
      where: {
        user_id_blog_post_id: {
          user_id: userId,
          blog_post_id: id,
        },
      },
    });

    return NextResponse.json({ isBookmarked: !!bookmark });
  } catch (error) {
    console.error("Error checking bookmark:", error);
    return NextResponse.json(
      { error: "Failed to check bookmark" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.blogBookmark.findUnique({
      where: {
        user_id_blog_post_id: {
          user_id: userId,
          blog_post_id: id,
        },
      },
    });

    if (existingBookmark) {
      return NextResponse.json({ isBookmarked: true, message: "Already bookmarked" });
    }

    // Create bookmark
    await prisma.blogBookmark.create({
      data: {
        user_id: userId,
        blog_post_id: id,
      },
    });

    return NextResponse.json({ isBookmarked: true, message: "Bookmarked successfully" });
  } catch (error) {
    console.error("Error bookmarking post:", error);
    return NextResponse.json(
      { error: "Failed to bookmark post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await prisma.blogBookmark.deleteMany({
      where: {
        user_id: userId,
        blog_post_id: id,
      },
    });

    return NextResponse.json({ isBookmarked: false, message: "Bookmark removed" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return NextResponse.json(
      { error: "Failed to remove bookmark" },
      { status: 500 }
    );
  }
}

