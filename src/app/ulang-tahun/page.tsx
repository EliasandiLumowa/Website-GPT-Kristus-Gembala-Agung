import { Cake } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Ulang Tahun Jemaat",
  description: "Daftar ulang tahun jemaat Gereja Kristen",
};

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

async function getBirthdays() {
  try {
    return await prisma.birthday.findMany({
      where: { isActive: true },
      orderBy: { birthDate: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function UlangTahunPage() {
  const birthdays = await getBirthdays();

  // Group by month
  const byMonth: Record<number, typeof birthdays> = {};
  birthdays.forEach((b) => {
    const month = new Date(b.birthDate).getMonth();
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(b);
  });

  // Sort by day within each month
  Object.values(byMonth).forEach((list) =>
    list.sort((a, b) => new Date(a.birthDate).getDate() - new Date(b.birthDate).getDate())
  );

  const currentMonth = new Date().getMonth();

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>
            <span className="gold-text">Ulang Tahun Jemaat</span>
          </h1>
          <p>Selamat ulang tahun untuk setiap jemaat yang berulang tahun!</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {birthdays.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎂</div>
              <h3>Belum ada data ulang tahun</h3>
              <p>Data ulang tahun akan ditampilkan setelah admin menambahkan</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2xl)" }}>
              {Array.from({ length: 12 }, (_, i) => {
                // Start from current month
                const monthIdx = (currentMonth + i) % 12;
                const monthBirthdays = byMonth[monthIdx];
                if (!monthBirthdays || monthBirthdays.length === 0) return null;

                return (
                  <div key={monthIdx}>
                    <h2
                      style={{
                        fontSize: "1.3rem",
                        marginBottom: "var(--space-lg)",
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-sm)",
                      }}
                    >
                      <Cake
                        size={22}
                        style={{ color: "var(--color-primary)" }}
                      />
                      {monthNames[monthIdx]}
                      {monthIdx === currentMonth && (
                        <span className="badge badge-gold" style={{ marginLeft: "var(--space-sm)" }}>
                          Bulan Ini
                        </span>
                      )}
                    </h2>

                    <div className="grid-4">
                      {monthBirthdays.map((b) => (
                        <div key={b.id} className="birthday-card">
                          <div className="birthday-avatar">
                            {b.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={b.photo} alt={b.name} />
                            ) : (
                              b.name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <p className="birthday-name">{b.name}</p>
                          <p className="birthday-date">
                            {new Date(b.birthDate).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
