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
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) return NextResponse.json({ error: "Event tidak ditemukan" }, { status: 404 });
    return NextResponse.json(event);
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
    const event = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        date: new Date(body.date),
        endDate: body.endDate ? new Date(body.endDate) : null,
        location: body.location || null,
        image: body.image || null,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(event);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate event" }, { status: 500 });
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
    await prisma.event.delete({ where: { id } });
    return NextResponse.json({ message: "Event berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus event" }, { status: 500 });
  }
}
