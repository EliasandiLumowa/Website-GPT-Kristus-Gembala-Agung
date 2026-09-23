"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Clock,
  Mail,
  Heart,
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Jangan tampilkan footer di halaman admin
  if (pathname?.startsWith("/admin")) return null;

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
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>
              <MapPin size={16} style={{ color: "var(--color-primary)" }} />
              <span>Alamat Gereja</span>
            </div>
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
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} Gereja Kristen. All rights reserved.
          </p>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "4px" }}>
            Made with <Heart size={12} style={{ color: "var(--color-primary)" }} /> for His Glory
          </p>
        </div>
      </div>
    </footer>
  );
}
