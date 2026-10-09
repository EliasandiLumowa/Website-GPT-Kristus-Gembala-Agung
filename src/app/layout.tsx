import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import AuthProvider from "@/components/providers/AuthProvider";

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
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
