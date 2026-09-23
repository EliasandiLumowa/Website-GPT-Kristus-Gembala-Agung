import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const quotes = await prisma.quote.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ data: quotes, total: quotes.length });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const quote = await prisma.quote.create({
      data: {
        content: body.content,
        author: body.author || null,
        reference: body.reference || null,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json(quote, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menambahkan kutipan" }, { status: 500 });
  }
}
