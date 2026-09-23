import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month");

    const birthdays = await prisma.birthday.findMany({
      where: { isActive: true },
      orderBy: { birthDate: "asc" },
    });

    // Filter by month if specified
    const filtered = month
      ? birthdays.filter(
          (b) => new Date(b.birthDate).getMonth() === parseInt(month) - 1
        )
      : birthdays;

    return NextResponse.json({ data: filtered, total: filtered.length });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const birthday = await prisma.birthday.create({
      data: {
        name: body.name,
        birthDate: new Date(body.birthDate),
        photo: body.photo || null,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(birthday, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menambahkan data" }, { status: 500 });
  }
}
