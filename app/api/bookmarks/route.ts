import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch all bookmarks for the current user
    const bookmarks = await prisma.blogBookmark.findMany({
      where: {
        user_id: userId,
      },
      include: {
        blog_post: {
          include: {
            blog_comments: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    // Extract just the post IDs
    const bookmarkIds = bookmarks.map((bookmark) => bookmark.blog_post_id);

    return NextResponse.json({ bookmarkIds, bookmarks });
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookmarks" },
      { status: 500 }
    );
  }
}

