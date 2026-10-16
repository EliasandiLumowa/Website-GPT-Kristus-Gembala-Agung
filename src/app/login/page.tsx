"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  LogIn,
  User,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Send,
  UserPlus,
  Shield,
  ArrowRight,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const isRegistered = searchParams.get("registered") === "1";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPendingApproval, setIsPendingApproval] = useState(false);
  const [loading, setLoading] = useState(false);

  const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "682190075556";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPendingApproval(false);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        username: username.trim(),
        password: password,
      });

      if (res?.error) {
        if (res.error.toLowerCase().includes("belum disetujui")) {
          setIsPendingApproval(true);
          setError("Akun Anda belum disetujui oleh Admin.");
        } else {
          setError(res.error);
        }
      } else if (res?.ok) {
        // Berhasil login, refresh session & redirect
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const getWaReminderUrl = () => {
    const text = `Shalom admin, akun jemaat saya dengan username ${username.trim()} belum disetujui, mohon bantuannya untuk dicek dan disetujui. Terima kasih.`;
    return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div style={{ maxWidth: "460px", margin: "60px auto 100px", padding: "0 20px" }}>
      <div
        style={{
          background: "black",
          padding: "36px 30px",
          borderRadius: "16px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Logo and Header */}
        <div style={{ textAlign: "center", marginBottom: "26px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
            }}
          >
            <Image
              src="/icon_gereja.png"
              alt="Logo GPT Kristus Gembala Agung"
              width={75}
              height={50}
              style={{ objectFit: "contain", height: "50px", width: "auto" }}
              priority
            />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: "bold", margin: "0 0 6px" }}>
            Masuk Jemaat
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
            Selamat datang di Portal Jemaat GPT Kristus Gembala Agung
          </p>
        </div>

        {isRegistered && !error && (
          <div
            style={{
              background: "#dcfce7",
              border: "1px solid #86efac",
              color: "#166534",
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: "20px",
              fontSize: "0.88rem",
              lineHeight: "1.5",
            }}
          >
            Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan admin sebelum dapat digunakan untuk login.
          </div>
        )}

        {/* Warning if account pending admin approval */}
        {isPendingApproval ? (
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              color: "#92400e",
              borderRadius: "10px",
              padding: "14px",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <Clock size={20} style={{ color: "#d97706", flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "0.88rem", lineHeight: "1.5" }}>
                <strong>Akun Menunggu Persetujuan Admin</strong>
                <p style={{ margin: "4px 0 10px" }}>
                  Akun Anda telah terdaftar namun belum disetujui oleh Admin. Anda dapat menghubungi admin melalui WhatsApp untuk konfirmasi aktivasi.
                </p>
                <a
                  href={getWaReminderUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  style={{
                    backgroundColor: "#25D366",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    fontSize: "0.82rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    textDecoration: "none",
                    fontWeight: 600,
                  }}
                >
                  <Send size={14} /> Hubungi Admin via WhatsApp
                </a>
              </div>
            </div>
          </div>
        ) : error ? (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.88rem",
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Username
            </label>
            <div style={{ position: "relative" }}>
              <User
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type="text"
                placeholder="Masukkan username Anda"
                className="form-input"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: "36px", width: "100%" }}
              />
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af",
                }}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className="form-input"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: "36px", paddingRight: "40px", width: "100%" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{
              width: "100%",
              justifyContent: "center",
              marginTop: "8px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <LogIn size={18} />
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>

        {/* Links */}
        <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--color-border)" }}>
          <div style={{ textAlign: "center", marginBottom: "14px" }}>
            <span style={{ fontSize: "0.88rem", color: "var(--color-text-secondary)" }}>
              Belum terdaftar sebagai jemaat?
            </span>
            <br />
            <Link
              href="/register"
              className="btn btn-outline"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "8px",
                fontSize: "0.85rem",
                padding: "0.45rem 1rem",
              }}
            >
              <UserPlus size={15} />
              Daftar Jemaat Baru
            </Link>
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", padding: "80px 20px" }}>Memuat...</div>}>
      <LoginForm />
    </Suspense>
  );
}
