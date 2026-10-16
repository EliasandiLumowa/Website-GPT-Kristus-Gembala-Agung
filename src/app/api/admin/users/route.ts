import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  // Pastikan hanya ADMIN yang bisa mengakses
  if (!session || (session.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        nik: true,
        name: true,
        umur: true,
        jenisKelamin: true,
        tanggalLahir: true,
        statusMenikah: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        pasangan: {
          select: {
            id: true,
            nik: true,
            name: true,
            umur: true,
            jenisKelamin: true,
            tanggalLahir: true,
          }
        },
        anak: {
          select: {
            id: true,
            nik: true,
            name: true,
            umur: true,
            jenisKelamin: true,
            tanggalLahir: true,
          }
        }
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Gagal mengambil data user:", error);
    return NextResponse.json({ error: "Gagal mengambil data user" }, { status: 500 });
  }
}