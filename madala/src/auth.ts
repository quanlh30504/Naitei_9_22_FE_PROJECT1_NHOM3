/**
 * AUTH.TS - NextAuth.js Authentication Configuration
<<<<<<< HEAD
 *
=======
 * 
>>>>>>> 7e6b1d5 ([Task] Rebase tk-28,29,53,57,59 : Feature dashboard for admin)
 * CHỨC NĂNG CHÍNH:
 * - Cấu hình NextAuth.js cho toàn bộ ứng dụng
 * - Xác thực người dùng qua email/password (Credentials Provider)
 * - Kết nối với MongoDB để lưu trữ sessions và accounts
 * - Quản lý JWT tokens và session callbacks
 * - Xử lý đăng nhập/đăng xuất users
<<<<<<< HEAD
 *
=======
 * 
>>>>>>> 7e6b1d5 ([Task] Rebase tk-28,29,53,57,59 : Feature dashboard for admin)
 * SỬ DỤNG:
 * - Import { auth } từ file này để check authentication trong API routes
 * - Tự động tạo các API endpoints: /api/auth/signin, /api/auth/signout, etc.
 * - Providers: useSession(), signIn(), signOut() trong React components
<<<<<<< HEAD
 *
=======
 * 
>>>>>>> 7e6b1d5 ([Task] Rebase tk-28,29,53,57,59 : Feature dashboard for admin)
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
import bcrypt from "bcrypt";
import connectToDB from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PROVIDER_IDS } from "@/constants/auth";
import type { User as NextAuthUser, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

interface DBUser {
  _id: string;
  email: string;
  name?: string;
  password?: string;
  role?: "user" | "admin" | undefined;
  isActive?: boolean;
}

interface User extends NextAuthUser {
  id: string;
  email: string;
  name?: string;
  role?: "user" | "admin";
  isActive?: boolean;
}

interface AuthToken extends JWT {
  id: string;
  email?: string;
  name?: string;
  role?: "user" | "admin";
  isActive?: boolean;
  lastCheckedAt?: number;
}

export const authConfig = {
  providers: [
    // Google Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // GitHub Provider
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Partial<Record<"email" | "password", unknown>>
      ): Promise<User & { error?: string } | null> {
        try {
          const email = typeof credentials?.email === 'string' ? credentials.email.toLowerCase().trim() : undefined;
          const password = credentials?.password as string | undefined;
          if (!email || !password) {
            return { id: "", email: email || "", error: "missing_credentials" } as any;
          }
          await connectToDB();
          const user = await User.findOne({ email }).lean<DBUser>();
          if (!user) {
            return { id: "", email, error: "user_not_found" } as any;
          }
          if (!user.password) {
            return { id: user._id.toString(), email: user.email, error: "no_password" } as any;
          }
          // Kiểm tra password
          const isValid = await bcrypt.compare(password, user.password);
          if (!isValid) {
            return { id: user._id.toString(), email: user.email, error: "invalid_password" } as any;
          }
          // Kiểm tra user có bị ban không (double check)
          if (user.isActive === false) {
            return { id: user._id.toString(), email: user.email, error: "banned" } as any;
          }
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role === "admin" ? "admin" : "user",
            isActive: user.isActive,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return { id: "", email: "", error: "server_error" } as any;
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
  async jwt(params: any) {
    const { token, user, account } = params;
    // Lần đầu sau login
    if (user && account) {
      token.id = (user as any).id;
      token.email = typeof user.email === 'string' && user.email !== null ? user.email : undefined;
      token.role = (user as any).role ?? 'user';
      token.isActive = (user as any).isActive ?? true;
      token.provider = account.provider;
      token.lastCheckedAt = Date.now();
      return token;
    }

    // Tuỳ chọn: refresh isActive tối đa mỗi 10 phút
    const TEN_MIN = 10 * 60 * 1000;
    if (!token.lastCheckedAt || Date.now() - (token.lastCheckedAt as number) > TEN_MIN) {
      await connectToDB();
      const email = typeof token.email === 'string' ? token.email : undefined;
      if (email) {
        const u = await User.findOne({ email }).select('isActive').lean();
        // Nếu u là mảng (trường hợp bất thường), lấy phần tử đầu tiên
        const userObj = Array.isArray(u) ? u[0] : u;
        if (userObj && typeof userObj.isActive !== 'undefined') {
          token.isActive = userObj.isActive !== false;
        }
      }
      token.lastCheckedAt = Date.now();
    }
    return token;
  },
  async session(params: any) {
    const { session, token } = params;
    if (session.user) {
      (session.user as any).id = token.id as string;
      (session.user as any).role = (token.role as string) ?? 'user';
      (session.user as any).isActive = (token.isActive as boolean) ?? true;
    }
    return session;
  },
  },
  pages: {
    signIn: "/login",
<<<<<<< HEAD
    error: "/login",
=======
    error: '/login',
>>>>>>> 7e6b1d5 ([Task] Rebase tk-28,29,53,57,59 : Feature dashboard for admin)
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
