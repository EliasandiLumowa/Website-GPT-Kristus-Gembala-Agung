import Link from "next/link";
import { Search, Newspaper } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Berita & Informasi",
  description: "Berita dan informasi terbaru dari Gereja Kristen",
};

async function getNews(search: string, page: number) {
  const limit = 12;
  const where = search
    ? {
        isPublished: true,
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { content: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : { isPublished: true };

  try {
    const [news, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.news.count({ where }),
    ]);
    return { news, total, totalPages: Math.ceil(total / limit) };
  } catch {
    return { news: [], total: 0, totalPages: 0 };
  }
}

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1");
  const { news, totalPages } = await getNews(search, page);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>
            <span className="gold-text">Berita & Informasi</span>
          </h1>
          <p>Berita dan informasi terbaru dari gereja</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <form action="/berita" method="GET">
            <div className="search-bar">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                name="search"
                placeholder="Cari berita..."
                defaultValue={search}
              />
            </div>
          </form>

          {news.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📰</div>
              <h3>Belum ada berita</h3>
              <p>Berita akan ditampilkan setelah admin menambahkan data</p>
            </div>
          ) : (
            <>
              <div className="grid-3">
                {news.map((item) => (
                  <Link
                    key={item.id}
                    href={`/berita/${item.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="news-card">
                      <div className="news-image">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt={item.title} />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "var(--black-700)",
                            }}
                          >
                            <Newspaper size={40} style={{ color: "var(--color-text-muted)" }} />
                          </div>
                        )}
                      </div>
                      <div className="news-body">
                        <p className="news-date">
                          {item.publishedAt
                            ? new Date(item.publishedAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })
                            : "Draft"}
                        </p>
                        <h3 className="news-title">{item.title}</h3>
                        {item.excerpt && <p className="news-excerpt">{item.excerpt}</p>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  {page > 1 && (
                    <Link
                      href={`/berita?page=${page - 1}${search ? `&search=${search}` : ""}`}
                      className="pagination-btn"
                    >
                      ← Sebelumnya
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/berita?page=${p}${search ? `&search=${search}` : ""}`}
                      className={`pagination-btn ${p === page ? "active" : ""}`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/berita?page=${page + 1}${search ? `&search=${search}` : ""}`}
                      className="pagination-btn"
                    >
                      Selanjutnya →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
