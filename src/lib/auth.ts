import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" }, // Menggunakan username
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan password wajib diisi");
        }

        // 1. Cek apakah yang login adalah Admin
        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username }
        });

        if (admin) {
          const isValid = await bcrypt.compare(credentials.password, admin.password);
          if (!isValid) throw new Error("Password salah");
          
          return {
            id: admin.id,
            name: admin.name,
            username: admin.username,
            role: "ADMIN",
            isActive: true, // Admin selalu aktif
          };
        }

        // 2. Jika bukan Admin, cek apakah yang login adalah User (Jemaat)
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user) {
          throw new Error("Username tidak ditemukan");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Password salah");

        // Cek apakah akun jemaat sudah di-approve oleh admin
        if (!user.isActive) {
          throw new Error("Akun Anda belum disetujui oleh Admin.");
        }

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: "USER",
          isActive: user.isActive,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.isActive = (user as any).isActive;
        token.username = (user as any).username;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).isActive = token.isActive;
        (session.user as any).username = token.username;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },
  secret: process.env.NEXTAUTH_SECRET,
};