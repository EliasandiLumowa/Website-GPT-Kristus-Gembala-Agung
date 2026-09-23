"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Clock,
  Mail,
  Heart,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Jangan tampilkan footer di halaman admin
  if (pathname?.startsWith("/admin")) return null;

  const googleMapsUrl =
    "https://www.google.com/maps/place/GPT+KRISTUS+GEMBALA+AGUNG+BUMI+NYIUR/@1.457994,124.8494887,70m/data=!3m1!1e3!4m6!3m5!1s0x3287755dfa46bf49:0xc1c2a04c066fbca7!8m2!3d1.4581043!4d124.8495797!16s%2Fg%2F11j9dczt9q?entry=ttu&g_ep=EgoyMDI2MDkyMC4wIKXMDSoASAFQAw%3D%3D";

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Image
                src="/icon_gereja.png"
                alt="Logo GPT Kristus Gembala Agung"
                width={40}
                height={30}
                style={{ objectFit: "contain", height: "30px", width: "auto" }}
              />
              GPT Kristus Gembala Agung
            </div>
            <p className="footer-desc">
              Melayani dengan kasih, bertumbuh dalam iman, dan memuliakan Tuhan
              dalam setiap langkah kehidupan.
            </p>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-address-link"
              title="Buka lokasi di Google Maps"
            >
              <MapPin size={18} style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} />
              <span>
                Jl. WZ Yohanes, Bumi Nyiur, Kec. Wanea, Kota Manado, Sulawesi Utara 95115
              </span>
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h4>Navigasi</h4>
            <ul className="footer-links">
              <li><Link href="/">Beranda</Link></li>
              <li><Link href="/khotbah">Khotbah</Link></li>
              <li><Link href="/lagu">Lagu & Lyrics</Link></li>
              <li><Link href="/berita">Berita</Link></li>
              <li><Link href="/event">Event</Link></li>
            </ul>
          </div>

          {/* Jadwal Ibadah */}
          <div>
            <h4>Jadwal Ibadah</h4>
            <ul className="footer-links">
              <li>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
                  <Clock size={14} style={{ color: "var(--color-primary)" }} />
                  Selasa - Pendalaman Alkitab
                </span>
              </li>
              <li>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
                  <Clock size={14} style={{ color: "var(--color-primary)" }} />
                  Jumat - Doa Penyembahan
                </span>
              </li>
              <li>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
                  <Clock size={14} style={{ color: "var(--color-primary)" }} />
                  Sabtu - Ibadah Youth
                </span>
              </li>
              <li>
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
                  <Clock size={14} style={{ color: "var(--color-primary)" }} />
                  Minggu - Ibadah Anak Domba
                </span>
              </li>
            </ul>
          </div>

          {/* Kontak */}
          <div>
            <h4>Kontak</h4>
            <ul className="footer-links">
              <li>
                <a href="mailto:info@gereja.com">
                  <Mail size={14} />
                  info@gereja.com
                </a>
              </li>
            </ul>
          </div>

          {/* Titik Lokasi Google Maps */}
          <div>
            <h4>Lokasi Gereja</h4>
            <div className="footer-map-container">
              <div className="footer-map-frame">
                <iframe
                  title="Peta Titik Lokasi GPT Kristus Gembala Agung Bumi Nyiur"
                  src="https://maps.google.com/maps?q=GPT+KRISTUS+GEMBALA+AGUNG+BUMI+NYIUR&hl=id&z=17&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen={false}
                />
              </div>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-map-link"
              >
                <ExternalLink size={13} />
                <span>Buka di Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} GPT Kristus Gembala Agung. All rights reserved.
          </p>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px" }}>
            Made with <Heart size={12} style={{ color: "var(--color-primary)" }} /> for His Glory
          </p>
        </div>
      </div>
    </footer>
  );
}
