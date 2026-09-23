import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    // Try by slug first, then by id
    let news = await prisma.news.findUnique({ where: { slug } });
    if (!news) {
      news = await prisma.news.findUnique({ where: { id: slug } });
    }
    if (!news) return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });
    return NextResponse.json(news);
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    const body = await req.json();

    // Find by slug or id
    let existing = await prisma.news.findUnique({ where: { slug } });
    if (!existing) {
      existing = await prisma.news.findUnique({ where: { id: slug } });
    }
    if (!existing) return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });

    const news = await prisma.news.update({
      where: { id: existing.id },
      data: {
        title: body.title,
        content: body.content,
        excerpt: body.excerpt || null,
        image: body.image || null,
        isPublished: body.isPublished,
        publishedAt: body.isPublished && !existing.publishedAt ? new Date() : existing.publishedAt,
      },
    });
    return NextResponse.json(news);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate berita" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { slug } = await params;
    let existing = await prisma.news.findUnique({ where: { slug } });
    if (!existing) {
      existing = await prisma.news.findUnique({ where: { id: slug } });
    }
    if (!existing) return NextResponse.json({ error: "Berita tidak ditemukan" }, { status: 404 });

    await prisma.news.delete({ where: { id: existing.id } });
    return NextResponse.json({ message: "Berita berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus berita" }, { status: 500 });
  }
}
