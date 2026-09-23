"use client";

import { useSession, signOut, SessionProvider } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import {
  Church,
  LayoutDashboard,
  Play,
  Music,
  Newspaper,
  Calendar,
  Cake,
  Quote,
  LogOut,
  ChevronRight,
} from "lucide-react";

const adminNavItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/khotbah", label: "Khotbah", icon: Play },
  { href: "/admin/lagu", label: "Lagu & Lyrics", icon: Music },
  { href: "/admin/berita", label: "Berita", icon: Newspaper },
  { href: "/admin/event", label: "Event", icon: Calendar },
  { href: "/admin/ulang-tahun", label: "Ulang Tahun", icon: Cake },
  { href: "/admin/kutipan", label: "Kutipan Rohani", icon: Quote },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage && status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router, isLoginPage]);

  // Halaman login tidak memerlukan sidebar maupun session check
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === "loading") {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-bg)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Church
            size={48}
            style={{
              color: "var(--color-primary)",
              marginBottom: "var(--space-md)",
            }}
          />
          <p style={{ color: "var(--color-text-secondary)" }}>Memuat...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image
            src="/icon_gereja.png"
            alt="Logo GPT Kristus Gembala Agung"
            width={36}
            height={24}
            style={{ objectFit: "contain", height: "24px", width: "auto" }}
          />
          Admin Panel
        </div>

        <nav className="admin-nav">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-item ${
                pathname === item.href ? "active" : ""
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {pathname === item.href && (
                <ChevronRight
                  size={14}
                  style={{ marginLeft: "auto", opacity: 0.5 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "var(--space-xl)" }}>
          <div
            style={{
              padding: "var(--space-md)",
              borderTop: "1px solid var(--color-border)",
              marginTop: "var(--space-lg)",
            }}
          >
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--color-text-secondary)",
                marginBottom: "var(--space-sm)",
              }}
            >
              {session.user?.name || session.user?.email}
            </p>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="admin-nav-item"
              style={{ color: "var(--color-error)", padding: "0.5rem 0.85rem" }}
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-content">{children}</div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </SessionProvider>
  );
}
