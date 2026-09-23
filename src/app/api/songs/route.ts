import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";

    const where = search
      ? {
          isPublished: true,
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { artist: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : { isPublished: true };

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        where,
        orderBy: { title: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.song.count({ where }),
    ]);

    return NextResponse.json({
      data: songs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data lagu" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const song = await prisma.song.create({
      data: {
        title: body.title,
        artist: body.artist || null,
        lyrics: body.lyrics,
        category: body.category || null,
        youtubeUrl: body.youtubeUrl || null,
        isPublished: body.isPublished ?? true,
      },
    });

    return NextResponse.json(song, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menambahkan lagu" }, { status: 500 });
  }
}
