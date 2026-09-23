import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const upcoming = searchParams.get("upcoming") === "true";

    const where = upcoming
      ? { isActive: true, date: { gte: new Date() } }
      : { isActive: true };

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        orderBy: { date: upcoming ? "asc" : "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.event.count({ where }),
    ]);

    return NextResponse.json({ data: events, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data event" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const event = await prisma.event.create({
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location || null,
        image: body.image || null,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menambahkan event" }, { status: 500 });
  }
}
