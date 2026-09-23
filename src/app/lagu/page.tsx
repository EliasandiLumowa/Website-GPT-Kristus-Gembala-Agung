import Link from "next/link";
import { Music, Search } from "lucide-react";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Lagu & Lyrics",
  description: "Kumpulan lagu pujian dan penyembahan beserta liriknya",
};

async function getSongs(search: string, page: number) {
  const limit = 20;
  const where = search
    ? {
        isPublished: true,
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { artist: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : { isPublished: true };

  try {
    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        where,
        orderBy: { title: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.song.count({ where }),
    ]);
    return { songs, total, totalPages: Math.ceil(total / limit) };
  } catch {
    return { songs: [], total: 0, totalPages: 0 };
  }
}

export default async function LaguPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search || "";
  const page = parseInt(params.page || "1");
  const { songs, totalPages } = await getSongs(search, page);

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>
            <span className="gold-text">Lagu & Lyrics</span>
          </h1>
          <p>Kumpulan lagu pujian dan penyembahan beserta liriknya</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <form action="/lagu" method="GET">
            <div className="search-bar">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                name="search"
                placeholder="Cari lagu berdasarkan judul atau artis..."
                defaultValue={search}
              />
            </div>
          </form>

          {songs.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎵</div>
              <h3>Belum ada lagu</h3>
              <p>Lagu akan ditampilkan setelah admin menambahkan data</p>
            </div>
          ) : (
            <>
              <div className="grid-2">
                {songs.map((song) => (
                  <Link
                    key={song.id}
                    href={`/lagu/${song.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <div className="song-card">
                      <div className="song-icon">
                        <Music size={22} />
                      </div>
                      <div className="song-details">
                        <p className="song-title">{song.title}</p>
                        <p className="song-artist">
                          {song.artist || "Unknown Artist"}
                          {song.category && (
                            <span
                              className="badge badge-gold"
                              style={{ marginLeft: "var(--space-sm)" }}
                            >
                              {song.category}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  {page > 1 && (
                    <Link
                      href={`/lagu?page=${page - 1}${search ? `&search=${search}` : ""}`}
                      className="pagination-btn"
                    >
                      ← Sebelumnya
                    </Link>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <Link
                      key={p}
                      href={`/lagu?page=${p}${search ? `&search=${search}` : ""}`}
                      className={`pagination-btn ${p === page ? "active" : ""}`}
                    >
                      {p}
                    </Link>
                  ))}
                  {page < totalPages && (
                    <Link
                      href={`/lagu?page=${page + 1}${search ? `&search=${search}` : ""}`}
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
