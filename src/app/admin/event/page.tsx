"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";

const columns = [
  { key: "title", label: "Judul Event" },
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
  { key: "location", label: "Lokasi" },
  {
    key: "isActive",
    label: "Status",
    render: (value: unknown) => (
      <span className={`badge ${value ? "badge-success" : "badge-error"}`}>
        {value ? "Aktif" : "Nonaktif"}
      </span>
    ),
  },
];

const fields = [
  { key: "title", label: "Judul Event", type: "text" as const, required: true, placeholder: "Masukkan judul event" },
  { key: "description", label: "Deskripsi", type: "textarea" as const, required: true, placeholder: "Deskripsi event" },
  { key: "date", label: "Tanggal Mulai", type: "date" as const, required: true },
  { key: "endDate", label: "Tanggal Selesai (opsional)", type: "date" as const },
  { key: "location", label: "Lokasi", type: "text" as const, placeholder: "Lokasi event" },
  { key: "image", label: "Gambar Event (opsional)", type: "image" as const, placeholder: "https://... atau unggah gambar" },
  { key: "isActive", label: "Aktif", type: "checkbox" as const },
];

export default function AdminEventPage() {
  return (
    <AdminCrudPage
      title="Event"
      apiEndpoint="/api/events"
      columns={columns}
      fields={fields}
    />
  );
}
