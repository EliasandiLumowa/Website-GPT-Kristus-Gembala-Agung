import {
  Play,
  Music,
  Newspaper,
  Calendar,
  Cake,
  Quote,
} from "lucide-react";
import prisma from "@/lib/prisma";
import Link from "next/link";

async function getStats() {
  try {
    const [sermons, songs, news, events, birthdays, quotes] =
      await Promise.all([
        prisma.sermon.count(),
        prisma.song.count(),
        prisma.news.count(),
        prisma.event.count(),
        prisma.birthday.count(),
        prisma.quote.count(),
      ]);
    return { sermons, songs, news, events, birthdays, quotes };
  } catch {
    return { sermons: 0, songs: 0, news: 0, events: 0, birthdays: 0, quotes: 0 };
  }
}

const statItems = [
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
            Selamat datang di panel admin Gereja Kristen
          </p>
        </div>
      </div>

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
              <div className="stat-label">{item.label}</div>
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
