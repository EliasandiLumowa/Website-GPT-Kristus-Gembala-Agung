import { execSync } from "child_process";
import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

// Load .env manual jika process.loadEnvFile belum dijalankan
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

async function pushToTurso() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("❌ ERROR: TURSO_DATABASE_URL atau TURSO_AUTH_TOKEN tidak ditemukan di .env!");
    process.exit(1);
  }

  console.log("🔄 Menghasilkan DDL SQL dari prisma/schema.prisma...");
  const sql = execSync(
    "npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script",
    { encoding: "utf-8" }
  );

  console.log(`🌐 Menghubungkan ke Turso Database (${url})...`);
  const client = createClient({ url, authToken });

  console.log("🚀 Menerapkan skema tabel ke Turso...");
  await client.executeMultiple(sql);

  console.log("✅ Berhasil! Semua tabel telah dibuat di database Turso.");
}

pushToTurso().catch((err) => {
  console.error("❌ Gagal push ke Turso:", err);
  process.exit(1);
});
