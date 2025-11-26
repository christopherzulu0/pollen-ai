import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeCommentSentiment } from "@/lib/openai";
import { moderateComment } from "@/lib/content-moderation";

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

    // Step 1: Content Moderation - Check for spam and inappropriate content
    const moderationResult = await moderateComment(data.comment);

    console.log('Moderation result:', {
      success: moderationResult.success,
      isAppropriate: moderationResult.isAppropriate,
      isSafe: moderationResult.isSafe,
      isSpam: moderationResult.isSpam,
      confidence: moderationResult.confidence,
      flaggedCategories: moderationResult.flaggedCategories,
      reason: moderationResult.reason,
    });

    if (!moderationResult.success) {
      console.error("Moderation check failed:", moderationResult.error);
      // Continue with comment creation if moderation service fails
    } else if (!moderationResult.isAppropriate || moderationResult.isSpam) {
      // Reject inappropriate or spam comments
      console.warn('Comment rejected by moderation:', {
        comment: data.comment.substring(0, 100),
        reason: moderationResult.reason,
        isSpam: moderationResult.isSpam,
        flaggedCategories: moderationResult.flaggedCategories,
      });

      return NextResponse.json(
        {
          error: "Comment rejected",
          reason: moderationResult.reason || "Your comment violates our community guidelines",
          suggestions: moderationResult.suggestions,
          flaggedCategories: moderationResult.flaggedCategories,
          isSpam: moderationResult.isSpam,
        },
        { status: 400 }
      );
    }

    console.log('Comment passed moderation, creating...');

    // Step 2: Analyze sentiment with OpenAI (run in background, don't block comment creation)
    let sentimentData = null;
    try {
      const sentimentResult = await analyzeCommentSentiment(data.comment);
      if (sentimentResult.success) {
        sentimentData = sentimentResult.data;
      }
    } catch (error) {
      console.error("Error analyzing sentiment (non-blocking):", error);
      // Continue with comment creation even if sentiment analysis fails
    }

    // Step 3: Create comment with moderation and sentiment data
    const comment = await prisma.blogComment.create({
      data: {
        comment: data.comment,
        comment_by: data.comment_by,
        blog_post_id: id,
        comment_likes: 0,
        parent_id: data.parent_id || null, // Support replies
        audio_url: data.audio_url || null, // Support voice comments
        // Add sentiment data if available
        sentiment: sentimentData?.sentiment || null,
        sentimentScore: sentimentData?.score || null,
        sentimentConfidence: sentimentData?.confidence || null,
        emotions: sentimentData?.emotions || [],
        analyzedAt: sentimentData ? new Date() : null,
        // Add moderation data
        moderationStatus: moderationResult.success ? 'approved' : 'pending',
        moderationScore: moderationResult.confidence || null,
        moderationFlags: moderationResult.flaggedCategories || [],
      },
      include: {
        blog_post: true,
      },
    });

    return NextResponse.json({
      ...comment,
      // Include sentiment analysis in response
      sentimentAnalysis: sentimentData ? {
        sentiment: sentimentData.sentiment,
        score: sentimentData.score,
        confidence: sentimentData.confidence,
        emotions: sentimentData.emotions,
        keywords: sentimentData.keywords,
        intensity: sentimentData.intensity,
      } : null,
      // Include moderation result
      moderationResult: {
        isAppropriate: moderationResult.isAppropriate,
        isSafe: moderationResult.isSafe,
        confidence: moderationResult.confidence,
      },
    }, { status: 201 });
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

