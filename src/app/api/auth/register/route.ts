import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      username, 
      password, 
      nik, 
      name, 
      umur,
      jenisKelamin, 
      tanggalLahir, 
      statusMenikah, 
      pasangan, 
      anak 
    } = body;

    // Validasi data wajib
    if (!username || !password || !nik || !name || umur === undefined || !jenisKelamin || !statusMenikah) {
      return NextResponse.json(
        { error: "Semua kolom wajib Kepala Keluarga harus diisi" }, 
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password minimal 6 karakter" },
        { status: 400 }
      );
    }

    // 1. Cek apakah username sudah dipakai oleh Admin
    const existingAdmin = await prisma.admin.findUnique({ where: { username } });
    if (existingAdmin) {
      return NextResponse.json({ error: "Username tidak tersedia" }, { status: 400 });
    }

    // 2. Cek apakah username atau NIK sudah terdaftar di Jemaat
    const existingUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { username }, 
          { nik }
        ] 
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return NextResponse.json({ error: "Username sudah digunakan, silakan pilih username lain" }, { status: 400 });
      }
      if (existingUser.nik === nik) {
        return NextResponse.json({ error: "NIK Kepala Keluarga sudah terdaftar" }, { status: 400 });
      }
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    const parsedUmur = typeof umur === "number" ? umur : parseInt(umur, 10) || null;
    const isMarried = statusMenikah === "Sudah Menikah" || statusMenikah === "Menikah";

    // 4. Simpan ke database beserta data keluarga (Nested Write)
    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        password: hashedPassword,
        nik: nik.trim(),
        name: name.trim(),
        umur: parsedUmur,
        jenisKelamin,
        tanggalLahir: tanggalLahir ? new Date(tanggalLahir) : null,
        statusMenikah,
        isActive: false, // Menunggu persetujuan admin
        pasangan: isMarried && pasangan && pasangan.name ? {
          create: {
            nik: pasangan.nik ? pasangan.nik.trim() : null,
            name: pasangan.name.trim(),
            umur: pasangan.umur ? (typeof pasangan.umur === "number" ? pasangan.umur : parseInt(pasangan.umur, 10)) : null,
            jenisKelamin: pasangan.jenisKelamin || "Perempuan",
            tanggalLahir: pasangan.tanggalLahir ? new Date(pasangan.tanggalLahir) : null
          }
        } : undefined,
        anak: anak && Array.isArray(anak) && anak.length > 0 ? {
          create: anak
            .filter((a: any) => a && a.name && a.name.trim().length > 0)
            .map((a: any) => ({
              nik: a.nik ? a.nik.trim() : null,
              name: a.name.trim(),
              umur: a.umur ? (typeof a.umur === "number" ? a.umur : parseInt(a.umur, 10)) : null,
              jenisKelamin: a.jenisKelamin || "Laki-laki",
              tanggalLahir: a.tanggalLahir ? new Date(a.tanggalLahir) : null
            }))
        } : undefined
      },
      include: {
        pasangan: true,
        anak: true
      }
    });

    return NextResponse.json({ 
      message: "Pendaftaran berhasil. Akun sedang menunggu persetujuan admin.", 
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
        nik: newUser.nik,
        isActive: newUser.isActive
      } 
    }, { status: 201 });
  } catch (error) {
    console.error("Error register:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server saat mendaftar" }, { status: 500 });
  }
}