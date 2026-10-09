"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, User } from "lucide-react";
import { useSession } from "next-auth/react";

interface NavItem {
  href: string;
  label: string;
  children?: { href: string; label: string }[];
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", label: "Beranda" },
  { href: "/visi-misi", label: "Visi & Misi" },
  {
    href: "/khotbah",
    label: "Khotbah",
    children: [
      { href: "/khotbah", label: "History Khotbah" },
      { href: "/highlight-khotbah", label: "Highlight Khotbah" },
    ],
  },
  {
    href: "/lagu",
    label: "Lagu & Lyrics",
    children: [
      { href: "/lagu", label: "Semua Lagu" },
      { href: "/lagu/ciptaan-sendiri", label: "Lagu Ciptaan Sendiri" },
    ],
  },
  { href: "/berita", label: "Berita", requiresAuth: true },
  { href: "/event", label: "Event", requiresAuth: true },
  { href: "/ulang-tahun", label: "Ulang Tahun", requiresAuth: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  
  // Kita hanya membutuhkan status untuk mengecek login
  const { status } = useSession();

  // Jangan tampilkan navbar di halaman admin
  if (pathname?.startsWith("/admin")) return null;

  const isLoggedIn = status === "authenticated";

  // Filter menu navigasi berdasarkan status login
  const filteredNavItems = navItems
    .map((item) => {
      // Sembunyikan sepenuhnya jika butuh login tapi belum login
      if (item.requiresAuth && !isLoggedIn) {
        return null;
      }

      // Ubah menu Khotbah jika belum login
      if (item.href === "/khotbah" && !isLoggedIn) {
        return {
          href: "/highlight-khotbah",
          label: "Highlight Khotbah",
        };
      }

      // Ubah menu Lagu jika belum login
      if (item.href === "/lagu" && !isLoggedIn) {
        return {
          href: "/lagu/ciptaan-sendiri",
          label: "Lagu Ciptaan Sendiri",
        };
      }

      return item;
    })
    .filter(Boolean) as NavItem[];

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
            <span
              className="navbar-brand-icon"
              style={{ background: "transparent", width: "auto", height: "auto" }}
            >
              <Image
                src="/icon_gereja.png"
                alt="Logo GPT Kristus Gembala Agung"
                width={48}
                height={36}
                style={{
                  objectFit: "contain",
                  height: "36px",
                  width: "auto",
                  display: "block",
                }}
                priority
              />
            </span>
            GPT Kristus Gembala Agung
          </Link>

          <ul className={`nav-links ${isOpen ? "open" : ""}`}>
            {filteredNavItems.map((item) => {
              const isItemActive =
                pathname === item.href ||
                item.children?.some((child) => pathname === child.href);

              if (item.children) {
                return (
                  <li key={item.href} className="nav-item-dropdown">
                    <Link
                      href={item.href}
                      className={`nav-dropdown-toggle ${isItemActive ? "active" : ""}`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                      <ChevronDown size={14} style={{ opacity: 0.7 }} />
                    </Link>
                    <div className="nav-dropdown-menu">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={pathname === child.href ? "active" : ""}
                          onClick={() => setIsOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={pathname === item.href ? "active" : ""}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}

            {/* Tombol Masuk HANYA tampil jika user belum login */}
            {status !== "loading" && !isLoggedIn && (
              <li className="nav-auth-item" style={{ marginLeft: "auto" }}>
                <Link
                  href="/login"
                  className="btn btn-primary"
                  style={{
                    fontSize: "0.88rem",
                    padding: "0.4rem 0.8rem",
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "center",
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  <User size={16} />
                  Masuk
                </Link>
              </li>
            )}
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