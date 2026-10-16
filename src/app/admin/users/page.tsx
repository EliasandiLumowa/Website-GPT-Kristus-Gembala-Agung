"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Check,
  X,
  Loader2,
  Search,
  Eye,
  Trash2,
  Users,
  UserCheck,
  UserX,
  Clock,
  Heart,
  Baby,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

interface Pasangan {
  id: string;
  nik: string | null;
  name: string;
  umur: number | null;
  jenisKelamin: string;
  tanggalLahir: string | null;
}

interface Anak {
  id: string;
  nik: string | null;
  name: string;
  umur: number | null;
  jenisKelamin: string;
  tanggalLahir: string | null;
}

interface User {
  id: string;
  username: string;
  nik: string;
  name: string;
  umur: number | null;
  jenisKelamin: string;
  tanggalLahir: string | null;
  statusMenikah: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  pasangan?: Pasangan | null;
  anak?: Anak[];
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "active">("all");
  
  // Modals state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        console.error("Gagal mengambil data user");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("filter") === "pending") {
        setStatusFilter("pending");
      }
    }
  }, []);

  const toggleStatus = async (id: string, newStatus: boolean) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newStatus }),
      });

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, isActive: newStatus } : u))
        );
        if (selectedUser && selectedUser.id === id) {
          setSelectedUser((prev) => (prev ? { ...prev, isActive: newStatus } : null));
        }
      } else {
        alert("Gagal mengubah status jemaat");
      }
    } catch (error) {
      console.error("Gagal update status", error);
      alert("Terjadi kesalahan sistem");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
        if (selectedUser && selectedUser.id === userToDelete.id) {
          setSelectedUser(null);
        }
        setUserToDelete(null);
      } else {
        alert("Gagal menghapus user");
      }
    } catch (error) {
      console.error("Gagal delete user", error);
      alert("Terjadi kesalahan sistem saat menghapus");
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Status filter
      if (statusFilter === "pending" && user.isActive) return false;
      if (statusFilter === "active" && !user.isActive) return false;
      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchName = user.name.toLowerCase().includes(query);
        const matchNik = user.nik.toLowerCase().includes(query);
        const matchUsername = user.username.toLowerCase().includes(query);
        const matchPasangan = user.pasangan?.name.toLowerCase().includes(query);
        const matchAnak = user.anak?.some((a) => a.name.toLowerCase().includes(query));
        return matchName || matchNik || matchUsername || matchPasangan || matchAnak;
      }
      return true;
    });
  }, [users, statusFilter, search]);

  const pendingCount = users.filter((u) => !u.isActive).length;
  const activeCount = users.filter((u) => u.isActive).length;

  return (
    <div style={{ maxWidth: "1400px", margin: "0 auto", paddingBottom: "3rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: "bold", margin: 0, color: "var(--color-white)" }}>
            Manajemen Jemaat
          </h1>
          <p style={{ color: "var(--color-text-secondary)", marginTop: "4px", fontSize: "0.95rem" }}>
            Kelola data pendaftaran akun jemaat, tinjau biodata keluarga, dan persetujuan akun.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="btn btn-outline"
          disabled={loading}
          style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.85rem" }}
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Segarkan Data
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <div
          onClick={() => setStatusFilter("all")}
          style={{
            background: "var(--gradient-card)",
            padding: "1.25rem",
            borderRadius: "12px",
            border: statusFilter === "all" ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
            boxShadow: statusFilter === "all" ? "0 0 15px rgba(212, 160, 23, 0.2)" : "var(--shadow-sm)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            transition: "all var(--transition-fast)",
          }}
        >
          <div style={{ background: "rgba(212, 160, 23, 0.15)", color: "var(--gold-400)", padding: "10px", borderRadius: "10px" }}>
            <Users size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>Total Jemaat</div>
            <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "var(--color-white)" }}>{users.length}</div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("pending")}
          style={{
            background: "var(--gradient-card)",
            padding: "1.25rem",
            borderRadius: "12px",
            border: statusFilter === "pending" ? "2px solid var(--gold-400)" : "1px solid var(--color-border)",
            boxShadow: statusFilter === "pending" ? "0 0 15px rgba(212, 160, 23, 0.3)" : "var(--shadow-sm)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            transition: "all var(--transition-fast)",
          }}
        >
          <div style={{ background: "rgba(212, 160, 23, 0.2)", color: "var(--gold-300)", padding: "10px", borderRadius: "10px" }}>
            <Clock size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>Menunggu Persetujuan</div>
            <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: pendingCount > 0 ? "var(--gold-400)" : "var(--color-white)" }}>
              {pendingCount}
            </div>
          </div>
        </div>

        <div
          onClick={() => setStatusFilter("active")}
          style={{
            background: "var(--gradient-card)",
            padding: "1.25rem",
            borderRadius: "12px",
            border: statusFilter === "active" ? "2px solid #4ade80" : "1px solid var(--color-border)",
            boxShadow: statusFilter === "active" ? "0 0 15px rgba(74, 222, 128, 0.2)" : "var(--shadow-sm)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            transition: "all var(--transition-fast)",
          }}
        >
          <div style={{ background: "rgba(76, 175, 80, 0.15)", color: "#4ade80", padding: "10px", borderRadius: "10px" }}>
            <UserCheck size={22} />
          </div>
          <div>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>Akun Aktif</div>
            <div style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#4ade80" }}>{activeCount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: "var(--gradient-card)",
          padding: "1rem 1.25rem",
          borderRadius: "12px",
          border: "1px solid var(--color-border)",
          marginBottom: "1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button
            onClick={() => setStatusFilter("all")}
            className={`btn ${statusFilter === "all" ? "btn-primary" : "btn-outline"}`}
            style={{ fontSize: "0.85rem", padding: "0.45rem 0.9rem" }}
          >
            Semua ({users.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`btn ${statusFilter === "pending" ? "btn-primary" : "btn-outline"}`}
            style={{
              fontSize: "0.85rem",
              padding: "0.45rem 0.9rem",
              borderColor: statusFilter === "pending" ? undefined : "var(--gold-400)",
              color: statusFilter === "pending" ? undefined : "var(--gold-300)",
            }}
          >
            Menunggu ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`btn ${statusFilter === "active" ? "btn-primary" : "btn-outline"}`}
            style={{
              fontSize: "0.85rem",
              padding: "0.45rem 0.9rem",
              borderColor: statusFilter === "active" ? undefined : "#4ade80",
              color: statusFilter === "active" ? undefined : "#4ade80",
            }}
          >
            Aktif ({activeCount})
          </button>
        </div>

        <div style={{ position: "relative", minWidth: "260px", flex: "1", maxWidth: "400px" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--gold-400)",
            }}
          />
          <input
            type="text"
            placeholder="Cari nama, NIK, username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: "36px", width: "100%", fontSize: "0.9rem" }}
          />
        </div>
      </div>

      {/* Main Table */}
      <div
        style={{
          background: "var(--gradient-card)",
          borderRadius: "12px",
          border: "1px solid var(--color-border)",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
          overflow: "hidden",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr
                style={{
                  background: "rgba(212, 160, 23, 0.12)",
                  borderBottom: "1px solid rgba(212, 160, 23, 0.25)",
                  color: "var(--gold-300)",
                }}
              >
                <th style={{ padding: "14px 16px", fontWeight: 700 }}>Kepala Keluarga</th>
                <th style={{ padding: "14px 16px", fontWeight: 700 }}>NIK</th>
                <th style={{ padding: "14px 16px", fontWeight: 700 }}>Umur / JK</th>
                <th style={{ padding: "14px 16px", fontWeight: 700 }}>Keluarga</th>
                <th style={{ padding: "14px 16px", fontWeight: 700 }}>Status Akun</th>
                <th style={{ padding: "14px 16px", fontWeight: 700 }}>Tgl Daftar</th>
                <th style={{ padding: "14px 16px", fontWeight: 700, textAlign: "right" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px" }}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", color: "var(--gold-400)" }}>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Memuat data jemaat...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: "40px", color: "var(--color-text-secondary)" }}>
                    <Users size={36} style={{ margin: "0 auto 10px", opacity: 0.3, color: "var(--gold-400)" }} />
                    <p style={{ margin: 0, fontWeight: 500 }}>
                      {search || statusFilter !== "all"
                        ? "Tidak ada data jemaat yang sesuai dengan kriteria pencarian."
                        : "Belum ada pendaftaran akun jemaat."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isMarried = user.statusMenikah === "Sudah Menikah" || user.statusMenikah === "Menikah";
                  const childCount = user.anak?.length || 0;

                  return (
                    <tr
                      key={user.id}
                      style={{
                        borderBottom: "1px solid var(--color-border)",
                        transition: "background-color 0.15s ease",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(212, 160, 23, 0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {/* Nama & Username */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600, color: "var(--color-white)" }}>{user.name}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--gold-400)" }}>
                          @{user.username}
                        </div>
                      </td>

                      {/* NIK */}
                      <td style={{ padding: "14px 16px", fontFamily: "monospace", fontSize: "0.85rem", color: "var(--color-text)" }}>
                        {user.nik}
                      </td>

                      {/* Umur & JK */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ color: "var(--color-text)" }}>{user.umur ? `${user.umur} thn` : "-"}</div>
                        <div style={{ fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
                          {user.jenisKelamin}
                        </div>
                      </td>

                      {/* Info Keluarga */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span
                            style={{
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              color: isMarried ? "var(--gold-300)" : "var(--color-text-secondary)",
                            }}
                          >
                            {isMarried ? "💍 Sudah Menikah" : "Belum Menikah"}
                          </span>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)" }}>
                            {isMarried && user.pasangan ? `Pasangan: ${user.pasangan.name}` : ""}
                            {childCount > 0 ? ` • ${childCount} Anak` : isMarried ? " • 0 Anak" : ""}
                          </span>
                        </div>
                      </td>

                      {/* Status Approval */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            backgroundColor: user.isActive ? "rgba(76, 175, 80, 0.15)" : "rgba(212, 160, 23, 0.15)",
                            color: user.isActive ? "#4ade80" : "var(--gold-300)",
                            border: user.isActive ? "1px solid rgba(76, 175, 80, 0.4)" : "1px solid rgba(212, 160, 23, 0.4)",
                          }}
                        >
                          {user.isActive ? (
                            <>
                              <Check size={12} /> Aktif / Disetujui
                            </>
                          ) : (
                            <>
                              <Clock size={12} /> Menunggu
                            </>
                          )}
                        </span>
                      </td>

                      {/* Tgl Daftar */}
                      <td style={{ padding: "14px 16px", fontSize: "0.82rem", color: "var(--color-text-secondary)" }}>
                        {new Date(user.createdAt).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Action buttons */}
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
                          {/* Quick Toggle Status */}
                          <button
                            onClick={() => toggleStatus(user.id, !user.isActive)}
                            disabled={actionLoading}
                            title={user.isActive ? "Nonaktifkan Akun" : "Setujui Akun"}
                            style={{
                              padding: "6px 12px",
                              borderRadius: "6px",
                              border: user.isActive ? "1px solid rgba(239, 83, 80, 0.5)" : "none",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              backgroundColor: user.isActive ? "transparent" : "var(--color-primary)",
                              color: user.isActive ? "#ef5350" : "#0a0a0a",
                              fontWeight: 700,
                              fontSize: "0.8rem",
                              transition: "all 0.2s",
                            }}
                          >
                            {user.isActive ? (
                              <>
                                <X size={14} /> Nonaktifkan
                              </>
                            ) : (
                              <>
                                <Check size={14} /> Setujui
                              </>
                            )}
                          </button>

                          {/* View Detail Modal Button */}
                          <button
                            onClick={() => setSelectedUser(user)}
                            title="Lihat Detail Lengkap Keluarga"
                            style={{
                              padding: "6px 10px",
                              borderRadius: "6px",
                              border: "1px solid var(--color-border-light)",
                              backgroundColor: "rgba(255, 255, 255, 0.05)",
                              color: "var(--color-text)",
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "0.8rem",
                            }}
                          >
                            <Eye size={14} style={{ color: "var(--gold-400)" }} />
                            Detail
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setUserToDelete(user)}
                            title="Hapus Jemaat"
                            style={{
                              padding: "6px 8px",
                              borderRadius: "6px",
                              border: "none",
                              backgroundColor: "transparent",
                              color: "var(--color-error)",
                              cursor: "pointer",
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedUser && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setSelectedUser(null)}
        >
          <div
            style={{
              backgroundColor: "var(--black-600)",
              borderRadius: "16px",
              maxWidth: "650px",
              width: "100%",
              maxHeight: "90vh",
              overflowY: "auto",
              border: "1px solid rgba(212, 160, 23, 0.35)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(212, 160, 23, 0.1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "1.25rem 1.5rem",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(212, 160, 23, 0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ background: "rgba(212, 160, 23, 0.2)", color: "var(--gold-400)", padding: "8px", borderRadius: "8px" }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "bold", color: "var(--color-white)" }}>
                    Detail Data Keluarga Jemaat
                  </h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                    Terdaftar sejak {new Date(selectedUser.createdAt).toLocaleDateString("id-ID", { dateStyle: "long" })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text-muted)",
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {/* Section 1: Kepala Keluarga */}
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.35)",
                  borderRadius: "10px",
                  padding: "1.25rem",
                  border: "1px solid rgba(212, 160, 23, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    borderBottom: "1px solid var(--color-border)",
                    paddingBottom: "8px",
                  }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "0.95rem", color: "var(--gold-300)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Users size={16} /> Data Kepala Keluarga
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      padding: "2px 8px",
                      borderRadius: "99px",
                      fontWeight: 600,
                      backgroundColor: selectedUser.isActive ? "rgba(76, 175, 80, 0.15)" : "rgba(212, 160, 23, 0.15)",
                      color: selectedUser.isActive ? "#4ade80" : "var(--gold-300)",
                      border: selectedUser.isActive ? "1px solid rgba(76, 175, 80, 0.4)" : "1px solid rgba(212, 160, 23, 0.4)",
                    }}
                  >
                    {selectedUser.isActive ? "Disetujui" : "Menunggu Persetujuan"}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "10px",
                    fontSize: "0.88rem",
                  }}
                >
                  <div>
                    <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.78rem" }}>Nama Lengkap</span>
                    <strong style={{ color: "var(--color-white)" }}>{selectedUser.name}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.78rem" }}>Username</span>
                    <strong style={{ color: "var(--gold-400)" }}>@{selectedUser.username}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.78rem" }}>NIK Kepala Keluarga</span>
                    <strong style={{ color: "var(--color-text)", fontFamily: "monospace" }}>{selectedUser.nik}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.78rem" }}>Umur</span>
                    <strong style={{ color: "var(--color-white)" }}>{selectedUser.umur ? `${selectedUser.umur} Tahun` : "-"}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.78rem" }}>Jenis Kelamin</span>
                    <strong style={{ color: "var(--color-white)" }}>{selectedUser.jenisKelamin}</strong>
                  </div>
                  <div>
                    <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.78rem" }}>Status Pernikahan</span>
                    <strong style={{ color: "var(--color-white)" }}>{selectedUser.statusMenikah}</strong>
                  </div>
                </div>
              </div>

              {/* Section 2: Biodata Istri/Suami */}
              <div
                style={{
                  background: "rgba(212, 160, 23, 0.06)",
                  borderRadius: "10px",
                  padding: "1.25rem",
                  border: "1px solid rgba(212, 160, 23, 0.25)",
                }}
              >
                <div
                  style={{
                    fontWeight: "bold",
                    fontSize: "0.95rem",
                    color: "var(--gold-300)",
                    marginBottom: "10px",
                    borderBottom: "1px solid rgba(212, 160, 23, 0.2)",
                    paddingBottom: "8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Heart size={16} /> Biodata Pasangan (Istri / Suami)
                </div>

                {selectedUser.pasangan ? (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                      gap: "10px",
                      fontSize: "0.88rem",
                    }}
                  >
                    <div>
                      <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.78rem" }}>Nama Pasangan</span>
                      <strong style={{ color: "var(--color-white)" }}>{selectedUser.pasangan.name}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.78rem" }}>Umur</span>
                      <strong style={{ color: "var(--color-white)" }}>
                        {selectedUser.pasangan.umur ? `${selectedUser.pasangan.umur} Tahun` : "-"}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.78rem" }}>Jenis Kelamin</span>
                      <strong style={{ color: "var(--color-white)" }}>{selectedUser.pasangan.jenisKelamin}</strong>
                    </div>
                    <div>
                      <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.78rem" }}>NIK (Opsional)</span>
                      <strong style={{ color: "var(--color-text)", fontFamily: "monospace" }}>
                        {selectedUser.pasangan.nik || "-"}
                      </strong>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                    {selectedUser.statusMenikah === "Belum Menikah"
                      ? "Status Belum Menikah (Tidak ada data pasangan)"
                      : "Tidak ada data pasangan yang dicatat."}
                  </p>
                )}
              </div>

              {/* Section 3: Biodata Anak */}
              <div
                style={{
                  background: "rgba(0, 0, 0, 0.35)",
                  borderRadius: "10px",
                  padding: "1.25rem",
                  border: "1px solid rgba(212, 160, 23, 0.2)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                    borderBottom: "1px solid var(--color-border)",
                    paddingBottom: "8px",
                  }}
                >
                  <span style={{ fontWeight: "bold", fontSize: "0.95rem", color: "var(--gold-300)", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Baby size={16} /> Data Anak ({selectedUser.anak?.length || 0})
                  </span>
                </div>

                {!selectedUser.anak || selectedUser.anak.length === 0 ? (
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-text-muted)", fontStyle: "italic" }}>
                    Tidak ada data anak yang didaftarkan.
                  </p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {selectedUser.anak.map((a, idx) => (
                      <div
                        key={a.id || idx}
                        style={{
                          background: "rgba(22, 22, 22, 0.9)",
                          padding: "10px 14px",
                          borderRadius: "8px",
                          border: "1px solid rgba(212, 160, 23, 0.15)",
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                          gap: "8px",
                          fontSize: "0.85rem",
                        }}
                      >
                        <div>
                          <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.75rem" }}>
                            Anak ke-{idx + 1}
                          </span>
                          <strong style={{ color: "var(--color-white)" }}>{a.name}</strong>
                        </div>
                        <div>
                          <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.75rem" }}>Umur</span>
                          <span style={{ color: "var(--color-text)" }}>{a.umur ? `${a.umur} Tahun` : "-"}</span>
                        </div>
                        <div>
                          <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.75rem" }}>Jenis Kelamin</span>
                          <span style={{ color: "var(--color-text)" }}>{a.jenisKelamin}</span>
                        </div>
                        {a.nik && (
                          <div>
                            <span style={{ color: "var(--color-text-secondary)", display: "block", fontSize: "0.75rem" }}>NIK</span>
                            <span style={{ fontFamily: "monospace", color: "var(--color-text)" }}>{a.nik}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "1rem 1.5rem",
                borderTop: "1px solid var(--color-border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "rgba(0, 0, 0, 0.4)",
                borderBottomLeftRadius: "16px",
                borderBottomRightRadius: "16px",
              }}
            >
              <button
                onClick={() => setUserToDelete(selectedUser)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-error)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                }}
              >
                <Trash2 size={16} /> Hapus Jemaat
              </button>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="btn btn-outline"
                  style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
                >
                  Tutup
                </button>
                <button
                  onClick={() => toggleStatus(selectedUser.id, !selectedUser.isActive)}
                  disabled={actionLoading}
                  style={{
                    padding: "0.5rem 1.25rem",
                    borderRadius: "8px",
                    border: selectedUser.isActive ? "1px solid rgba(239, 83, 80, 0.5)" : "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: selectedUser.isActive ? "transparent" : "var(--color-primary)",
                    color: selectedUser.isActive ? "#ef5350" : "#0a0a0a",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  {selectedUser.isActive ? (
                    <>
                      <X size={16} /> Nonaktifkan Akun
                    </>
                  ) : (
                    <>
                      <Check size={16} /> Setujui Akun Ini
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {userToDelete && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(5px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: "20px",
          }}
          onClick={() => setUserToDelete(null)}
        >
          <div
            style={{
              backgroundColor: "var(--black-600)",
              borderRadius: "12px",
              maxWidth: "420px",
              width: "100%",
              padding: "24px",
              border: "1px solid rgba(239, 83, 80, 0.4)",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.8)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(239, 83, 80, 0.15)",
                color: "#ef5350",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
              }}
            >
              <AlertTriangle size={24} />
            </div>

            <h3 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "8px", color: "var(--color-white)" }}>
              Hapus Data Jemaat?
            </h3>
            <p style={{ color: "var(--color-text-secondary)", fontSize: "0.9rem", marginBottom: "20px", lineHeight: "1.5" }}>
              Apakah Anda yakin ingin menghapus akun <strong style={{ color: "var(--gold-400)" }}>{userToDelete.name}</strong> (@{userToDelete.username})? Tindakan ini akan menghapus seluruh data keluarga dan tidak dapat dibatalkan.
            </p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => setUserToDelete(null)}
                className="btn btn-outline"
                style={{ flex: 1, padding: "0.55rem" }}
                disabled={actionLoading}
              >
                Batal
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={actionLoading}
                style={{
                  flex: 1,
                  padding: "0.55rem",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "var(--color-error)",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {actionLoading ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}