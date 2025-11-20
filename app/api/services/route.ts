import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        name: true,
        nameKey: true,
        description: true,
        category: true,
        status: true,
        icon: true,
        image: true,
        users: true,
        revenue: true,
        growth: true,
        keyFeatures: true,
        requirements: true,
        created_at: true,
        updated_at: true,
      },
    });

    // Debug: Log first service to check if icon/image are present
    if (process.env.NODE_ENV === 'development' && services.length > 0) {
      console.log('API: First service from DB:', services[0])
      console.log('API: Icon field:', services[0].icon, 'Image field:', services[0].image)
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const service = await prisma.service.create({
      data: {
        name: data.name,
        nameKey: data.nameKey || null,
        description: data.description,
        category: data.category,
        status: data.status || 'active',
        icon: data.icon || null,
        image: data.image || null,
        users: data.users || 0,
        revenue: data.revenue || 0,
        growth: data.growth || 0,
        keyFeatures: data.keyFeatures || [],
        requirements: data.requirements || [],
      },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}

