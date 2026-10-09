"use client";

import { useState, useEffect } from "react";
import { Check, X, Loader2 } from "lucide-react";

type User = {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        // Refresh data setelah berhasil update
        fetchUsers();
      }
    } catch (error) {
      console.error("Gagal update status", error);
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "10px" }}><Loader2 className="animate-spin" /> Memuat data...</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Manajemen Jemaat</h1>
      
      <div style={{ overflowX: "auto", background: "white", padding: "1rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee" }}>
              <th style={{ padding: "12px" }}>Nama</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>Tanggal Daftar</th>
              <th style={{ padding: "12px" }}>Status</th>
              <th style={{ padding: "12px" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "20px" }}>Belum ada jemaat yang mendaftar.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{user.name}</td>
                  <td style={{ padding: "12px" }}>{user.email}</td>
                  <td style={{ padding: "12px" }}>{new Date(user.createdAt).toLocaleDateString('id-ID')}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ 
                      padding: "4px 8px", 
                      borderRadius: "99px", 
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      backgroundColor: user.isActive ? "#dcfce7" : "#fee2e2",
                      color: user.isActive ? "#166534" : "#991b1b"
                    }}>
                      {user.isActive ? "Aktif" : "Menunggu"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    <button 
                      onClick={() => toggleStatus(user.id, user.isActive)}
                      style={{ 
                        padding: "6px 12px", 
                        borderRadius: "6px", 
                        border: "none", 
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        backgroundColor: user.isActive ? "#ef4444" : "#10b981",
                        color: "white",
                        fontSize: "0.85rem"
                      }}
                    >
                      {user.isActive ? <><X size={14}/> Nonaktifkan</> : <><Check size={14}/> Setujui</>}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}