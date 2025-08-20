"use client";

import { Bell, History, QrCode } from "lucide-react";
import MandalaPayLogo from "./MandalaPayLogo";
import Link from "next/link";
import { useNotificationStore } from "@/store/useNotificationStore";
import NotificationItem from "@/Components/shared/NotificationItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/Components/DropdownMenu";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";

const HeaderActionIcon = ({ href, icon: Icon }: { href: string; icon: React.ElementType }) => (
    <Button variant="ghost" size="icon" asChild>
        <Link href={href}>
            <Icon className="w-5 h-5" />
        </Link>
    </Button>
);

const NotificationBell = () => {
    const { notifications, unreadCount, markAllAsRead, markOneAsRead } = useNotificationStore();

    return (
        <DropdownMenu onOpenChange={(open) => {
            if (!open && unreadCount > 0) {
                markAllAsRead();
            }
        }}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell
                        key={unreadCount}
                        className={cn("h-5 w-5", unreadCount > 0 && "animate-tada")}
                    />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 md:w-96 p-0">
                <div className="p-2 font-semibold border-b">Thông báo</div>
                <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map((notif) => (
                            <NotificationItem 
                                key={notif._id} 
                                notif={notif}
                                onClick={markOneAsRead} 
                            />
                        ))
                    ) : (
                        <p className="text-sm text-center text-muted-foreground p-4">
                            Bạn không có thông báo nào.
                        </p>
                    )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/mandala-pay/notifications" className="w-full justify-center text-sm text-primary cursor-pointer">
                        Xem tất cả thông báo
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


const Header = () => {
    return (
        <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm border-b">
            <div className="w-full max-w-md mx-auto flex items-center justify-between h-16 px-4">
                <MandalaPayLogo />
                <div className="flex items-center space-x-2">
                    <HeaderActionIcon href="/mandala-pay/history" icon={History} />
                    <HeaderActionIcon href="/mandala-pay/scan-qr" icon={QrCode} />
                    <NotificationBell />
                </div>
            </div>
        </header>
    );
};

export default Header;
