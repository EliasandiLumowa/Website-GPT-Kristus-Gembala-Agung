"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { href: "/", label: "Beranda" },
  { href: "/khotbah", label: "Khotbah" },
  { href: "/lagu", label: "Lagu & Lyrics" },
  { href: "/berita", label: "Berita" },
  { href: "/event", label: "Event" },
  { href: "/ulang-tahun", label: "Ulang Tahun" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Don't show navbar on admin pages
  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="container">
          <Link href="/" className="navbar-brand">
            <span className="navbar-brand-icon" style={{ background: "transparent", width: "auto", height: "auto" }}>
              <Image
                src="/icon_gereja.png"
                alt="Logo GPT Kristus Gembala Agung"
                width={48}
                height={36}
                style={{ objectFit: "contain", height: "36px", width: "auto", display: "block" }}
                priority
              />
            </span>
            GPT Kristus Gembala Agung
          </Link>

          <ul className={`nav-links ${isOpen ? "open" : ""}`}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={pathname === item.href ? "active" : ""}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            className="nav-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      <div
        className={`nav-overlay ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(false)}
      />
    </>
  );
}
