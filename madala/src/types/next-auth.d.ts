/**
 * NEXT-AUTH.D.TS - TypeScript Module Augmentation cho NextAuth.js
 * 
 * CHỨC NĂNG CHÍNH:
 * - Mở rộng NextAuth.js default types để thêm custom fields
 * - Thêm 'role' field vào Session và User objects
 * - Thêm 'id' field vào Session.user
 * - Type safety cho session.user.role trong toàn bộ app
 * 
 * MODULE AUGMENTATION:
 * - Extend NextAuth Session interface
 * - Extend NextAuth User interface  
 * - Extend NextAuth JWT interface
 * 
 * IMPACT:
 * - session.user.role có type "user" | "admin"
 * - session.user.id available với proper typing
 * - TypeScript sẽ enforce correct usage
 * 
 * USAGE: Tự động áp dụng khi import NextAuth types
 */

// Thêm type cho lodash.debounce nếu chưa có types chính thức
declare module 'lodash.debounce';

import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: "user" | "admin";
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: "user" | "admin";
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: "user" | "admin";
    }
}

