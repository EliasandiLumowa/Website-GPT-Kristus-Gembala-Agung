import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    const body = await request.json();
    const { isActive, name, nik, umur, jenisKelamin, statusMenikah } = body;

    const dataToUpdate: any = {};
    if (typeof isActive === "boolean") {
      dataToUpdate.isActive = isActive;
    }
    if (name) dataToUpdate.name = name.trim();
    if (nik) dataToUpdate.nik = nik.trim();
    if (umur !== undefined) {
      dataToUpdate.umur = typeof umur === "number" ? umur : parseInt(umur, 10) || null;
    }
    if (jenisKelamin) dataToUpdate.jenisKelamin = jenisKelamin;
    if (statusMenikah) dataToUpdate.statusMenikah = statusMenikah;

    const user = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      include: {
        pasangan: true,
        anak: true,
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Gagal mengupdate user:", error);
    return NextResponse.json({ error: "Gagal mengupdate status user" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const { id } = resolvedParams;

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "User berhasil dihapus" });
  } catch (error) {
    console.error("Gagal menghapus user:", error);
    return NextResponse.json({ error: "Gagal menghapus user" }, { status: 500 });
  }
}