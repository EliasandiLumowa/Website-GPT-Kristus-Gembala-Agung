import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const song = await prisma.song.findUnique({ where: { id } });
    if (!song) {
      return NextResponse.json({ error: "Lagu tidak ditemukan" }, { status: 404 });
    }
    return NextResponse.json(song);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const song = await prisma.song.update({
      where: { id },
      data: {
        title: body.title,
        artist: body.artist || null,
        lyrics: body.lyrics,
        category: body.category || null,
        youtubeUrl: body.youtubeUrl || null,
        isPublished: body.isPublished,
      },
    });
    return NextResponse.json(song);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate lagu" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    await prisma.song.delete({ where: { id } });
    return NextResponse.json({ message: "Lagu berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus lagu" }, { status: 500 });
  }
}
