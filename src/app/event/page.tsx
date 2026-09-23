import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Event",
  description: "Event dan kegiatan gereja",
};

async function getEvents() {
  try {
    const [upcoming, past] = await Promise.all([
      prisma.event.findMany({
        where: { isActive: true, date: { gte: new Date() } },
        orderBy: { date: "asc" },
      }),
      prisma.event.findMany({
        where: { isActive: true, date: { lt: new Date() } },
        orderBy: { date: "desc" },
        take: 12,
      }),
    ]);
    return { upcoming, past };
  } catch {
    return { upcoming: [], past: [] };
  }
}

export default async function EventPage() {
  const { upcoming, past } = await getEvents();

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>
            <span className="gold-text">Event & Kegiatan</span>
          </h1>
          <p>Jadwal event dan kegiatan gereja</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Upcoming Events */}
          <div className="section-header" style={{ textAlign: "left", marginBottom: "var(--space-xl)" }}>
            <h2 style={{ fontSize: "1.5rem" }}>
              <Calendar size={24} style={{ color: "var(--color-primary)", marginRight: "8px", verticalAlign: "middle" }} />
              Event Mendatang
            </h2>
          </div>

          {upcoming.length === 0 ? (
            <div className="empty-state" style={{ padding: "var(--space-2xl)" }}>
              <p>Belum ada event mendatang</p>
            </div>
          ) : (
            <div className="grid-2" style={{ marginBottom: "var(--space-3xl)" }}>
              {upcoming.map((event) => (
                <Link key={event.id} href={`/event/${event.id}`} style={{ textDecoration: "none" }}>
                  <div className="event-card">
                    {event.image && (
                      <div style={{ aspectRatio: "16/9", overflow: "hidden" }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    )}
                    <div className="card-body" style={{ display: "flex", gap: "var(--space-lg)", alignItems: "flex-start" }}>
                      <div className="event-date-badge">
                        <span className="event-date-day">{new Date(event.date).getDate()}</span>
                        <span className="event-date-month">
                          {new Date(event.date).toLocaleDateString("id-ID", { month: "short" })}
                        </span>
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.1rem", marginBottom: "var(--space-xs)" }}>{event.title}</h3>
                        <p style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {event.description}
                        </p>
                        {event.location && (
                          <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "var(--space-sm)", display: "flex", alignItems: "center", gap: "4px" }}>
                            <MapPin size={14} /> {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Past Events */}
          {past.length > 0 && (
            <>
              <div className="section-header" style={{ textAlign: "left", marginBottom: "var(--space-xl)" }}>
                <h2 style={{ fontSize: "1.5rem", color: "var(--color-text-secondary)" }}>Event Sebelumnya</h2>
              </div>
              <div className="grid-3">
                {past.map((event) => (
                  <Link key={event.id} href={`/event/${event.id}`} style={{ textDecoration: "none" }}>
                    <div className="event-card" style={{ opacity: 0.7 }}>
                      <div className="card-body" style={{ display: "flex", gap: "var(--space-md)", alignItems: "flex-start" }}>
                        <div className="event-date-badge" style={{ minWidth: "60px", width: "60px", height: "60px" }}>
                          <span className="event-date-day" style={{ fontSize: "1.2rem" }}>{new Date(event.date).getDate()}</span>
                          <span className="event-date-month">{new Date(event.date).toLocaleDateString("id-ID", { month: "short" })}</span>
                        </div>
                        <div>
                          <h3 style={{ fontSize: "0.95rem", marginBottom: "var(--space-xs)" }}>{event.title}</h3>
                          {event.location && (
                            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                              <MapPin size={12} /> {event.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
