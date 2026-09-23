import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export const metadata: Metadata = {
  title: {
    default: "GPT Kristus Gembala Agung - Sistem Informasi Gereja",
    template: "%s | GPT Kristus Gembala Agung",
  },
  description:
    "Website resmi GPT Kristus Gembala Agung. Jadwal ibadah, khotbah, lagu pujian, berita, dan informasi jemaat.",
  keywords: ["gereja", "kristen", "ibadah", "khotbah", "rohani"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
