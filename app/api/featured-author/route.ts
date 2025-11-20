import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get all published blog posts
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'published',
      },
      select: {
        author: true,
        author_Position: true,
        likes: true,
        views: true,
        engagement: true,
        blog_tags: true,
      },
    });

    if (posts.length === 0) {
      // Return default featured author if no posts
      return NextResponse.json({
        name: "Sarah Johnson",
        position: "AI Research Lead",
        bio: "Sarah is our AI Research Lead with over 10 years of experience in machine learning and financial technology. She specializes in developing AI solutions for credit scoring and financial inclusion.",
        avatar: "/placeholder.svg?height=200&width=200",
        tags: ["AI Expert", "Financial Inclusion", "Machine Learning"],
        articleCount: 0,
        totalLikes: 0,
        totalViews: 0,
      });
    }

    // Group posts by author and calculate stats
    const authorStats = posts.reduce((acc, post) => {
      const authorName = post.author;
      if (!acc[authorName]) {
        acc[authorName] = {
          name: authorName,
          position: post.author_Position || 'Author',
          articleCount: 0,
          totalLikes: 0,
          totalViews: 0,
          totalEngagement: 0,
        };
      }
      acc[authorName].articleCount += 1;
      acc[authorName].totalLikes += post.likes || 0;
      acc[authorName].totalViews += post.views || 0;
      acc[authorName].totalEngagement += post.engagement || 0;
      return acc;
    }, {} as Record<string, {
      name: string;
      position: string;
      articleCount: number;
      totalLikes: number;
      totalViews: number;
      totalEngagement: number;
    }>);

    // Find the featured author (highest engagement or most articles)
    const authors = Object.values(authorStats);
    const featuredAuthor = authors.reduce((prev, current) => {
      // Prioritize by engagement, then by article count
      if (current.totalEngagement > prev.totalEngagement) {
        return current;
      } else if (current.totalEngagement === prev.totalEngagement && current.articleCount > prev.articleCount) {
        return current;
      }
      return prev;
    }, authors[0]);

    // Get tags from the author's posts
    const authorPosts = posts.filter(p => p.author === featuredAuthor.name);
    const allTags = authorPosts.flatMap(p => p.blog_tags || []);
    
    // Get most common tags (top 3)
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([tag]) => tag);
    
    // Use author's tags or fallback to position-based tags
    const tags = sortedTags.length > 0 
      ? sortedTags 
      : featuredAuthor.position.includes('AI') || featuredAuthor.position.includes('Research') 
        ? ["AI Expert", "Financial Inclusion", "Machine Learning"]
        : featuredAuthor.position.includes('Finance') || featuredAuthor.position.includes('Banking')
        ? ["Financial Inclusion", "Banking", "Technology"]
        : ["Technology", "Innovation", "Development"];

    // Return featured author data
    return NextResponse.json({
      name: featuredAuthor.name,
      position: featuredAuthor.position,
      bio: `${featuredAuthor.name} is our ${featuredAuthor.position} with extensive experience in creating impactful content. They have published ${featuredAuthor.articleCount} article${featuredAuthor.articleCount !== 1 ? 's' : ''} with ${featuredAuthor.totalViews} total views and ${featuredAuthor.totalLikes} likes.`,
      avatar: "/placeholder.svg?height=200&width=200",
      tags: tags,
      articleCount: featuredAuthor.articleCount,
      totalLikes: featuredAuthor.totalLikes,
      totalViews: featuredAuthor.totalViews,
    });
  } catch (error) {
    console.error("Error fetching featured author:", error);
    // Return default featured author on error
    return NextResponse.json({
      name: "Sarah Johnson",
      position: "AI Research Lead",
      bio: "Sarah is our AI Research Lead with over 10 years of experience in machine learning and financial technology. She specializes in developing AI solutions for credit scoring and financial inclusion.",
      avatar: "/placeholder.svg?height=200&width=200",
      tags: ["AI Expert", "Financial Inclusion", "Machine Learning"],
      articleCount: 0,
      totalLikes: 0,
      totalViews: 0,
    });
  }
}

