import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json();
    const { id } = await params;

    // Validate input
    if (!data.comment || !data.comment_by) {
      return NextResponse.json(
        { error: "Comment and comment_by are required" },
        { status: 400 }
      );
    }

    const comment = await prisma.blogComment.create({
      data: {
        comment: data.comment,
        comment_by: data.comment_by,
        blog_post_id: id,
        comment_likes: 0,
        parent_id: data.parent_id || null, // Support replies
        audio_url: data.audio_url || null, // Support voice comments
      },
      include: {
        blog_post: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}

// Helper function to recursively build comment tree with nested replies
function buildCommentTree(comments: any[], parentId: string | null = null): any[] {
  return comments
    .filter(comment => comment.parent_id === parentId)
    .map(comment => ({
      ...comment,
      replies: buildCommentTree(comments, comment.id).sort((a, b) => 
        new Date(a.comment_at).getTime() - new Date(b.comment_at).getTime()
      ),
    }))
    .sort((a, b) => 
      new Date(b.comment_at).getTime() - new Date(a.comment_at).getTime()
    );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch all comments for this blog post
    const allComments = await prisma.blogComment.findMany({
      where: {
        blog_post_id: id,
      },
      orderBy: {
        comment_at: 'desc',
      },
    });

    // Build comment tree recursively (handles nested replies)
    const topLevelComments = buildCommentTree(allComments, null);
    
    return NextResponse.json(topLevelComments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

