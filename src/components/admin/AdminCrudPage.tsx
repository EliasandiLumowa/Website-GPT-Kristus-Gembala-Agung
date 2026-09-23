"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, X, Search, Upload, Loader2, Image as ImageIcon } from "lucide-react";

interface Column {
  key: string;
  label: string;
  render?: (value: unknown, item: Record<string, unknown>) => React.ReactNode;
}

export interface Field {
  key: string;
  label: string;
  type: "text" | "textarea" | "date" | "url" | "select" | "checkbox" | "image";
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  allowImagePaste?: boolean;
}

interface AdminCrudPageProps {
  title: string;
  apiEndpoint: string;
  columns: Column[];
  fields: Field[];
  searchable?: boolean;
}

export default function AdminCrudPage({
  title,
  apiEndpoint,
  columns,
  fields,
  searchable = true,
}: AdminCrudPageProps) {
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Gagal mengunggah gambar");
    }
    return data.url;
  };

  const handleImageUpload = async (file: File, fieldKey: string) => {
    try {
      setUploadingKey(fieldKey);
      const url = await uploadFile(file);
      setFormData((prev) => ({
        ...prev,
        [fieldKey]: url,
      }));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal mengunggah gambar");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleInsertImageToTextarea = async (file: File, fieldKey: string) => {
    try {
      setUploadingKey(fieldKey);
      const url = await uploadFile(file);
      const imageMarkdown = `\n\n![Gambar](${url})\n\n`;

      const textarea = document.getElementById(`textarea-${fieldKey}`) as HTMLTextAreaElement | null;
      if (textarea) {
        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || 0;
        const currentText = (formData[fieldKey] as string) || "";
        const updated = currentText.substring(0, start) + imageMarkdown + currentText.substring(end);
        setFormData((prev) => ({
          ...prev,
          [fieldKey]: updated,
        }));
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
        }, 50);
      } else {
        setFormData((prev) => ({
          ...prev,
          [fieldKey]: ((prev[fieldKey] as string) || "") + imageMarkdown,
        }));
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal mengunggah gambar");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleTextareaPaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>, fieldKey: string) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image/")) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          await handleInsertImageToTextarea(file, fieldKey);
          break;
        }
      }
    }
  };

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      params.set("admin", "true");
      params.set("limit", "100");

      const res = await fetch(`${apiEndpoint}?${params}`);
      const data = await res.json();
      setItems(data.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, search]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const openCreateModal = () => {
    setEditingItem(null);
    const defaults: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === "checkbox") defaults[f.key] = true;
      else defaults[f.key] = "";
    });
    setFormData(defaults);
    setShowModal(true);
  };

  const openEditModal = (item: Record<string, unknown>) => {
    setEditingItem(item);
    const data: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === "date" && item[f.key]) {
        data[f.key] = new Date(item[f.key] as string).toISOString().split("T")[0];
      } else {
        data[f.key] = item[f.key] ?? "";
      }
    });
    setFormData(data);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const url = editingItem
        ? `${apiEndpoint}/${editingItem.id || editingItem.slug}`
        : apiEndpoint;
      const method = editingItem ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowModal(false);
        fetchItems();
      } else {
        const err = await res.json();
        alert(err.error || "Terjadi kesalahan");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Record<string, unknown>) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    try {
      const res = await fetch(
        `${apiEndpoint}/${item.id || item.slug}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        fetchItems();
      }
    } catch {
      alert("Gagal menghapus data");
    }
  };

  return (
    <>
      <div className="admin-header">
        <h1>{title}</h1>
        <button className="btn btn-primary" onClick={openCreateModal}>
          <Plus size={18} />
          Tambah Baru
        </button>
      </div>

      {searchable && (
        <div className="search-bar" style={{ maxWidth: "400px", margin: "0 0 var(--space-xl) 0" }}>
          <Search className="search-icon" size={18} />
          <input
            type="text"
            placeholder="Cari..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <p>Memuat data...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>Belum ada data</h3>
          <p>Klik &quot;Tambah Baru&quot; untuk menambahkan data pertama</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={(item.id as string) || idx}>
                  <td>{idx + 1}</td>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(item[col.key], item)
                        : (item[col.key] as string) || "-"}
                    </td>
                  ))}
                  <td>
                    <div className="actions">
                      <button
                        className="action-btn"
                        onClick={() => openEditModal(item)}
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(item)}
                        title="Hapus"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? "Edit" : "Tambah"} {title}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {fields.map((field) => (
                <div className="form-group" key={field.key}>
                  {field.type === "checkbox" ? (
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-sm)",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={!!formData[field.key]}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            [field.key]: e.target.checked,
                          })
                        }
                        style={{ width: "18px", height: "18px", accentColor: "var(--color-primary)" }}
                      />
                      <span className="form-label" style={{ margin: 0 }}>
                        {field.label}
                      </span>
                    </label>
                  ) : (
                    <>
                      <label className="form-label">{field.label}</label>
                      {field.type === "image" ? (
                        <div>
                          <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-xs)" }}>
                            <input
                              type="text"
                              className="form-input"
                              placeholder={field.placeholder || "https://... atau unggah gambar"}
                              value={(formData[field.key] as string) || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [field.key]: e.target.value,
                                })
                              }
                              required={field.required}
                            />
                            <label
                              className="btn btn-outline"
                              style={{
                                cursor: uploadingKey === field.key ? "not-allowed" : "pointer",
                                whiteSpace: "nowrap",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                margin: 0,
                                flexShrink: 0,
                              }}
                            >
                              {uploadingKey === field.key ? (
                                <>
                                  <Loader2 size={16} className="spin" /> Unggah...
                                </>
                              ) : (
                                <>
                                  <Upload size={16} /> Unggah File
                                </>
                              )}
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                disabled={uploadingKey === field.key}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(file, field.key);
                                  e.target.value = "";
                                }}
                              />
                            </label>
                          </div>
                          {formData[field.key] ? (
                            <div
                              style={{
                                position: "relative",
                                marginTop: "var(--space-xs)",
                                display: "inline-block",
                                borderRadius: "var(--radius-md)",
                                overflow: "hidden",
                                border: "1px solid var(--color-border)",
                              }}
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={formData[field.key] as string}
                                alt="Pratinjau Gambar"
                                style={{
                                  maxHeight: "120px",
                                  maxWidth: "100%",
                                  display: "block",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = "none";
                                }}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setFormData({
                                    ...formData,
                                    [field.key]: "",
                                  })
                                }
                                style={{
                                  position: "absolute",
                                  top: "4px",
                                  right: "4px",
                                  background: "rgba(0,0,0,0.75)",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "22px",
                                  height: "22px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  cursor: "pointer",
                                }}
                                title="Hapus gambar"
                              >
                                <X size={13} />
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ) : field.type === "textarea" ? (
                        <div>
                          {field.allowImagePaste && (
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                marginBottom: "var(--space-xs)",
                                padding: "6px 10px",
                                background: "rgba(212, 160, 23, 0.08)",
                                borderRadius: "var(--radius-sm)",
                                border: "1px dashed rgba(212, 160, 23, 0.3)",
                                fontSize: "0.82rem",
                                color: "var(--color-text-secondary)",
                              }}
                            >
                              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                💡 <strong>Tips:</strong> Bisa langsung <em>Paste (Ctrl+V)</em> gambar ke dalam teks!
                              </span>
                              <label
                                className="btn"
                                style={{
                                  padding: "3px 10px",
                                  fontSize: "0.8rem",
                                  background: "var(--color-black-600)",
                                  border: "1px solid var(--color-border)",
                                  cursor: uploadingKey === field.key ? "not-allowed" : "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  margin: 0,
                                  borderRadius: "var(--radius-sm)",
                                  color: "var(--color-primary)",
                                  fontWeight: 500,
                                }}
                              >
                                {uploadingKey === field.key ? (
                                  <>
                                    <Loader2 size={13} className="spin" /> Mengunggah...
                                  </>
                                ) : (
                                  <>
                                    <ImageIcon size={13} /> + Sisipkan Gambar
                                  </>
                                )}
                                <input
                                  type="file"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  disabled={uploadingKey === field.key}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleInsertImageToTextarea(file, field.key);
                                    e.target.value = "";
                                  }}
                                />
                              </label>
                            </div>
                          )}
                          <textarea
                            id={`textarea-${field.key}`}
                            className="form-input"
                            placeholder={field.placeholder}
                            value={(formData[field.key] as string) || ""}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [field.key]: e.target.value,
                              })
                            }
                            onPaste={
                              field.allowImagePaste
                                ? (e) => handleTextareaPaste(e, field.key)
                                : undefined
                            }
                            required={field.required}
                            rows={field.allowImagePaste ? 8 : 6}
                            style={{ fontFamily: "inherit" }}
                          />
                        </div>
                      ) : field.type === "select" ? (
                        <select
                          className="form-input"
                          value={(formData[field.key] as string) || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field.key]: e.target.value,
                            })
                          }
                        >
                          <option value="">Pilih...</option>
                          {field.options?.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          className="form-input"
                          placeholder={field.placeholder}
                          value={(formData[field.key] as string) || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              [field.key]: e.target.value,
                            })
                          }
                          required={field.required}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowModal(false)}
              >
                Batal
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
