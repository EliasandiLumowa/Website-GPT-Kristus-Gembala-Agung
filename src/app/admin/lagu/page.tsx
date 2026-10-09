"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";

const columns = [
  { key: "title", label: "Judul Lagu" },
  { key: "artist", label: "Artis/Penyanyi" },
  { key: "category", label: "Kategori" },
  {
    key: "isOriginal",
    label: "Tipe",
    render: (value: unknown) =>
      value ? (
        <span className="badge badge-gold" style={{ fontSize: "0.75rem" }}>
          Ciptaan Sendiri
        </span>
      ) : (
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>Umum</span>
      ),
  },
  {
    key: "fileUrl",
    label: "Lampiran",
    render: (value: unknown) =>
      value ? (
        <a
          href={value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="badge badge-primary"
          style={{ textDecoration: "none", fontSize: "0.75rem" }}
        >
          {(value as string).toLowerCase().includes(".pdf") ? "📄 PDF" : "🖼️ Gambar"}
        </a>
      ) : (
        <span style={{ color: "var(--color-text-muted)", fontSize: "0.8rem" }}>-</span>
      ),
  },
  {
    key: "isPublished",
    label: "Status",
    render: (value: unknown) => (
      <span className={`badge ${value ? "badge-success" : "badge-error"}`}>
        {value ? "Published" : "Draft"}
      </span>
    ),
  },
];

const fields = [
  { key: "title", label: "Judul Lagu", type: "text" as const, required: true, placeholder: "Masukkan judul lagu" },
  { key: "artist", label: "Artis / Pencipta", type: "text" as const, placeholder: "Nama artis atau pencipta lagu" },
  { key: "isOriginal", label: "Tandai sebagai Lagu Ciptaan Sendiri", type: "checkbox" as const },
  { key: "category", label: "Kategori", type: "select" as const, options: [
    { value: "Pujian", label: "Pujian" },
    { value: "Penyembahan", label: "Penyembahan" },
    { value: "Ciptaan Sendiri", label: "Ciptaan Sendiri" },
    { value: "Hymne", label: "Hymne" },
    { value: "Natal", label: "Natal" },
    { value: "Paskah", label: "Paskah" },
    { value: "Lainnya", label: "Lainnya" },
  ]},
  { key: "youtubeUrl", label: "YouTube URL (opsional)", type: "url" as const, placeholder: "https://youtube.com/watch?v=..." },
  { key: "fileUrl", label: "Upload Partitur / Chord / Not Angka (Gambar atau PDF)", type: "file" as const, placeholder: "Unggah dokumen PDF atau gambar partitur/chord" },
  { key: "lyrics", label: "Lirik Lagu", type: "textarea" as const, required: true, placeholder: "Masukkan lirik lagu lengkap..." },
  { key: "isPublished", label: "Terbitkan", type: "checkbox" as const },
];

export default function AdminLaguPage() {
  return (
    <AdminCrudPage
      title="Lagu & Lyrics"
      apiEndpoint="/api/songs"
      columns={columns}
      fields={fields}
    />
  );
}
