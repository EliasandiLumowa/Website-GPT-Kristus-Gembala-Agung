import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Music, User, FileText, Download, ExternalLink, Sparkles, Image as ImageIcon } from "lucide-react";
import prisma from "@/lib/prisma";
import YouTubeEmbed from "@/components/public/YouTubeEmbed";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const song = await prisma.song.findUnique({ where: { id } }).catch(() => null);
  return {
    title: song ? `${song.title} - Lyrics & Chord` : "Lagu",
    description: song
      ? `Lirik lagu ${song.title}${song.artist ? ` oleh ${song.artist}` : ""}`
      : "Detail lagu",
  };
}

export default async function LaguDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let song;
  try {
    song = await prisma.song.findUnique({ where: { id } });
  } catch {
    notFound();
  }

  if (!song) notFound();

  const isPdf = song.fileUrl?.toLowerCase().includes(".pdf");
  const isImage = song.fileUrl && !isPdf;

  return (
    <>
      <section className="page-header" style={{ paddingBottom: "var(--space-xl)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-md)", marginBottom: "var(--space-lg)" }}>
            <Link
              href={song.isOriginal ? "/lagu/ciptaan-sendiri" : "/lagu"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "var(--space-sm)",
                color: "var(--color-text-secondary)",
                fontSize: "0.9rem",
                position: "relative",
                zIndex: 1,
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={16} />
              {song.isOriginal ? "Kembali ke Lagu Ciptaan Sendiri" : "Kembali ke Daftar Lagu"}
            </Link>
          </div>

          <h1 style={{ position: "relative", zIndex: 1 }}>
            <Music
              size={32}
              style={{
                color: "var(--color-primary)",
                marginRight: "12px",
                verticalAlign: "middle",
              }}
            />
            {song.title}
          </h1>

          {song.artist && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "var(--space-md)",
                color: "var(--color-text-secondary)",
                fontSize: "0.95rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              <User size={16} style={{ color: "var(--color-primary)" }} />
              {song.artist}
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "8px",
              marginTop: "var(--space-md)",
              position: "relative",
              zIndex: 1,
              flexWrap: "wrap",
            }}
          >
            {song.isOriginal && (
              <span className="badge badge-gold" style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <Sparkles size={13} />
                Lagu Ciptaan Sendiri
              </span>
            )}
            {song.category && (
              <span className="badge badge-primary">{song.category}</span>
            )}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "var(--space-2xl)" }}>
        <div className="container" style={{ maxWidth: "850px" }}>
          {/* YouTube Video Embed */}
          {song.youtubeUrl && (
            <div style={{ marginBottom: "var(--space-2xl)" }}>
              <YouTubeEmbed url={song.youtubeUrl} title={song.title} />
            </div>
          )}

          {/* Lampiran Partitur / Dokumen PDF / Gambar Chord */}
          {song.fileUrl && (
            <div
              style={{
                marginBottom: "var(--space-2xl)",
                padding: "var(--space-lg)",
                background: "var(--gradient-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "var(--space-md)",
                  marginBottom: isPdf ? "var(--space-md)" : 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "var(--radius-md)",
                      background: "rgba(212, 160, 23, 0.15)",
                      color: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isPdf ? <FileText size={24} /> : <ImageIcon size={24} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.05rem", color: "var(--color-white)", margin: 0 }}>
                      {isPdf ? "Partitur / Chord Lagu (Dokumen PDF)" : "Partitur / Chord Lagu (Gambar)"}
                    </h3>
                    <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem", margin: "2px 0 0" }}>
                      Tersedia lampiran not angka / chord resmi
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "var(--space-sm)", flexWrap: "wrap" }}>
                  <a
                    href={song.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ fontSize: "0.85rem", padding: "8px 14px" }}
                  >
                    <ExternalLink size={15} />
                    Buka di Tab Baru
                  </a>
                  <a
                    href={song.fileUrl}
                    download
                    className="btn btn-primary"
                    style={{ fontSize: "0.85rem", padding: "8px 14px" }}
                  >
                    <Download size={15} />
                    Unduh File
                  </a>
                </div>
              </div>

              {/* PDF Preview Frame */}
              {isPdf && (
                <div
                  style={{
                    marginTop: "var(--space-md)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--color-border)",
                    height: "500px",
                    background: "#222",
                  }}
                >
                  <iframe
                    src={`${song.fileUrl}#toolbar=0`}
                    title={`Partitur ${song.title}`}
                    width="100%"
                    height="100%"
                    style={{ border: "none" }}
                  />
                </div>
              )}

              {/* Image Preview */}
              {isImage && (
                <div
                  style={{
                    marginTop: "var(--space-md)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    border: "1px solid var(--color-border)",
                    textAlign: "center",
                    background: "#111",
                    padding: "var(--space-sm)",
                  }}
                >
                  <a href={song.fileUrl} target="_blank" rel="noopener noreferrer">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={song.fileUrl}
                      alt={`Partitur ${song.title}`}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "650px",
                        objectFit: "contain",
                        display: "inline-block",
                        borderRadius: "var(--radius-sm)",
                      }}
                    />
                  </a>
                  <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "6px" }}>
                    Klik gambar untuk memperbesar resolusi penuh
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Lyrics Card */}
          <div
            style={{
              background: "var(--gradient-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-2xl)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <h3
              style={{
                fontSize: "1.1rem",
                color: "var(--color-primary)",
                marginBottom: "var(--space-lg)",
                textAlign: "center",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Lirik Lagu
            </h3>
            <div className="lyrics-content">{song.lyrics}</div>
          </div>
        </div>
      </section>
    </>
  );
}
