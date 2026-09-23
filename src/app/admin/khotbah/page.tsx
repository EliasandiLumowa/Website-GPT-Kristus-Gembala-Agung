"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";

const columns = [
  { key: "title", label: "Judul" },
  { key: "speaker", label: "Pengkhotbah" },
  {
    key: "date",
    label: "Tanggal",
    render: (value: unknown) =>
      new Date(value as string).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
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
  { key: "title", label: "Judul Khotbah", type: "text" as const, required: true, placeholder: "Masukkan judul khotbah" },
  { key: "speaker", label: "Pengkhotbah", type: "text" as const, required: true, placeholder: "Nama pengkhotbah" },
  { key: "date", label: "Tanggal", type: "date" as const, required: true },
  { key: "youtubeUrl", label: "YouTube URL", type: "url" as const, required: true, placeholder: "https://youtube.com/watch?v=..." },
  { key: "description", label: "Deskripsi", type: "textarea" as const, placeholder: "Deskripsi singkat khotbah" },
  { key: "isPublished", label: "Terbitkan", type: "checkbox" as const },
];

export default function AdminKhotbahPage() {
  return (
    <AdminCrudPage
      title="Khotbah"
      apiEndpoint="/api/sermons"
      columns={columns}
      fields={fields}
    />
  );
}
