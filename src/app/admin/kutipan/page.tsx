"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";

const columns = [
  {
    key: "content",
    label: "Kutipan",
    render: (value: unknown) => {
      const text = value as string;
      return text.length > 80 ? text.slice(0, 80) + "..." : text;
    },
  },
  { key: "author", label: "Pengarang" },
  { key: "reference", label: "Referensi Ayat" },
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
  { key: "content", label: "Kutipan", type: "textarea" as const, required: true, placeholder: "Masukkan kutipan rohani" },
  { key: "author", label: "Pengarang (opsional)", type: "text" as const, placeholder: "Nama pengarang" },
  { key: "reference", label: "Referensi Ayat (opsional)", type: "text" as const, placeholder: "Contoh: Mazmur 23:1" },
  { key: "isActive", label: "Aktif", type: "checkbox" as const },
];

export default function AdminKutipanPage() {
  return (
    <AdminCrudPage
      title="Kutipan Rohani"
      apiEndpoint="/api/quotes"
      columns={columns}
      fields={fields}
      searchable={false}
    />
  );
}
