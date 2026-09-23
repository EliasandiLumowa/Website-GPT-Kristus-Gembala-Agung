import Link from "next/link";
import { Play, Search } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "History Khotbah",
  description: "Kumpulan khotbah dan firman Tuhan dari Gereja Kristen",
};

async function getSermons(search: string, page: number) {
  const limit = 12;
  const where = search
    ? {
        isPublished: true,
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { speaker: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : { isPublished: true };

  try {
    const [sermons, total] = await Promise.all([
      prisma.sermon.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.sermon.count({ where }),
    ]);
    return { sermons, total, totalPages: Math.ceil(total / limit) };
  } catch {
    return { sermons: [], total: 0, totalPages: 0 };
  }
}

export default async function KhotbahPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1");
  const { sermons, totalPages } = await getSermons(search, page);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>
            <span className="gold-text">History Khotbah</span>
          </h1>
          <p>Kumpulan khotbah dan firman Tuhan</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Search */}
          <form action="/khotbah" method="GET">
            <div className="search-bar">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                name="search"
                placeholder="Cari khotbah berdasarkan judul atau pengkhotbah..."
                defaultValue={search}
              />
            </div>
          </form>

          {sermons.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎤</div>
              <h3>Belum ada khotbah</h3>
              <p>Khotbah akan ditampilkan setelah admin menambahkan data</p>
            </div>
          ) : (
            <>
              <div className="grid-3">
                {sermons.map((sermon) => {
                  const videoId = sermon.youtubeUrl.match(
                    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                  );
                  return (
                    <Link
                      key={sermon.id}
                      href={`/khotbah/${sermon.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <div className="sermon-card">
                        <div className="sermon-thumbnail">
                          {videoId && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={`https://img.youtube.com/vi/${videoId[1]}/mqdefault.jpg`}
                              alt={sermon.title}
                            />
                          )}
                          <div className="sermon-play-btn">
                            <Play size={24} />
                          </div>
                        </div>
                        <div className="sermon-info">
                          <p className="sermon-date">
                            {new Date(sermon.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <h3 className="sermon-title">{sermon.title}</h3>
                          <p className="sermon-speaker">{sermon.speaker}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  {page > 1 && (
                    <Link
                      href={`/khotbah?page=${page - 1}${search ? `&search=${search}` : ""}`}
                      className="pagination-btn"
                    >
                      ← Sebelumnya
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <Link
                        key={p}
                        href={`/khotbah?page=${p}${search ? `&search=${search}` : ""}`}
                        className={`pagination-btn ${p === page ? "active" : ""}`}
                      >
                        {p}
                      </Link>
                    )
                  )}
                  {page < totalPages && (
                    <Link
                      href={`/khotbah?page=${page + 1}${search ? `&search=${search}` : ""}`}
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
