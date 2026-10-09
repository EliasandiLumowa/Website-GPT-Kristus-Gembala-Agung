import Image from "next/image";
import Link from "next/link";
import { Compass, Target, Heart, ShieldCheck, Flame, Users, Calendar, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Visi & Misi - GPT Kristus Gembala Agung",
  description: "Visi dan misi pelayanan Gereja Pantekosta di Indonesia (GPT) Kristus Gembala Agung.",
};

const missionPoints = [
  {
    icon: Flame,
    title: "Memberitakan Injil Keselamatan",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    icon: Users,
    title: "Membangun & Memuridkan Jemaat",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt.",
  },
  {
    icon: Heart,
    title: "Pelayanan Kasih & Kepedulian Sosial",
    description:
      "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
  },
  {
    icon: ShieldCheck,
    title: "Menjaga Kekudusan & Kebenaran Firman",
    description:
      "Integer in mauris eu nibh euismod gravida. Duis ac tellus et risus vulputate vehicula. Donec lobortis risus a elit. Etiam tempor. Ut ullamcorper, ligula eu tempor congue.",
  },
];

const coreValues = [
  {
    tag: "KASIH",
    label: "Kasih yang Tulus",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Amore et caritas in Christo Jesu.",
  },
  {
    tag: "KEKUDUSAN",
    label: "Hidup Kudus",
    desc: "Vivamus fermentum semper porta. Nunc diam velit, adipiscing ut tristique vitae, sagittis vel odio.",
  },
  {
    tag: "KESETIAAN",
    label: "Setia Melayani",
    desc: "Maecenas porttitor congue massa. Fusce posuere, magna sed pulvinar ultricies, purus lectus malesuada.",
  },
  {
    tag: "KEBERSAMAAN",
    label: "Keluarga Allah",
    desc: "Vestibulum erat wisi, condimentum sed, commodo vitae, ornare sit amet, wisi. Aenean fermentum.",
  },
];

