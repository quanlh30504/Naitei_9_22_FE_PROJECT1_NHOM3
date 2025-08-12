/**
 * AUTH.TS - NextAuth.js Authentication Configuration
 *
 * CHỨC NĂNG CHÍNH:
 * - Cấu hình NextAuth.js cho toàn bộ ứng dụng
 * - Xác thực người dùng qua email/password (Credentials Provider)
 * - Kết nối với MongoDB để lưu trữ sessions và accounts
 * - Quản lý JWT tokens và session callbacks
 * - Xử lý đăng nhập/đăng xuất users
 *
 * SỬ DỤNG:
 * - Import { auth } từ file này để check authentication trong API routes
 * - Tự động tạo các API endpoints: /api/auth/signin, /api/auth/signout, etc.
 * - Providers: useSession(), signIn(), signOut() trong React components
 *
 * CẤU HÌNH:
 * - MongoDB Adapter để lưu session data
 * - JWT strategy với custom callbacks
 * - Session callbacks để thêm user roles vào session object
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PROVIDER_IDS } from "@/constants/auth";

export const authConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    // --- Provider 2: GitHub ---
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          await connectToDB();
          const user = await User.findOne({ email: credentials.email }).lean();
          if (!user || !(user as any).password) {
            return null;
          }

          // Kiểm tra password
          const isValid = await bcrypt.compare(
            credentials.password,
            (user as any).password
          );
          if (!isValid) {
            return null;
          }

          // Kiểm tra user có bị ban không (double check)
          if ((user as any).isActive === false) {
            return null;
          }

          return {
            id: (user as any)._id.toString(),
            email: (user as any).email,
            name: (user as any).name,
            role: (user as any).role || "user",
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user && account) {
        await connectToDB();

        // 2. PHÂN LOẠI LOGIC
        if (account.provider === PROVIDER_IDS.CREDENTIALS) {
          // --- LUỒNG CREDENTIALS ---
          token.id = user.id;
          token.role = (user as any).role;
        } else {
          // --- LUỒNG OAUTH (ÁP DỤNG CHO TẤT CẢ CÁC NHÀ CUNG CẤP CÒN LẠI) ---
          const existingUser = await User.findOne({ email: user.email });
          if (existingUser) {
            token.id = existingUser._id.toString();
            token.role = existingUser.role || "user";
          }
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
