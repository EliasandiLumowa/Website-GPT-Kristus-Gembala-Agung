import Link from "next/link";
import {
  Church,
  BookOpen,
  HandHeart,
  Users,
  Baby,
  Calendar,
  ArrowRight,
  Sparkles,
  Play,
  Music,
  Newspaper,
  Cake,
  Quote,
} from "lucide-react";
import prisma from "@/lib/prisma";

async function getHomeData() {
  try {
    const [latestQuote, upcomingEvents, recentNews, birthdays, latestSermons] =
      await Promise.all([
        prisma.quote
          .findFirst({
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
          })
          .catch(() => null),
        prisma.event
          .findMany({
            where: { isActive: true, date: { gte: new Date() } },
            orderBy: { date: "asc" },
            take: 3,
          })
          .catch(() => []),
        prisma.news
          .findMany({
            where: { isPublished: true },
            orderBy: { publishedAt: "desc" },
            take: 3,
          })
          .catch(() => []),
        prisma.birthday
          .findMany({
            where: { isActive: true },
            orderBy: { birthDate: "asc" },
          })
          .catch(() => []),
        prisma.sermon
          .findMany({
            where: { isPublished: true },
            orderBy: { date: "desc" },
            take: 3,
          })
          .catch(() => []),
      ]);

    // Filter birthdays to current week
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const thisWeekBirthdays = birthdays.filter((b) => {
      const bDate = new Date(b.birthDate);
      const thisYearBirthday = new Date(
        now.getFullYear(),
        bDate.getMonth(),
        bDate.getDate()
      );
      return thisYearBirthday >= weekStart && thisYearBirthday <= weekEnd;
    });

    return {
      latestQuote,
      upcomingEvents,
      recentNews,
      birthdays: thisWeekBirthdays,
      latestSermons,
    };
  } catch {
    return {
      latestQuote: null,
      upcomingEvents: [],
      recentNews: [],
      birthdays: [],
      latestSermons: [],
    };
  }
}

const scheduleItems = [
  {
    day: "Selasa",
    name: "Pendalaman Alkitab",
    icon: BookOpen,
    note: "Setiap minggu",
  },
  {
    day: "Jumat",
    name: "Doa Penyembahan",
    icon: HandHeart,
    note: "Setiap minggu",
  },
  {
    day: "Sabtu",
    name: "Ibadah Youth",
    icon: Users,
    note: "2 Minggu sekali",
  },
  {
    day: "Minggu",
    name: "Ibadah Anak Domba",
    icon: Baby,
    note: "Setelah Ibadah Umum",
  },
];

