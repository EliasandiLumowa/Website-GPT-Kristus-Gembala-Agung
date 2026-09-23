"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";

const columns = [
  { key: "title", label: "Judul" },
  {
    key: "isPublished",
    label: "Status",
    render: (value: unknown) => (
      <span className={`badge ${value ? "badge-success" : "badge-error"}`}>
        {value ? "Published" : "Draft"}
      </span>
    ),
  },
  {
    key: "publishedAt",
    label: "Tanggal Terbit",
    render: (value: unknown) =>
      value
        ? new Date(value as string).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "-",
  },
];

const fields = [
  { key: "title", label: "Judul Berita", type: "text" as const, required: true, placeholder: "Masukkan judul berita" },
  { key: "excerpt", label: "Ringkasan", type: "textarea" as const, placeholder: "Ringkasan singkat berita" },
  {
    key: "content",
    label: "Konten Berita",
    type: "textarea" as const,
    required: true,
    placeholder: "Tulis isi berita di sini... Anda bisa langsung paste (Ctrl+V) gambar dari clipboard atau klik tombol Sisipkan Gambar!",
    allowImagePaste: true,
  },
  {
    key: "image",
    label: "Gambar Sampul / Banner (opsional)",
    type: "image" as const,
    placeholder: "https://... atau unggah file gambar",
  },
  { key: "isPublished", label: "Terbitkan Langsung", type: "checkbox" as const },
];

export default function AdminBeritaPage() {
  return (
    <AdminCrudPage
      title="Berita & Informasi"
      apiEndpoint="/api/news"
      columns={columns}
      fields={fields}
    />
  );
}
