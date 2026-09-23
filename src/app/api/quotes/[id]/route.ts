import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const quote = await prisma.quote.update({
      where: { id },
      data: {
        content: body.content,
        author: body.author || null,
        reference: body.reference || null,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(quote);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate kutipan" }, { status: 500 });
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
    await prisma.quote.delete({ where: { id } });
    return NextResponse.json({ message: "Kutipan berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus kutipan" }, { status: 500 });
  }
}
