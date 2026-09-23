"use client";

import AdminCrudPage from "@/components/admin/AdminCrudPage";

const columns = [
  { key: "name", label: "Nama" },
  {
    key: "birthDate",
    label: "Tanggal Lahir",
    render: (value: unknown) =>
      new Date(value as string).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
      }),
  },
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
  { key: "name", label: "Nama Jemaat", type: "text" as const, required: true, placeholder: "Masukkan nama lengkap" },
  { key: "birthDate", label: "Tanggal Lahir", type: "date" as const, required: true },
  { key: "photo", label: "Foto Jemaat (opsional)", type: "image" as const, placeholder: "https://... atau unggah foto" },
  { key: "isActive", label: "Aktif", type: "checkbox" as const },
];

export default function AdminUlangTahunPage() {
  return (
    <AdminCrudPage
      title="Ulang Tahun Jemaat"
      apiEndpoint="/api/birthdays"
      columns={columns}
      fields={fields}
      searchable={false}
    />
  );
}
