import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import prisma from "@/lib/prisma";
import ArticleContent from "@/components/public/ArticleContent";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await prisma.news.findUnique({ where: { slug } }).catch(() => null);
  return {
    title: news?.title || "Berita",
    description: news?.excerpt || "Detail berita gereja",
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let news;
  try {
    news = await prisma.news.findUnique({ where: { slug } });
  } catch {
    notFound();
  }

  if (!news || !news.isPublished) notFound();

  return (
    <>
      <section className="page-header" style={{ paddingBottom: "var(--space-xl)" }}>
        <div className="container">
          <Link
            href="/berita"
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
            Kembali ke Berita
          </Link>
          <h1 style={{ position: "relative", zIndex: 1 }}>{news.title}</h1>
          {news.publishedAt && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                marginTop: "var(--space-md)",
                color: "var(--color-text-secondary)",
                fontSize: "0.9rem",
                position: "relative",
                zIndex: 1,
              }}
            >
              <Calendar size={16} style={{ color: "var(--color-primary)" }} />
              {new Date(news.publishedAt).toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          )}
        </div>
      </section>

      <section className="section" style={{ paddingTop: "var(--space-2xl)" }}>
        <div className="container" style={{ maxWidth: "800px" }}>
          {news.image && (
            <div
              style={{
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                marginBottom: "var(--space-2xl)",
                border: "1px solid var(--color-border)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={news.image}
                alt={news.title}
                style={{ width: "100%", display: "block" }}
              />
            </div>
          )}

          <div
            style={{
              background: "var(--gradient-card)",
              border: "1px solid var(--color-border)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-2xl) var(--space-xl)",
              fontSize: "1.05rem",
              color: "var(--color-text)",
            }}
          >
            <ArticleContent content={news.content} />
          </div>
        </div>
      </section>
    </>
  );
}
