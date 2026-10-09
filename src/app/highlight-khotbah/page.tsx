import Link from "next/link";
import { Sparkles, Play, Search, ArrowLeft, ArrowRight, User, Calendar } from "lucide-react";
import prisma from "@/lib/prisma";
import YouTubeEmbed from "@/components/public/YouTubeEmbed";

export const metadata = {
  title: "Highlight Khotbah - GPT Kristus Gembala Agung",
  description: "Kumpulan cuplikan dan highlight khotbah firman Tuhan terbaik",
};

async function getHighlightSermons(search: string) {
  try {
    const baseWhere = search
      ? {
          isPublished: true,
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { speaker: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : { isPublished: true };

    // Ambil khotbah yang ditandai isHighlight: true
    let highlights = await prisma.sermon.findMany({
      where: {
        ...baseWhere,
        isHighlight: true,
      },
      orderBy: { date: "desc" },
      take: 20,
    });

    // Jika belum ada yang ditandai isHighlight, tampilkan khotbah terbaru sebagai fallback
    if (highlights.length === 0) {
      highlights = await prisma.sermon.findMany({
        where: baseWhere,
        orderBy: { date: "desc" },
        take: 6,
      });
    }

    return highlights;
  } catch {
    return [];
  }
}

export default async function HighlightKhotbahPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; v?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const sermons = await getHighlightSermons(search);

  // Video aktif untuk featured player
  const activeSermon = params.v
    ? sermons.find((s) => s.id === params.v) || sermons[0]
    : sermons[0];

  return (
    <>
      <section className="page-header">
        <div className="container">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 14px",
              borderRadius: "50px",
              background: "rgba(212, 160, 23, 0.15)",
              color: "var(--color-primary)",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "var(--space-md)",
              border: "1px solid rgba(212, 160, 23, 0.3)",
            }}
          >
            <Sparkles size={14} />
            Cuplikan Firman Pilihan
          </div>
          <h1>
            <span className="gold-text">Highlight</span> Khotbah
          </h1>
          <p>Dengarkan pesan firman Tuhan yang ringkas, kuat, dan membangun iman</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Top Bar: Back to all sermons & search */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "var(--space-md)",
              marginBottom: "var(--space-2xl)",
            }}
          >
            <Link
              href="/khotbah"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--color-text-secondary)",
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={16} />
              Lihat Semua Khotbah (History)
            </Link>

            <form action="/highlight-khotbah" method="GET" style={{ minWidth: "280px" }}>
              <div className="search-bar" style={{ margin: 0 }}>
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  name="search"
                  placeholder="Cari highlight..."
                  defaultValue={search}
                />
              </div>
            </form>
          </div>

          {sermons.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎬</div>
              <h3>Belum ada highlight khotbah</h3>
              <p>Admin dapat menandai khotbah sebagai highlight melalui panel admin.</p>
              <Link href="/khotbah" className="btn btn-primary" style={{ marginTop: "var(--space-md)" }}>
                Ke Halaman Khotbah
              </Link>
            </div>
          ) : (
            <>
              {/* Featured YouTube Embed Section */}
              {activeSermon && (
                <div
                  style={{
                    background: "var(--gradient-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-xl)",
                    padding: "var(--space-xl)",
                    marginBottom: "var(--space-3xl)",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                  }}
                >
                  <div style={{ maxWidth: "960px", margin: "0 auto" }}>
                    <div style={{ borderRadius: "var(--radius-lg)", overflow: "hidden", marginBottom: "var(--space-lg)" }}>
                      <YouTubeEmbed
                        url={activeSermon.youtubeUrl}
                        title={activeSermon.title}
                      />
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        flexWrap: "wrap",
                        gap: "var(--space-md)",
                      }}
                    >
                      <div style={{ flex: 1, minWidth: "280px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "var(--space-xs)" }}>
                          <span className="badge badge-gold">⭐ Featured Highlight</span>
                          <span style={{ color: "var(--color-text-muted)", fontSize: "0.85rem" }}>
                            {new Date(activeSermon.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h2 style={{ fontSize: "1.5rem", color: "var(--color-white)", marginTop: "4px" }}>
                          {activeSermon.title}
                        </h2>
                        <p style={{ color: "var(--color-primary)", fontWeight: 500, fontSize: "0.95rem" }}>
                          Pembicara: {activeSermon.speaker}
                        </p>
                        {activeSermon.description && (
                          <p
                            style={{
                              color: "var(--color-text-secondary)",
                              fontSize: "0.9rem",
                              marginTop: "var(--space-sm)",
                              lineHeight: 1.6,
                            }}
                          >
                            {activeSermon.description}
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/khotbah/${activeSermon.id}`}
                        className="btn btn-outline"
                        style={{ alignSelf: "flex-start" }}
                      >
                        Detail Khotbah
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Highlight Video Embeds / Cards */}
              <div className="section-header" style={{ textAlign: "left", marginBottom: "var(--space-xl)" }}>
                <h3>Daftar Video Highlight</h3>
                <p>Klik salah satu video untuk memutar atau melihat detailnya</p>
              </div>

              <div className="grid-3">
                {sermons.map((sermon) => {
                  const videoId = sermon.youtubeUrl.match(
                    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
                  );
                  const isCurrent = activeSermon?.id === sermon.id;

                  return (
                    <div
                      key={sermon.id}
                      style={{
                        background: isCurrent ? "rgba(212, 160, 23, 0.08)" : "var(--gradient-card)",
                        border: isCurrent ? "1px solid var(--color-primary)" : "1px solid var(--color-border)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* Video Frame or Interactive Player */}
                      <div style={{ position: "relative" }}>
                        <YouTubeEmbed url={sermon.youtubeUrl} title={sermon.title} />
                      </div>

                      <div style={{ padding: "var(--space-md)", flex: 1, display: "flex", flexDirection: "column" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "6px",
                            fontSize: "0.8rem",
                            color: "var(--color-text-muted)",
                          }}
                        >
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <Calendar size={13} style={{ color: "var(--color-primary)" }} />
                            {new Date(sermon.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          <span>•</span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                            <User size={13} style={{ color: "var(--color-primary)" }} />
                            {sermon.speaker}
                          </span>
                        </div>

                        <h4
                          style={{
                            fontSize: "1rem",
                            color: "var(--color-white)",
                            marginBottom: "var(--space-sm)",
                            lineHeight: 1.4,
                          }}
                        >
                          {sermon.title}
                        </h4>

                        {sermon.description && (
                          <p
                            style={{
                              color: "var(--color-text-secondary)",
                              fontSize: "0.85rem",
                              lineHeight: 1.5,
                              marginBottom: "var(--space-md)",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {sermon.description}
                          </p>
                        )}

                        <div style={{ marginTop: "auto", display: "flex", gap: "var(--space-xs)" }}>
                          <Link
                            href={`/highlight-khotbah?v=${sermon.id}${search ? `&search=${search}` : ""}`}
                            className="btn btn-outline"
                            style={{ flex: 1, fontSize: "0.8rem", padding: "6px 12px", justifyContent: "center" }}
                          >
                            <Play size={14} />
                            Fokus Player
                          </Link>
                          <Link
                            href={`/khotbah/${sermon.id}`}
                            className="btn btn-primary"
                            style={{ fontSize: "0.8rem", padding: "6px 12px", justifyContent: "center" }}
                          >
                            Detail
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
