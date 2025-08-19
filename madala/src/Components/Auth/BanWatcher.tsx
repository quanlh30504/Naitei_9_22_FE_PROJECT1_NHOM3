"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface SessionUser {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
    isActive?: boolean;
}

export default function BanWatcher() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    const user = session?.user as SessionUser | undefined;

    const searchParams = useSearchParams();
    useEffect(() => {
        if (status !== "authenticated") return;
        // Nếu có lỗi xác thực thì redirect về /login?error=...
        if ((user as any)?.error) {
            router.replace(`/login?error=${encodeURIComponent((user as any).error)}`);
            return;
        }
        const isBanned = user?.isActive === false;
        // Khi bị ban, lưu lại trang hiện tại vào localStorage rồi chuyển sang /banned
        if (isBanned && pathname !== "/banned") {
            if (pathname !== "/login" && pathname !== "/banned") {
                localStorage.setItem("lastPathBeforeBan", pathname);
            }
            router.replace("/banned");
        }
        // Khi được gỡ ban, lấy lại lastPath từ localStorage để redirect
        if (!isBanned && pathname === "/banned") {
            const lastPath = localStorage.getItem("lastPathBeforeBan");
            localStorage.removeItem("lastPathBeforeBan");
            router.replace(lastPath && lastPath !== "/banned" ? lastPath : "/");
        }
    }, [user, status, pathname, router, searchParams]);

    return null;
}
