import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 }
      );
    }

    // Validasi tipe file gambar
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "image/svg+xml",
    ];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Harap unggah gambar (JPG, PNG, WebP, GIF, SVG)" },
        { status: 400 }
      );
    }

    // Maksimal 10MB
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Ukuran gambar terlalu besar. Maksimal 10MB." },
        { status: 400 }
      );
    }

    // Ekstrak ekstensi file
    let ext = path.extname(file.name).toLowerCase();
    if (!ext) {
      if (file.type === "image/png") ext = ".png";
      else if (file.type === "image/jpeg") ext = ".jpg";
      else if (file.type === "image/webp") ext = ".webp";
      else if (file.type === "image/gif") ext = ".gif";
      else ext = ".png";
    }

    const uniqueName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Pastikan folder public/uploads sudah ada
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, uniqueName);
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    const publicUrl = `/uploads/${uniqueName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: uniqueName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
