"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true); // <-- 1. Aktifkan loading saat tombol diklik

    try {
      // Panggil signIn bawaan NextAuth
      const res = await signIn("credentials", {
        redirect: false, // Penting: cegah NextAuth melakukan hard-redirect otomatis
        email: email,
        password: password,
      });

      if (res?.error) {
        // Jika salah password / email / akun belum aktif
        setError(res.error);
      } else if (res?.ok) {
        // JIKA BERHASIL LOGIN:
        
        // Ganti router.push dan router.refresh dengan ini:
        window.location.href = "/admin"; 
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan coba lagi.");
    } finally {
      setLoading(false); // <-- 2. Matikan loading apa pun hasilnya (sukses/gagal)
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto var(--space-xl)",
          }}
        >
          <Image
            src="/icon_gereja.png"
            alt="Logo GPT Kristus Gembala Agung"
            width={120}
            height={60}
            style={{ objectFit: "contain", height: "60px", width: "auto" }}
            priority
          />
        </div>
        <h1>Admin Panel</h1>
        <p>Masuk untuk mengelola konten website gereja</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: "left" }}>
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              placeholder="admin@gereja.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group" style={{ textAlign: "left" }}>
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center" }}
            disabled={loading}
          >
            <LogIn size={18} />
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
