import Link from "next/link";
import { Music, Search, ArrowLeft, ArrowRight, FileText, ImageIcon, Play, Sparkles } from "lucide-react";
import prisma from "@/lib/prisma";
import YouTubeEmbed from "@/components/public/YouTubeEmbed";

export const metadata = {
  title: "Lagu Ciptaan Sendiri - GPT Kristus Gembala Agung",
  description: "Kumpulan lagu pujian dan penyembahan karya orisinal jemaat dan pelayan gereja",
};

async function getOriginalSongs(search: string) {
  try {
    const where: Record<string, unknown> = {
      isPublished: true,
      isOriginal: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" as const } },
        { artist: { contains: search, mode: "insensitive" as const } },
      ];
    }

    const songs = await prisma.song.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return songs;
  } catch {
    return [];
  }
}

export default async function LaguCiptaanSendiriPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; v?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const songs = await getOriginalSongs(search);

  // Lagu yang aktif untuk featured video player
  const activeSong = params.v
    ? songs.find((s) => s.id === params.v) || songs.find((s) => s.youtubeUrl) || songs[0]
    : songs.find((s) => s.youtubeUrl) || songs[0];

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
            Karya Orisinal Gereja
          </div>
          <h1>
            <span className="gold-text">Lagu Ciptaan</span> Sendiri
          </h1>
          <p>Kumpulan lagu pujian dan penyembahan ciptaan jemaat dan pelayan GPT Kristus Gembala Agung</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Top navigation tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "var(--space-md)",
              marginBottom: "var(--space-2xl)",
              borderBottom: "1px solid var(--color-border)",
              paddingBottom: "var(--space-md)",
            }}
          >
            <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
              <Link href="/lagu" className="btn btn-outline" style={{ fontSize: "0.88rem" }}>
                Semua Lagu & Lirik
              </Link>
              <Link href="/lagu/ciptaan-sendiri" className="btn btn-primary" style={{ fontSize: "0.88rem" }}>
                <Sparkles size={16} />
                Lagu Ciptaan Sendiri
              </Link>
            </div>

            <form action="/lagu/ciptaan-sendiri" method="GET" style={{ minWidth: "260px" }}>
              <div className="search-bar" style={{ margin: 0 }}>
                <Search className="search-icon" size={16} />
                <input
                  type="text"
                  name="search"
                  placeholder="Cari lagu ciptaan..."
                  defaultValue={search}
                />
              </div>
            </form>
          </div>

          {songs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎼</div>
              <h3>Belum ada lagu ciptaan sendiri</h3>
              <p>
                Lagu karya ciptaan jemaat akan ditampilkan di sini setelah admin menambahkan data melalui panel admin dengan mencentang opsi &quot;Lagu Ciptaan Sendiri&quot;.
              </p>
              <Link href="/lagu" className="btn btn-primary" style={{ marginTop: "var(--space-md)" }}>
                Lihat Semua Lagu
              </Link>
            </div>
          ) : (
            <>
              {/* Featured YouTube Embed Section (Sama seperti khotbah diembed dari youtube) */}
              {activeSong && activeSong.youtubeUrl && (
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
                        url={activeSong.youtubeUrl}
                        title={activeSong.title}
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
                          <span className="badge badge-gold">⭐ Lagu Ciptaan Sendiri</span>
                          {activeSong.category && (
                            <span className="badge badge-primary">{activeSong.category}</span>
                          )}
                        </div>
                        <h2 style={{ fontSize: "1.5rem", color: "var(--color-white)", marginTop: "4px" }}>
                          {activeSong.title}
                        </h2>
                        {activeSong.artist && (
                          <p style={{ color: "var(--color-primary)", fontWeight: 500, fontSize: "0.95rem" }}>
                            Ciptaan / Artis: {activeSong.artist}
                          </p>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                        {activeSong.fileUrl && (
                          <a
                            href={activeSong.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                          >
                            {activeSong.fileUrl.toLowerCase().includes(".pdf") ? (
                              <>
                                <FileText size={16} /> Unduh Partitur (PDF)
                              </>
                            ) : (
                              <>
                                <ImageIcon size={16} /> Lihat Chord (Gambar)
                              </>
                            )}
                          </a>
                        )}
                        <Link href={`/lagu/${activeSong.id}`} className="btn btn-outline">
                          Lirik Lengkap
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Original Song Cards / Video Embeds */}
              <div className="section-header" style={{ textAlign: "left", marginBottom: "var(--space-xl)" }}>
                <h3>Daftar Lagu Ciptaan Sendiri</h3>
                <p>Dilengkapi video embed YouTube, lirik, dan partitur not angka/chord</p>
              </div>

              <div className="grid-2">
                {songs.map((song) => {
                  const hasPdf = song.fileUrl?.toLowerCase().includes(".pdf");
                  const hasImage = song.fileUrl && !hasPdf;

                  return (
                    <div
                      key={song.id}
                      style={{
                        background: "var(--gradient-card)",
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius-lg)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {/* Embed YouTube if available */}
                      {song.youtubeUrl ? (
                        <div style={{ position: "relative" }}>
                          <YouTubeEmbed url={song.youtubeUrl} title={song.title} />
                        </div>
                      ) : (
                        <div
                          style={{
                            height: "140px",
                            background: "linear-gradient(135deg, rgba(212, 160, 23, 0.15) 0%, rgba(10, 10, 10, 0.9) 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderBottom: "1px solid var(--color-border)",
                          }}
                        >
                          <Music size={48} style={{ color: "var(--color-primary)", opacity: 0.8 }} />
                        </div>
                      )}

                      <div style={{ padding: "var(--space-lg)", flex: 1, display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "var(--space-xs)" }}>
                          <span className="badge badge-gold" style={{ fontSize: "0.75rem" }}>
                            Ciptaan Sendiri
                          </span>
                          {song.category && (
                            <span className="badge" style={{ fontSize: "0.75rem", background: "var(--black-700)" }}>
                              {song.category}
                            </span>
                          )}
                          {song.fileUrl && (
                            <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>
                              {hasPdf ? "📄 Partitur PDF" : "🖼️ Chord Gambar"}
                            </span>
                          )}
                        </div>

                        <h3 style={{ fontSize: "1.2rem", color: "var(--color-white)", marginTop: "4px", marginBottom: "4px" }}>
                          {song.title}
                        </h3>

                        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "var(--space-md)" }}>
                          {song.artist ? `Ciptaan: ${song.artist}` : "Karya Jemaat GPT Kristus Gembala Agung"}
                        </p>

                        {/* Lyrics snippet */}
                        <div
                          style={{
                            background: "var(--black-800)",
                            border: "1px solid var(--color-border)",
                            borderRadius: "var(--radius-md)",
                            padding: "var(--space-sm) var(--space-md)",
                            fontSize: "0.85rem",
                            color: "var(--color-text-muted)",
                            fontStyle: "italic",
                            lineHeight: 1.5,
                            maxHeight: "80px",
                            overflow: "hidden",
                            whiteSpace: "pre-line",
                            marginBottom: "var(--space-md)",
                          }}
                        >
                          {song.lyrics}
                        </div>

                        {/* Action buttons */}
                        <div
                          style={{
                            marginTop: "auto",
                            display: "flex",
                            gap: "var(--space-xs)",
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <Link
                            href={`/lagu/${song.id}`}
                            className="btn btn-primary"
                            style={{ flex: 1, fontSize: "0.85rem", padding: "8px 14px", justifyContent: "center" }}
                          >
                            Buka Lirik & Detail
                          </Link>

                          {song.fileUrl && (
                            <a
                              href={song.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline"
                              style={{ fontSize: "0.85rem", padding: "8px 14px" }}
                              title="Buka lampiran file"
                            >
                              {hasPdf ? <FileText size={15} /> : <ImageIcon size={15} />}
                              {hasPdf ? "PDF" : "Partitur"}
                            </a>
                          )}
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
