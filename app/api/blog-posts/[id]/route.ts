import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const data = await req.json();
    const { id } = await params;

    // Calculate read time based on description length
    const wordCount = data.description?.split(/\s+/).length || 0;
    const readTimeMinutes = Math.ceil(wordCount / 200) || 1;
    const readTime = `${readTimeMinutes} min`;

    const blogPost = await prisma.blogPost.update({
      where: { id },
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
        updated_at_Date: new Date(),
      },
    });

    return NextResponse.json(blogPost);
  } catch (error) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Blog post deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}

