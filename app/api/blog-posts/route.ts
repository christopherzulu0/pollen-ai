import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Calculate read time based on description length (rough estimate: 200 words per minute)
    const wordCount = data.description?.split(/\s+/).length || 0;
    const readTimeMinutes = Math.ceil(wordCount / 200) || 1;
    const readTime = `${readTimeMinutes} min`;

    const blogPost = await prisma.blogPost.create({
      data: {
        title: data.title,
        Description: data.description || '',
        author: data.author,
        author_Position: data.authorPosition || 'Author',
        category: data.category || null,
        status: data.status || 'draft',
        Blog_image: data.image || '',
        blog_tags: data.tags || [],
        read_time: readTime,
        likes: 0,
        views: 0,
        engagement: 0,
      },
    });

    return NextResponse.json(blogPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
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

      return NextResponse.json(post);
    }

    const posts = await prisma.blogPost.findMany({
      orderBy: {
        posted_at: 'desc',
      },
      include: {
        blog_comments: {
          orderBy: {
            comment_at: 'desc',
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