export default async function HomePage() {
  const { latestQuote, upcomingEvents, recentNews, birthdays, latestSermons } =
    await getHomeData();

  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero">
        <div className="hero-decoration hero-decoration-1" />
        <div className="hero-decoration hero-decoration-2" />
        <div className="hero-content">
          <span className="hero-subtitle">
            <Sparkles size={14} style={{ marginRight: "6px" }} />
            Selamat Datang
          </span>
          <h1>
            <span className="gold-text">GPT Kristus Gembala Agung</span>
          </h1>
          <p className="hero-description">
            Melayani dengan kasih, bertumbuh dalam iman, dan memuliakan Tuhan
            dalam setiap langkah kehidupan. Mari bersama-sama membangun jemaat
            yang kuat dalam Kristus.
          </p>
          <div className="hero-actions">
            <Link href="/khotbah" className="btn btn-primary btn-lg">
              <Play size={18} />
              Tonton Khotbah
            </Link>
            <Link href="/berita" className="btn btn-outline btn-lg">
              Berita Terbaru
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== JADWAL IBADAH ===== */}
      <section className="section" style={{ background: "var(--black-800)" }}>
        <div className="container">
          <div className="section-header">
            <h2>
              <Calendar
                size={28}
                style={{
                  color: "var(--color-primary)",
                  marginRight: "12px",
                  verticalAlign: "middle",
                }}
              />
              Jadwal Ibadah
            </h2>
            <p>Jadwal ibadah rutin di gereja kami</p>
          </div>

          <div className="schedule-grid">
            {scheduleItems.map((item, index) => (
              <div
                key={item.day}
                className={`schedule-card animate-fade-in-up stagger-${index + 1}`}
              >
                <div className="schedule-icon">
                  <item.icon size={26} />
                </div>
                <div className="schedule-day">{item.day}</div>
                <div className="schedule-name">{item.name}</div>
                <div className="schedule-note">{item.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KUTIPAN ROHANI ===== */}
      {latestQuote && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>
                <Quote
                  size={28}
                  style={{
                    color: "var(--color-primary)",
                    marginRight: "12px",
                    verticalAlign: "middle",
                  }}
                />
                Kutipan Rohani Hari ini
              </h2>
            </div>
            <div className="quote-card">
              <p className="quote-text">{latestQuote.content}</p>
              {latestQuote.author && (
                <p className="quote-author">— {latestQuote.author}</p>
              )}
              {latestQuote.reference && (
                <p className="quote-reference">{latestQuote.reference}</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ===== KHOTBAH TERBARU ===== */}
      {latestSermons.length > 0 && (
        <section
          className="section"
          style={{ background: "var(--black-800)" }}
        >
          <div className="container">
            <div className="section-header">
              <h2>
                <Play
                  size={28}
                  style={{
                    color: "var(--color-primary)",
                    marginRight: "12px",
                    verticalAlign: "middle",
                  }}
                />
                Khotbah Terbaru
              </h2>
              <p>Dengarkan firman Tuhan dari khotbah terbaru</p>
            </div>

            <div className="grid-3">
              {latestSermons.map((sermon : any) => {
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

            <div style={{ textAlign: "center", marginTop: "var(--space-2xl)" }}>
              <Link href="/khotbah" className="btn btn-outline">
                Lihat Semua Khotbah
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== EVENT MENDATANG ===== */}
      {upcomingEvents.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>
                <Calendar
                  size={28}
                  style={{
                    color: "var(--color-primary)",
                    marginRight: "12px",
                    verticalAlign: "middle",
                  }}
                />
                Event Mendatang
              </h2>
              <p>Jangan lewatkan event-event menarik di gereja</p>
            </div>

            <div className="grid-3">
              {upcomingEvents.map((event : any) => (
                <Link
                  key={event.id}
                  href={`/event/${event.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="event-card">
                    <div className="card-body" style={{ display: "flex", gap: "var(--space-lg)", alignItems: "flex-start" }}>
                      <div className="event-date-badge">
                        <span className="event-date-day">
                          {new Date(event.date).getDate()}
                        </span>
                        <span className="event-date-month">
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: "1.05rem",
                            marginBottom: "var(--space-xs)",
                          }}
                        >
                          {event.title}
                        </h3>
                        <p
                          style={{
                            fontSize: "0.85rem",
                            color: "var(--color-text-secondary)",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {event.description}
                        </p>
                        {event.location && (
                          <p
                            style={{
                              fontSize: "0.8rem",
                              color: "var(--color-text-muted)",
                              marginTop: "var(--space-sm)",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            📍 {event.location}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "var(--space-2xl)" }}>
              <Link href="/event" className="btn btn-outline">
                Lihat Semua Event
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== ULANG TAHUN MINGGU INI ===== */}
      {birthdays.length > 0 && (
        <section
          className="section"
          style={{ background: "var(--black-800)" }}
        >
          <div className="container">
            <div className="section-header">
              <h2>
                <Cake
                  size={28}
                  style={{
                    color: "var(--color-primary)",
                    marginRight: "12px",
                    verticalAlign: "middle",
                  }}
                />
                Ulang Tahun Minggu Ini
              </h2>
              <p>Selamat ulang tahun untuk jemaat yang berulang tahun!</p>
            </div>

            <div className="grid-4">
              {birthdays.map((b : any) => (
                <div key={b.id} className="birthday-card">
                  <div className="birthday-avatar">
                    {b.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={b.photo} alt={b.name} />
                    ) : (
                      b.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <p className="birthday-name">{b.name}</p>
                  <p className="birthday-date">
                    {new Date(b.birthDate).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "var(--space-2xl)" }}>
              <Link href="/ulang-tahun" className="btn btn-outline">
                Lihat Semua
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== BERITA TERBARU ===== */}
      {recentNews.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>
                <Newspaper
                  size={28}
                  style={{
                    color: "var(--color-primary)",
                    marginRight: "12px",
                    verticalAlign: "middle",
                  }}
                />
                Berita Terbaru
              </h2>
              <p>Informasi dan berita terkini dari gereja</p>
            </div>

            <div className="grid-3">
              {recentNews.map((news : any) => (
                <Link
                  key={news.id}
                  href={`/berita/${news.slug}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="news-card">
                    <div className="news-image">
                      {news.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={news.image} alt={news.title} />
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
                          <Newspaper
                            size={40}
                            style={{ color: "var(--color-text-muted)" }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="news-body">
                      <p className="news-date">
                        {news.publishedAt
                          ? new Date(news.publishedAt).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "Draft"}
                      </p>
                      <h3 className="news-title">{news.title}</h3>
                      {news.excerpt && (
                        <p className="news-excerpt">{news.excerpt}</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div style={{ textAlign: "center", marginTop: "var(--space-2xl)" }}>
              <Link href="/berita" className="btn btn-outline">
                Lihat Semua Berita
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA SECTION (when no dynamic data) ===== */}
      {latestSermons.length === 0 &&
        recentNews.length === 0 &&
        upcomingEvents.length === 0 && (
          <section className="section">
            <div className="container">
              <div
                style={{
                  textAlign: "center",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                <div
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    background: "rgba(212, 160, 23, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto var(--space-xl)",
                  }}
                >
                  <Church
                    size={36}
                    style={{ color: "var(--color-primary)" }}
                  />
                </div>
                <h2 style={{ marginBottom: "var(--space-md)" }}>
                  Selamat Datang di Website Gereja
                </h2>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    marginBottom: "var(--space-xl)",
                    lineHeight: 1.8,
                  }}
                >
                  Website ini sedang dalam tahap pengisian konten. Admin dapat
                  menambahkan khotbah, berita, event, dan konten lainnya melalui
                  panel admin.
                </p>
                <Link href="/admin/login" className="btn btn-primary">
                  Panel Admin
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>
        )}
    </>
  );
}
