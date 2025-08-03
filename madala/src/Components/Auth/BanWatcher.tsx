"use client";

import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function BanWatcher() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const lastPath = useRef<string | null>(null);

    useEffect(() => {
        if (status === "loading") return;
        const isBanned = (session?.user as any)?.isActive === false;
        if (isBanned && pathname !== "/banned") {
            lastPath.current = pathname;
            router.replace("/banned");
        }
        if (!isBanned && pathname === "/banned") {
            // Quay lại trang trước đó nếu có, nếu không thì về homepage
            router.replace(lastPath.current && lastPath.current !== "/banned" ? lastPath.current : "/");
        }
    }, [session, status, pathname, router]);

    return null;
}
