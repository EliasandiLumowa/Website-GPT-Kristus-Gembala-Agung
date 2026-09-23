"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";

const columns = [
  { key: "title", label: "Judul Lagu" },
  { key: "artist", label: "Artis/Penyanyi" },
  { key: "category", label: "Kategori" },
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
  { key: "artist", label: "Artis/Penyanyi", type: "text" as const, placeholder: "Nama artis atau penyanyi" },
  { key: "category", label: "Kategori", type: "select" as const, options: [
    { value: "Pujian", label: "Pujian" },
    { value: "Penyembahan", label: "Penyembahan" },
    { value: "Hymne", label: "Hymne" },
    { value: "Natal", label: "Natal" },
    { value: "Paskah", label: "Paskah" },
    { value: "Lainnya", label: "Lainnya" },
  ]},
  { key: "lyrics", label: "Lirik", type: "textarea" as const, required: true, placeholder: "Masukkan lirik lagu" },
  { key: "youtubeUrl", label: "YouTube URL (opsional)", type: "url" as const, placeholder: "https://youtube.com/watch?v=..." },
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
