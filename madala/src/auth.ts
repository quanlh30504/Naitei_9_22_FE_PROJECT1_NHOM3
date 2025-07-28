import NextAuth from "next-auth";
import type { AuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import connectToDB from "@/lib/db";

export const authConfig = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }
          await connectToDB();
          const user = await User.findOne({ email: credentials.email }).lean();
          if (!user || !user.password) {
            return null;
          }
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            return null;
          }

          return user;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
         if ((user as any)._id) {
          token.id = (user as any)._id.toString();
        } else {
          token.id = user.id;
        }
        token.role = user.role;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        // lấy thông tin từ token và gán vào session.user
        session.user.id = token.id as string;
        session.user.role = token.role as "user" | "admin";
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: '/login', // quay lại đăng nhập nếu có lỗi
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
} satisfies AuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