export default function VisiMisiPage() {
  return (
    <>
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <span
            style={{
              display: "inline-block",
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
            GPT Kristus Gembala Agung
          </span>
          <h1>
            <span className="gold-text">Visi & Misi</span> Gereja
          </h1>
          <p>Arah panggilan dan komitmen pelayanan kami dalam memuliakan nama Tuhan</p>
        </div>
      </section>

      {/* Hero Photo Section */}
      <section className="section" style={{ paddingTop: "var(--space-xl)", paddingBottom: "var(--space-xl)" }}>
        <div className="container">
          <div
            style={{
              position: "relative",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              border: "1px solid var(--color-border)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              aspectRatio: "21/9",
              minHeight: "260px",
              background: "linear-gradient(135deg, #1c1508 0%, #0d0d0d 100%)",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=1600&q=80"
              alt="Gereja GPT Kristus Gembala Agung"
              fill
              style={{ objectFit: "cover", opacity: 0.7 }}
              priority
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.2) 100%)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                padding: "var(--space-xl)",
                maxWidth: "750px",
              }}
            >
              <span
                style={{
                  color: "var(--color-primary)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Panggilan Pelayanan
              </span>
              <h2
                style={{
                  fontSize: "clamp(1.2rem, 3vw, 1.8rem)",
                  color: "var(--color-white)",
                  marginTop: "6px",
                  lineHeight: 1.3,
                }}
              >
                Menjadi Garam dan Terang Dunia yang Berakar Teguh di Dalam Kristus
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Visi Section */}
      <section className="section" style={{ background: "var(--black-800)" }}>
        <div className="container" style={{ maxWidth: "900px" }}>
          <div
            style={{
              textAlign: "center",
              marginBottom: "var(--space-2xl)",
            }}
          >
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(212, 160, 23, 0.15)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto var(--space-md)",
                border: "1px solid rgba(212, 160, 23, 0.3)",
              }}
            >
              <Compass size={28} />
            </div>
            <h2 style={{ fontSize: "2rem", marginBottom: "var(--space-sm)" }}>
              <span className="gold-text">Visi</span> Kami
            </h2>
            <p style={{ color: "var(--color-text-secondary)" }}>
              Cita-cita luhur yang memandu setiap langkah pelayanan gereja
            </p>
          </div>

          <div
            style={{
              background: "var(--gradient-card)",
              border: "1px solid rgba(212, 160, 23, 0.25)",
              borderRadius: "var(--radius-xl)",
              padding: "var(--space-2xl)",
              position: "relative",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "-15px",
                left: "30px",
                background: "var(--color-primary)",
                color: "var(--black-900)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "1px",
                padding: "3px 12px",
                borderRadius: "20px",
                textTransform: "uppercase",
              }}
            >
              Pernyataan Visi
            </div>

            <p
              style={{
                fontSize: "1.25rem",
                lineHeight: 1.8,
                color: "var(--color-white)",
                fontWeight: 500,
                fontStyle: "italic",
                textAlign: "center",
                marginBottom: "var(--space-lg)",
              }}
            >
              &ldquo;Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.&rdquo;
            </p>

            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
                textAlign: "center",
                maxWidth: "700px",
                margin: "0 auto",
              }}
            >
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
      </section>

      {/* Misi Section */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                background: "rgba(212, 160, 23, 0.15)",
                color: "var(--color-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto var(--space-md)",
                border: "1px solid rgba(212, 160, 23, 0.3)",
              }}
            >
              <Target size={28} />
            </div>
            <h2>
              <span className="gold-text">Misi</span> Kami
            </h2>
            <p>Langkah nyata untuk mewujudkan visi Tuhan bagi jemaat dan masyarakat</p>
          </div>

          <div className="grid-2">
            {missionPoints.map((item, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--gradient-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-xl)",
                  display: "flex",
                  gap: "var(--space-lg)",
                  transition: "transform 0.2s, border-color 0.2s",
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "var(--radius-md)",
                    background: "rgba(212, 160, 23, 0.12)",
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <item.icon size={24} />
                </div>
                <div>
                  <h3
                    style={{
                      fontSize: "1.15rem",
                      marginBottom: "var(--space-xs)",
                      color: "var(--color-white)",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--color-text-secondary)",
                      fontSize: "0.92rem",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nilai Inti (Core Values) */}
      <section className="section" style={{ background: "var(--black-800)" }}>
        <div className="container">
          <div className="section-header">
            <h2>
              <span className="gold-text">Nilai-Nilai Dasar</span> Pelayanan
            </h2>
            <p>Prinsip rohani yang mendasari setiap karya dan interaksi di dalam gereja</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: "var(--space-lg)",
            }}
          >
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                style={{
                  background: "var(--color-bg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "var(--space-xl)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    color: "var(--color-primary)",
                    background: "rgba(212, 160, 23, 0.1)",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {val.tag}
                </div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    marginTop: "var(--space-sm)",
                    marginBottom: "var(--space-xs)",
                    color: "var(--color-white)",
                  }}
                >
                  {val.label}
                </h3>
                <p
                  style={{
                    color: "var(--color-text-secondary)",
                    fontSize: "0.88rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Galeri Foto Pelayanan */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>
              <span className="gold-text">Kehidupan & Komunitas</span> Jemaat
            </h2>
            <p>Bersatu hati dalam ibadah, doa, dan persekutuan yang memuliakan Kristus</p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "var(--space-lg)",
            }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "4/3",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&w=800&q=80"
                alt="Ibadah Bersama"
                fill
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "var(--space-lg)",
                }}
              >
                <div>
                  <h4 style={{ color: "#fff", marginBottom: "4px" }}>Persekutuan Ibadah</h4>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", margin: 0 }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                aspectRatio: "4/3",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?auto=format&fit=crop&w=800&q=80"
                alt="Pujian dan Penyembahan"
                fill
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "var(--space-lg)",
                }}
              >
                <div>
                  <h4 style={{ color: "#fff", marginBottom: "4px" }}>Pujian & Penyembahan</h4>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", margin: 0 }}>
                    Duis aute irure dolor in reprehenderit in voluptate.
                  </p>
                </div>
              </div>
            </div>

            <div
              style={{
                position: "relative",
                aspectRatio: "4/3",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid var(--color-border)",
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80"
                alt="Pelayanan Komunitas"
                fill
                style={{ objectFit: "cover" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                  display: "flex",
                  alignItems: "flex-end",
                  padding: "var(--space-lg)",
                }}
              >
                <div>
                  <h4 style={{ color: "#fff", marginBottom: "4px" }}>Generasi Muda & Anak</h4>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", margin: 0 }}>
                    Excepteur sint occaecat cupidatat non proident.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section" style={{ background: "var(--black-800)", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: "700px" }}>
          <h2>
            Mari Bertumbuh Bersama di <span className="gold-text">GPT Kristus Gembala Agung</span>
          </h2>
          <p style={{ color: "var(--color-text-secondary)", marginTop: "var(--space-sm)", marginBottom: "var(--space-xl)" }}>
            Kami mengundang Bapak, Ibu, dan Saudara sekalian untuk hadir dalam setiap ibadah dan persekutuan kami.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-md)", flexWrap: "wrap" }}>
            <Link href="/" className="btn btn-primary btn-lg">
              <Calendar size={18} />
              Lihat Jadwal Ibadah
            </Link>
            <Link href="/khotbah" className="btn btn-outline btn-lg">
              Dengarkan Khotbah
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
