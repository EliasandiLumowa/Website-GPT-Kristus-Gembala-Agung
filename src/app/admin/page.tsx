import {
  Play,
  Music,
  Newspaper,
  Calendar,
  Cake,
  Quote,
  Users,
  UserCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

async function getStats() {
  try {
    const [sermons, songs, news, events, birthdays, quotes, users, pendingUsers] =
      await Promise.all([
        prisma.sermon.count(),
        prisma.song.count(),
        prisma.news.count(),
        prisma.event.count(),
        prisma.birthday.count(),
        prisma.quote.count(),
        prisma.user.count(),
        prisma.user.count({ where: { isActive: false } }),
      ]);
    return { sermons, songs, news, events, birthdays, quotes, users, pendingUsers };
  } catch {
    return { sermons: 0, songs: 0, news: 0, events: 0, birthdays: 0, quotes: 0, users: 0, pendingUsers: 0 };
  }
}

const statItems = [
  { key: "users", label: "Total Jemaat", icon: Users, href: "/admin/users" },
  { key: "sermons", label: "Khotbah", icon: Play, href: "/admin/khotbah" },
  { key: "songs", label: "Lagu", icon: Music, href: "/admin/lagu" },
  { key: "news", label: "Berita", icon: Newspaper, href: "/admin/berita" },
  { key: "events", label: "Event", icon: Calendar, href: "/admin/event" },
  { key: "birthdays", label: "Ulang Tahun", icon: Cake, href: "/admin/ulang-tahun" },
  { key: "quotes", label: "Kutipan", icon: Quote, href: "/admin/kutipan" },
];

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Dashboard</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
            Selamat datang di panel admin GPT Kristus Gembala Agung
          </p>
        </div>
      </div>

      {stats.pendingUsers > 0 && (
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: "var(--radius-lg)",
            padding: "1rem 1.25rem",
            marginBottom: "var(--space-xl)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            boxShadow: "0 2px 4px rgba(245, 158, 11, 0.05)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ background: "#fef3c7", padding: "8px", borderRadius: "8px", color: "#d97706" }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h4 style={{ margin: 0, color: "#92400e", fontSize: "0.98rem", fontWeight: 700 }}>
                {stats.pendingUsers} Akun Jemaat Menunggu Persetujuan
              </h4>
              <p style={{ margin: "2px 0 0", color: "#b45309", fontSize: "0.85rem" }}>
                Ada pendaftaran akun baru yang belum disetujui. Silakan cek data keluarga dan setujui akun.
              </p>
            </div>
          </div>
          <Link
            href="/admin/users?filter=pending"
            className="btn btn-primary"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <UserCheck size={16} />
            Tinjau Jemaat ({stats.pendingUsers})
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <div className="stats-grid">
        {statItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            style={{ textDecoration: "none" }}
          >
            <div className="stat-card">
              <div className="stat-icon">
                <item.icon size={22} />
              </div>
              <div className="stat-value">
                {stats[item.key as keyof typeof stats]}
              </div>
              <div className="stat-label">
                {item.label}
                {item.key === "users" && stats.pendingUsers > 0 && (
                  <span
                    style={{
                      marginLeft: "6px",
                      background: "#ef4444",
                      color: "white",
                      fontSize: "0.7rem",
                      padding: "2px 6px",
                      borderRadius: "999px",
                      fontWeight: "bold",
                    }}
                  >
                    {stats.pendingUsers} Baru
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div
        style={{
          background: "var(--gradient-card)",
          border: "1px solid var(--color-border)",
          borderRadius: "var(--radius-lg)",
          padding: "var(--space-xl)",
        }}
      >
        <h3 style={{ marginBottom: "var(--space-md)", fontSize: "1.1rem" }}>
          Panduan Cepat
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "var(--space-md)",
          }}
        >
          {statItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="quick-guide-link"
            >
              <item.icon size={16} />
              Kelola {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
