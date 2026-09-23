import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import prisma from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } }).catch(() => null);
  return {
    title: event?.title || "Event",
    description: event?.description?.slice(0, 160) || "Detail event gereja",
  };
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let event;
  try {
    event = await prisma.event.findUnique({ where: { id } });
  } catch {
    notFound();
  }
  if (!event) notFound();

  return (
    <>
      <section className="page-header" style={{ paddingBottom: "var(--space-xl)" }}>
        <div className="container">
          <Link href="/event" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-sm)", color: "var(--color-text-secondary)", marginBottom: "var(--space-lg)", fontSize: "0.9rem", position: "relative", zIndex: 1 }}>
            <ArrowLeft size={16} /> Kembali ke Event
          </Link>
          <h1 style={{ position: "relative", zIndex: 1 }}>{event.title}</h1>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-xl)", marginTop: "var(--space-md)", color: "var(--color-text-secondary)", fontSize: "0.9rem", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={16} style={{ color: "var(--color-primary)" }} />
              {new Date(event.date).toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </span>
            {event.location && (
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <MapPin size={16} style={{ color: "var(--color-primary)" }} />
                {event.location}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "var(--space-2xl)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          {event.image && (
            <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "var(--space-2xl)", border: "1px solid var(--color-border)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={event.image} alt={event.title} style={{ width: "100%", display: "block" }} />
            </div>
          )}
          <div style={{ background: "var(--gradient-card)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)", padding: "var(--space-2xl) var(--space-xl)", lineHeight: 2, fontSize: "1.05rem", color: "var(--color-text)", whiteSpace: "pre-line" }}>
            {event.description}
          </div>
        </div>
      </section>
    </>
  );
}
