"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Heart,
  Baby,
  Plus,
  Trash2,
  Send,
  MessageCircle,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [waLink, setWaLink] = useState("");

  const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "6282190075556";

  // Data Kepala Keluarga
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nik: "",
    name: "",
    umur: "",
    jenisKelamin: "Laki-laki",
    statusMenikah: "Belum Menikah", // "Belum Menikah" | "Sudah Menikah"
  });

  // Data Pasangan (Istri / Suami) - tanpa status pernikahan
  const [pasangan, setPasangan] = useState({
    name: "",
    umur: "",
    jenisKelamin: "Perempuan",
    nik: "",
  });

  // Data Anak - tanpa status pernikahan
  const [anak, setAnak] = useState<
    Array<{
      name: string;
      umur: string;
      jenisKelamin: string;
      nik: string;
    }>
  >([]);

  const isMarried = formData.statusMenikah === "Sudah Menikah";

  const handleStatusMenikahChange = (val: string) => {
    setFormData({ ...formData, statusMenikah: val });
    if (val === "Sudah Menikah") {
      // Set default opposite gender for pasangan
      setPasangan((prev) => ({
        ...prev,
        jenisKelamin: formData.jenisKelamin === "Laki-laki" ? "Perempuan" : "Laki-laki",
      }));
    }
  };

  const handleAddAnak = () => {
    setAnak([
      ...anak,
      {
        name: "",
        umur: "",
        jenisKelamin: "Laki-laki",
        nik: "",
      },
    ]);
  };

  const handleAnakChange = (index: number, field: string, value: string) => {
    const updated = [...anak];
    updated[index] = { ...updated[index], [field]: value };
    setAnak(updated);
  };

  const handleRemoveAnak = (index: number) => {
    setAnak(anak.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validasi dasar
    if (!formData.username.trim() || !formData.password || !formData.nik.trim() || !formData.name.trim() || !formData.umur) {
      setError("Mohon lengkapi seluruh kolom wajib Kepala Keluarga.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (formData.password.length < 6) {
      setError("Password minimal harus 6 karakter.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (isMarried) {
      if (!pasangan.name.trim() || !pasangan.umur) {
        setError("Mohon lengkapi nama dan umur pasangan (Istri/Suami).");
        return;
      }
    }

    for (let i = 0; i < anak.length; i++) {
      if (!anak[i].name.trim() || !anak[i].umur) {
        setError(`Mohon lengkapi nama dan umur untuk Anak ke-${i + 1}.`);
        return;
      }
    }

    setLoading(true);

    const payload = {
      username: formData.username.trim(),
      password: formData.password,
      nik: formData.nik.trim(),
      name: formData.name.trim(),
      umur: parseInt(formData.umur, 10),
      jenisKelamin: formData.jenisKelamin,
      statusMenikah: formData.statusMenikah,
      pasangan: isMarried
        ? {
            name: pasangan.name.trim(),
            umur: parseInt(pasangan.umur, 10),
            jenisKelamin: pasangan.jenisKelamin,
            nik: pasangan.nik.trim() || null,
          }
        : null,
      anak: anak.map((a) => ({
        name: a.name.trim(),
        umur: parseInt(a.umur, 10),
        jenisKelamin: a.jenisKelamin,
        nik: a.nik.trim() || null,
      })),
    };

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Template pesan WA sesuai instruksi persis:
        // Shalom admin....
        // Saya [nama kepala keluarga], username [username] sudah melakukan registrasi akun mohon untuk di cek akun saya.
        const message = `Shalom admin....\nSaya ${formData.name}, username ${formData.username} sudah melakukan registrasi akun mohon untuk di cek akun saya.`;

        const generatedWaUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
        setWaLink(generatedWaUrl);
        setRegistrationSuccess(true);

        // Buka WhatsApp langsung di tab baru
        try {
          window.open(generatedWaUrl, "_blank");
        } catch {
          // Jika diblokir oleh popup blocker browser, fallback tersedia di UI
        }
      } else {
        setError(data.error || "Gagal melakukan registrasi");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("Terjadi kesalahan jaringan atau server.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setLoading(false);
    }
  };

  // SUCCESS SCREEN
  if (registrationSuccess) {
    return (
      <div style={{ maxWidth: "560px", margin: "60px auto", padding: "20px" }}>
        <div
          style={{
            background: "black",
            padding: "40px 30px",
            borderRadius: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            textAlign: "center",
            border: "1px solid var(--color-border)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              background: "#dcfce7",
              color: "#16a34a",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: "1.6rem", fontWeight: "bold", marginBottom: "12px", color: "#111827" }}>
            Pendaftaran Berhasil!
          </h2>

          <p style={{ color: "#4b5563", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "24px" }}>
            Terima kasih <strong>{formData.name}</strong>. Data registrasi keluarga Anda telah berhasil tersimpan di sistem gereja dan saat ini sedang <strong>menunggu persetujuan (approval) admin</strong>.
          </p>

          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "28px",
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <MessageCircle size={22} style={{ color: "#2563eb", flexShrink: 0, marginTop: "2px" }} />
              <div style={{ fontSize: "0.88rem", color: "#1e40af", lineHeight: "1.5" }}>
                <strong>Konfirmasi WhatsApp ke Admin:</strong>
                <p style={{ margin: "4px 0 0" }}>
                  Jika WhatsApp belum terbuka otomatis, silakan klik tombol hijau di bawah untuk mengirim pesan konfirmasi ke Admin agar akun Anda segera diaktifkan.
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                backgroundColor: "#25D366",
                color: "black",
                fontWeight: 600,
                padding: "14px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "1rem",
                textDecoration: "none",
                boxShadow: "0 4px 10px rgba(37, 211, 102, 0.3)",
              }}
            >
              <Send size={18} />
              Buka WhatsApp Admin Sekarang
            </a>

            <button
              onClick={() => router.push("/login")}
              className="btn btn-outline"
              style={{
                padding: "12px",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontSize: "0.95rem",
              }}
            >
              Menuju Halaman Login
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "680px", margin: "40px auto 80px", padding: "0 20px" }}>
      <div
        style={{
          background: "black",
          padding: "36px 30px",
          borderRadius: "16px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Header Form */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
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
              width={70}
              height={45}
              style={{ objectFit: "contain", height: "45px", width: "auto" }}
              priority
            />
          </div>
          <h1 style={{ fontSize: "1.7rem", fontWeight: "bold", margin: "0 0 6px" }}>
            Pendaftaran Akun Jemaat
          </h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem" }}>
            GPT Kristus Gembala Agung — Silakan isi data kepala keluarga dan anggota keluarga
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fca5a5",
              color: "#991b1b",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "0.9rem",
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* SECTION 1: AKUN LOGIN */}
          <div style={{ background: "#000000ff", padding: "18px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", color: "var(--color-primary)", fontWeight: 700, fontSize: "1rem" }}>
              <Lock size={18} />
              <span>1. Akun Login</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Username <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: yohanes88"
                  className="form-input"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s+/g, "") })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Password <span style={{ color: "red" }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimal 6 karakter"
                    className="form-input"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ paddingRight: "40px", width: "100%" }}
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
            </div>
          </div>

          {/* SECTION 2: BIODATA KEPALA KELUARGA */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", color: "var(--color-primary)", fontWeight: 700, fontSize: "1rem" }}>
              <User size={18} />
              <span>2. Biodata Kepala Keluarga</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  NIK (Kepala Keluarga) <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nomor Induk Kependudukan (16 digit)"
                  className="form-input"
                  required
                  value={formData.nik}
                  onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Nama Lengkap Kepala Keluarga <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap sesuai KTP"
                  className="form-input"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Umur (Tahun) <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Contoh: 38"
                    className="form-input"
                    required
                    value={formData.umur}
                    onChange={(e) => setFormData({ ...formData, umur: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Jenis Kelamin <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    className="form-input"
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value })}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  Status Pernikahan <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  className="form-input"
                  value={formData.statusMenikah}
                  onChange={(e) => handleStatusMenikahChange(e.target.value)}
                >
                  <option value="Belum Menikah">Belum Menikah</option>
                  <option value="Sudah Menikah">Sudah Menikah</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: BIODATA ISTRI/SUAMI (HANYA JIKA SUDAH MENIKAH) */}
          {isMarried && (
            <div
              style={{
                background: "#000000ff",
                padding: "20px",
                borderRadius: "12px",
                border: "1px solid #f5d0fe",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "14px",
                  color: "#a21caf",
                  fontWeight: 700,
                  fontSize: "1rem",
                }}
              >
                <Heart size={18} />
                <span>3. Biodata Pasangan (Istri / Suami)</span>
              </div>
              <p style={{ fontSize: "0.82rem", color: "#701a75", marginTop: "-8px", marginBottom: "14px" }}>
                Informasi pasangan hidup (tanpa perlu mengisi status pernikahan)
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    Nama Lengkap Pasangan <span style={{ color: "red" }}>*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nama lengkap istri / suami"
                    className="form-input"
                    required={isMarried}
                    value={pasangan.name}
                    onChange={(e) => setPasangan({ ...pasangan, name: e.target.value })}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      Umur Pasangan (Tahun) <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Contoh: 35"
                      className="form-input"
                      required={isMarried}
                      value={pasangan.umur}
                      onChange={(e) => setPasangan({ ...pasangan, umur: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      Jenis Kelamin <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      className="form-input"
                      value={pasangan.jenisKelamin}
                      onChange={(e) => setPasangan({ ...pasangan, jenisKelamin: e.target.value })}
                    >
                      <option value="Perempuan">Perempuan</option>
                      <option value="Laki-laki">Laki-laki</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
                    NIK Pasangan <span style={{ fontSize: "0.8rem", color: "#6b7280" }}>(Boleh dikosongkan)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Nomor Induk Kependudukan (jika ada)"
                    className="form-input"
                    value={pasangan.nik}
                    onChange={(e) => setPasangan({ ...pasangan, nik: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: DATA ANAK */}
          <div
            style={{
              background: "#000000ff",
              padding: "20px",
              borderRadius: "12px",
              border: "1px solid #bfdbfe",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f1e42cff", fontWeight: 700, fontSize: "1rem" }}>
                  <Baby size={18} />
                  <span>{isMarried ? "4. Data Anak" : "3. Data Anak"}</span>
                </div>
                <p style={{ fontSize: "0.82rem", color: "#f1e42cff", margin: "2px 0 0" }}>
                  Jumlah Anak Terdaftar: <strong>{anak.length} anak</strong>
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddAnak}
                className="btn btn-primary"
                style={{
                  fontSize: "0.82rem",
                  padding: "0.4rem 0.8rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Plus size={14} /> Tambah Anak
              </button>
            </div>

            {anak.length === 0 ? (
              <div
                style={{
                  background: "black",
                  padding: "16px",
                  borderRadius: "8px",
                  textAlign: "center",
                  color: "#64748b",
                  fontSize: "0.88rem",
                  border: "1px dashed #cbd5e1",
                }}
              >
                Belum ada data anak yang ditambahkan. Klik tombol <strong>+ Tambah Anak</strong> di atas jika memiliki anak.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {anak.map((a, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "black",
                      padding: "16px",
                      borderRadius: "10px",
                      border: "1px solid #dbeafe",
                      position: "relative",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                        borderBottom: "1px solid #f1f5f9",
                        paddingBottom: "8px",
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: "0.9rem", color: "#f1e42cff" }}>
                        Biodata Anak ke-{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAnak(idx)}
                        style={{
                          background: "#fee2e2",
                          color: "#dc2626",
                          border: "none",
                          borderRadius: "6px",
                          padding: "4px 8px",
                          fontSize: "0.78rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontWeight: 600,
                        }}
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          Nama Anak <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nama lengkap anak"
                          className="form-input"
                          required
                          value={a.name}
                          onChange={(e) => handleAnakChange(idx, "name", e.target.value)}
                        />
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                            Umur Anak (Tahun) <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="80"
                            placeholder="Contoh: 10"
                            className="form-input"
                            required
                            value={a.umur}
                            onChange={(e) => handleAnakChange(idx, "umur", e.target.value)}
                          />
                        </div>

                        <div className="form-group" style={{ margin: 0 }}>
                          <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                            Jenis Kelamin <span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            className="form-input"
                            value={a.jenisKelamin}
                            onChange={(e) => handleAnakChange(idx, "jenisKelamin", e.target.value)}
                          >
                            <option value="Laki-laki">Laki-laki</option>
                            <option value="Perempuan">Perempuan</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group" style={{ margin: 0 }}>
                        <label className="form-label" style={{ fontSize: "0.82rem", fontWeight: 600 }}>
                          NIK Anak <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>(Boleh dikosongkan)</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Nomor Induk Kependudukan anak (jika ada)"
                          className="form-input"
                          value={a.nik}
                          onChange={(e) => handleAnakChange(idx, "nik", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <div style={{ marginTop: "10px" }}>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{
                width: "100%",
                justifyContent: "center",
                padding: "14px",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {loading ? (
                "Memproses Pendaftaran..."
              ) : (
                <>
                  <UserCheck size={18} />
                  Daftar & Hubungi Admin WA
                </>
              )}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.85rem", color: "#6b7280", marginTop: "12px" }}>
              Setelah menekan tombol daftar, data Anda akan langsung terkirim ke sistem dan diarahkan ke WhatsApp Admin untuk verifikasi.
            </p>

            <div style={{ textAlign: "center", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--color-border)" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}>
                Sudah memiliki akun jemaat?{" "}
              </span>
              <Link href="/login" style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "0.9rem" }}>
                Masuk di sini
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}