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
        category: true,
        blog_tags: true,
      },
    });

    // Get unique categories from posts
    const categoryCounts = posts.reduce((acc, post) => {
      if (post.category) {
        acc[post.category] = (acc[post.category] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Get unique tags from posts
    const tagCounts = posts.reduce((acc, post) => {
      post.blog_tags?.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Combine categories and popular tags to create topics
    const topics: Array<{ name: string; articleCount: number; type: 'category' | 'tag' }> = [];

    // Add categories as topics
    Object.entries(categoryCounts).forEach(([name, count]) => {
      topics.push({
        name,
        articleCount: count,
        type: 'category',
      });
    });

    // Add popular tags (with at least 2 articles) as topics
    Object.entries(tagCounts)
      .filter(([_, count]) => count >= 2)
      .forEach(([name, count]) => {
        // Only add if not already a category
        if (!categoryCounts[name]) {
          topics.push({
            name,
            articleCount: count,
            type: 'tag',
          });
        }
      });

    // Sort by article count (descending) and limit to top 8
    const sortedTopics = topics
      .sort((a, b) => b.articleCount - a.articleCount)
      .slice(0, 8);

    // If we don't have enough topics, add some default ones with 0 count
    const defaultTopics = [
      "Financial Inclusion",
      "Climate Finance",
      "Blockchain",
      "AI & Technology",
      "Digital Banking",
      "Sustainable Development",
      "Gender Equality",
      "Rural Development",
    ];

    const finalTopics = sortedTopics.length > 0 
      ? sortedTopics
      : defaultTopics.map((name) => ({
          name,
          articleCount: 0,
          type: 'category' as const,
        }));

    return NextResponse.json(finalTopics);
  } catch (error) {
    console.error("Error fetching blog topics:", error);
    // Return default topics on error
    return NextResponse.json([
      { name: "Financial Inclusion", articleCount: 0, type: "category" },
      { name: "Climate Finance", articleCount: 0, type: "category" },
      { name: "Blockchain", articleCount: 0, type: "category" },
      { name: "AI & Technology", articleCount: 0, type: "category" },
      { name: "Digital Banking", articleCount: 0, type: "category" },
      { name: "Sustainable Development", articleCount: 0, type: "category" },
      { name: "Gender Equality", articleCount: 0, type: "category" },
      { name: "Rural Development", articleCount: 0, type: "category" },
    ]);
  }
}

