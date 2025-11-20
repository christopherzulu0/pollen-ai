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
      return NextResponse.json({ isLiked: false });
    }

    const like = await prisma.blogLike.findUnique({
      where: {
        user_id_blog_post_id: {
          user_id: userId,
          blog_post_id: id,
        },
      },
    });

    return NextResponse.json({ isLiked: !!like });
  } catch (error) {
    console.error("Error checking like:", error);
    return NextResponse.json(
      { error: "Failed to check like" },
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

    // Check if like already exists
    const existingLike = await prisma.blogLike.findUnique({
      where: {
        user_id_blog_post_id: {
          user_id: userId,
          blog_post_id: id,
        },
      },
    });

    if (existingLike) {
      return NextResponse.json({ isLiked: true, message: "Already liked" });
    }

    // Use transaction to create like and increment count
    const result = await prisma.$transaction(async (tx) => {
      // Create like
      await tx.blogLike.create({
        data: {
          user_id: userId,
          blog_post_id: id,
        },
      });

      // Increment likes count
      const updatedPost = await tx.blogPost.update({
        where: { id },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      return updatedPost;
    });

    return NextResponse.json({ 
      isLiked: true, 
      likes: result.likes,
      message: "Liked successfully" 
    });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json(
      { error: "Failed to like post" },
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

    // Use transaction to delete like and decrement count
    const result = await prisma.$transaction(async (tx) => {
      // Check if like exists
      const existingLike = await tx.blogLike.findUnique({
        where: {
          user_id_blog_post_id: {
            user_id: userId,
            blog_post_id: id,
          },
        },
      });

      if (!existingLike) {
        // Get current post to return current likes count
        const post = await tx.blogPost.findUnique({
          where: { id },
          select: { likes: true },
        });
        return post;
      }

      // Delete like
      await tx.blogLike.delete({
        where: {
          user_id_blog_post_id: {
            user_id: userId,
            blog_post_id: id,
          },
        },
      });

      // Decrement likes count (ensure it doesn't go below 0)
      const updatedPost = await tx.blogPost.update({
        where: { id },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });

      // Ensure likes doesn't go negative
      if (updatedPost.likes < 0) {
        await tx.blogPost.update({
          where: { id },
          data: {
            likes: 0,
          },
        });
        return { ...updatedPost, likes: 0 };
      }

      return updatedPost;
    });

    return NextResponse.json({ 
      isLiked: false, 
      likes: result?.likes || 0,
      message: "Like removed" 
    });
  } catch (error) {
    console.error("Error removing like:", error);
    return NextResponse.json(
      { error: "Failed to remove like" },
      { status: 500 }
    );
  }
}

