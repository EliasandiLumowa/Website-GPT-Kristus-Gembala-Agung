import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const admin = searchParams.get("admin") === "true";

    const where = search
      ? {
          ...(admin ? {} : { isPublished: true }),
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : admin ? {} : { isPublished: true };

    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({
      data: news,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil data berita" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();

    // Generate slug
    let slug = body.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Ensure unique slug
    const existing = await prisma.news.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const news = await prisma.news.create({
      data: {
        title: body.title,
        slug,
        content: body.content,
        excerpt: body.excerpt || null,
        image: body.image || null,
        isPublished: body.isPublished ?? false,
        publishedAt: body.isPublished ? new Date() : null,
      },
    });

    return NextResponse.json(news, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Gagal menambahkan berita" }, { status: 500 });
  }
}
