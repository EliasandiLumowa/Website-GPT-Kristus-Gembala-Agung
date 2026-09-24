import { prisma } from "../src/lib/prisma";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

// Pastikan .env dimuat jika dijalankan via tsx langsung
const envPath = path.join(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}


async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@gereja.com" },
    update: {},
    create: {
      email: "admin@gereja.com",
      password: hashedPassword,
      name: "Admin Gereja",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create sample quotes
  const quotes = await Promise.all([
    prisma.quote.create({
      data: {
        content:
          "Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman TUHAN, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan.",
        author: "Firman Tuhan",
        reference: "Yeremia 29:11",
        isActive: true,
      },
    }),
    prisma.quote.create({
      data: {
        content:
          "Diberkatilah orang yang mengandalkan TUHAN, yang menaruh harapannya pada TUHAN!",
        author: "Firman Tuhan",
        reference: "Yeremia 17:7",
        isActive: true,
      },
    }),
    prisma.quote.create({
      data: {
        content:
          "TUHAN adalah gembalaku, takkan kekurangan aku.",
        author: "Daud",
        reference: "Mazmur 23:1",
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ ${quotes.length} quotes created`);

  // Create sample sermon
  const sermon = await prisma.sermon.create({
    data: {
      title: "Khotbah Minggu - Beriman dalam Tindakan",
      speaker: "Pendeta",
      date: new Date(),
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      description: "Khotbah tentang pentingnya mewujudkan iman dalam tindakan nyata sehari-hari.",
      isPublished: true,
    },
  });
  console.log("✅ Sample sermon created:", sermon.title);

  // Create sample news
  const news = await prisma.news.create({
    data: {
      title: "Selamat Datang di Website Gereja",
      slug: "selamat-datang-di-website-gereja",
      content: "Puji Tuhan! Website resmi gereja kita telah hadir. Melalui website ini, jemaat dapat mengakses informasi terbaru, jadwal ibadah, khotbah, dan berbagai informasi penting lainnya.\n\nMari kita gunakan teknologi ini untuk semakin mendekatkan diri kepada Tuhan dan sesama.\n\nTuhan memberkati!",
      excerpt: "Website resmi gereja telah hadir untuk melayani jemaat.",
      isPublished: true,
      publishedAt: new Date(),
    },
  });
  console.log("✅ Sample news created:", news.title);

  // Create sample birthday
  const birthday = await prisma.birthday.create({
    data: {
      name: "Contoh Jemaat",
      birthDate: new Date(1990, new Date().getMonth(), new Date().getDate() + 2),
      isActive: true,
    },
  });
  console.log("✅ Sample birthday created:", birthday.name);

  console.log("\n🎉 Seeding complete!");
  console.log("📧 Admin login: admin@gereja.com / admin123");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
