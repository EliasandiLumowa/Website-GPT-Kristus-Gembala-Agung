import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          isPublished: true,
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { speaker: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : { isPublished: true };

    const [sermons, total] = await Promise.all([
      prisma.sermon.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sermon.count({ where }),
    ]);

    return NextResponse.json({
      data: sermons,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengambil data khotbah" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const sermon = await prisma.sermon.create({
      data: {
        title: body.title,
        speaker: body.speaker,
        date: new Date(body.date),
        youtubeUrl: body.youtubeUrl,
        description: body.description || null,
        thumbnail: body.thumbnail || null,
        isPublished: body.isPublished ?? true,
      },
    });

    return NextResponse.json(sermon, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menambahkan khotbah" },
      { status: 500 }
    );
  }
}
