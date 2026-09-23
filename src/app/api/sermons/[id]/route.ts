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
    const sermon = await prisma.sermon.findUnique({ where: { id } });
    if (!sermon) {
      return NextResponse.json(
        { error: "Khotbah tidak ditemukan" },
        { status: 404 }
      );
    }
    return NextResponse.json(sermon);
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
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const sermon = await prisma.sermon.update({
      where: { id },
      data: {
        title: body.title,
        speaker: body.speaker,
        date: new Date(body.date),
        youtubeUrl: body.youtubeUrl,
        description: body.description || null,
        thumbnail: body.thumbnail || null,
        isPublished: body.isPublished,
      },
    });

    return NextResponse.json(sermon);
  } catch {
    return NextResponse.json(
      { error: "Gagal mengupdate khotbah" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await prisma.sermon.delete({ where: { id } });
    return NextResponse.json({ message: "Khotbah berhasil dihapus" });
  } catch {
    return NextResponse.json(
      { error: "Gagal menghapus khotbah" },
      { status: 500 }
    );
  }
}
