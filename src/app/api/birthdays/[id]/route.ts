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
    const birthday = await prisma.birthday.update({
      where: { id },
      data: {
        name: body.name,
        birthDate: new Date(body.birthDate),
        photo: body.photo || null,
        isActive: body.isActive,
      },
    });
    return NextResponse.json(birthday);
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate data" }, { status: 500 });
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
    await prisma.birthday.delete({ where: { id } });
    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus data" }, { status: 500 });
  }
}
