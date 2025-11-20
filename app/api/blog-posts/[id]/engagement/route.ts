import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();
    const { action } = data; // 'like', 'comment', 'share', 'read_time'

    // Get current post data
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        blog_comments: true,
      },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    // For 'view' action, recalculate engagement based on current state
    if (action === 'view') {
      const likes = post.likes || 0;
      const commentsCount = post.blog_comments?.length || 0;
      const views = post.views || 1;
      
      let engagement = ((likes * 2 + commentsCount * 3) / views) * 100;
      engagement = Math.min(Math.max(engagement, 0), 100);
      
      // Update engagement
      const updatedPost = await prisma.blogPost.update({
        where: { id },
        data: {
          engagement: engagement,
        },
      });

      return NextResponse.json({ engagement: updatedPost.engagement });
    }

    // Calculate engagement based on various factors
    // Engagement formula: (likes * 2 + comments * 3 + shares * 5 + read_completion * 10) / total_views * 100
    
    const likes = post.likes || 0;
    const commentsCount = post.blog_comments?.length || 0;
    const views = post.views || 1; // Avoid division by zero

    // Base engagement calculation
    let engagement = 0;

    // If action is provided, adjust engagement accordingly
    if (action === 'like') {
      // Like increases engagement
      engagement = ((likes * 2 + commentsCount * 3) / views) * 100;
    } else if (action === 'comment') {
      // Comment increases engagement (use updated comment count)
      // Note: comment count will be updated after this, so we add 1
      engagement = ((likes * 2 + (commentsCount + 1) * 3) / views) * 100;
    } else if (action === 'share') {
      // Share increases engagement (add 5 points for share)
      engagement = ((likes * 2 + commentsCount * 3 + 5) / views) * 100;
    } else if (action === 'read_time') {
      // Reading time contributes to engagement
      const readTimeProgress = data.readTimeProgress || 0; // 0-100
      engagement = ((likes * 2 + commentsCount * 3) / views) * 100 + (readTimeProgress * 0.1);
    } else {
      // Default calculation
      engagement = ((likes * 2 + commentsCount * 3) / views) * 100;
    }

    // Cap engagement at 100%
    engagement = Math.min(Math.max(engagement, 0), 100);

    // Update engagement
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        engagement: engagement,
      },
    });

    return NextResponse.json({ engagement: updatedPost.engagement });
  } catch (error) {
    console.error("Error updating engagement:", error);
    return NextResponse.json(
      { error: "Failed to update engagement" },
      { status: 500 }
    );
  }
}

