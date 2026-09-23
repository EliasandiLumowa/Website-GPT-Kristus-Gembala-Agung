import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Music, User } from "lucide-react";
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
    title: song ? `${song.title} - Lyrics` : "Lagu",
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

  return (
    <>
      <section className="page-header" style={{ paddingBottom: "var(--space-xl)" }}>
        <div className="container">
          <Link
            href="/lagu"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "var(--space-sm)",
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-lg)",
              fontSize: "0.9rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            <ArrowLeft size={16} />
            Kembali ke Daftar Lagu
          </Link>
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
          {song.category && (
            <div style={{ marginTop: "var(--space-md)", position: "relative", zIndex: 1 }}>
              <span className="badge badge-gold">{song.category}</span>
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: "var(--space-2xl)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          {song.youtubeUrl && (
            <div style={{ marginBottom: "var(--space-2xl)" }}>
              <YouTubeEmbed url={song.youtubeUrl} title={song.title} />
            </div>
          )}

          <div className="lyrics-content">{song.lyrics}</div>
        </div>
      </section>
    </>
  );
}
