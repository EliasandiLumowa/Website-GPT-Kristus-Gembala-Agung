import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar } from "lucide-react";
import prisma from "@/lib/prisma";
import YouTubeEmbed from "@/components/public/YouTubeEmbed";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const sermon = await prisma.sermon.findUnique({ where: { id } }).catch(() => null);
  return {
    title: sermon?.title || "Khotbah",
    description: sermon?.description || "Detail khotbah",
  };
}

export default async function KhotbahDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let sermon;
  try {
    sermon = await prisma.sermon.findUnique({ where: { id } });
  } catch {
    notFound();
  }

  if (!sermon) notFound();

  return (
    <>
      <section className="page-header" style={{ paddingBottom: "var(--space-xl)" }}>
        <div className="container">
          <Link
            href="/khotbah"
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
            Kembali ke Daftar Khotbah
          </Link>
          <h1 style={{ position: "relative", zIndex: 1 }}>{sermon.title}</h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "var(--space-xl)",
              marginTop: "var(--space-md)",
              color: "var(--color-text-secondary)",
              fontSize: "0.9rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <User size={16} style={{ color: "var(--color-primary)" }} />
              {sermon.speaker}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Calendar size={16} style={{ color: "var(--color-primary)" }} />
              {new Date(sermon.date).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "var(--space-2xl)" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <YouTubeEmbed url={sermon.youtubeUrl} title={sermon.title} />

          {sermon.description && (
            <div
              style={{
                marginTop: "var(--space-2xl)",
                padding: "var(--space-xl)",
                background: "var(--gradient-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <h3 style={{ marginBottom: "var(--space-md)", fontSize: "1.1rem" }}>
                Deskripsi
              </h3>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.8,
                  whiteSpace: "pre-line",
                }}
              >
                {sermon.description}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
