"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/Components/DropdownMenu";

import {
  Search,
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import {
  userMenuItems,
  guestMenuItems,
  navigationItems,
} from "@/constants/headerLinks";
import { getUserForHeader, UserHeaderData } from "@/lib/actions/user";
import { useCartStore } from "@/store/useCartStore";
import { ThemeToggle } from "@/Components/ui/ThemeToggle";
import MandalaPayButton from '@/Components/mandala-pay/shared/MandalaPayButton';

interface HeaderProps {
  initialUserData: UserHeaderData | null;
}

function HeaderComponent({
  initialUserData,
}: HeaderProps) {
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, status, update } = useSession();

  // State mới để lưu dữ liệu người dùng lấy từ DB
  const [userData, setUserData] = useState(initialUserData);

  // dữ liệu giỏ hàng
  const { totalItems } = useCartStore();

  useEffect(() => {
    setUserData(initialUserData);
  }, [initialUserData]);
  // useEffect này chỉ để xử lý khi người dùng logout trên client
  useEffect(() => {
    if (status === "authenticated") {
      getUserForHeader().then((data) => {
        if (data) {
          setUserData(data);
        }
      });
    } else {
      setUserData(null);
    }
  }, [status]); // Phụ thuộc duy nhất vào 'status'

  const currentMenuItems = useMemo(() => {
    return session?.user ? userMenuItems : guestMenuItems;
  }, [session?.user]);

  const getDisplayText = useCallback(() => {
    if (userData) {
      return userData.name || userData.email || "User";
    }
    return "Tài khoản";
  }, [userData]);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`);
    }
  }, [search, router]);

  useEffect(() => {
    setSearch("");
  }, [pathname]);

  useEffect(() => {
    const handleLoginSuccess = () => {
      update();
    };

    window.addEventListener("loginSuccess", handleLoginSuccess);

    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess);
    };
  }, [update]);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-700">
      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link className="flex items-center space-x-3" href="/">
            <div className="flex items-center">
              <span
                className="flex items-center justify-center w-12 h-12 rounded-full"
                style={{ background: "hsl(88 50% 53%)" }}
              >
                <span className="ml-2 text-3xl text-white font-[cursive] italic font-bold tracking-tight">
                  M
                </span>
              </span>
              <span className="ml-2 text-3xl text-black dark:text-white font-[cursive] italic font-bold tracking-tight">
                andala
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-8">
            <div className="relative flex">
              <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm, thương hiệu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-r-none border-r-0 focus:border-primary pr-4"
              />
              <Button
                type="submit"
                className="rounded-l-none px-6 bg-primary hover:bg-primary-hover"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Action Icons */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex flex-col items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none transition-colors h-auto p-2"
                >
                  <User className="h-7 w-7" />
                  <span className="text-sm mt-1 font-medium max-w-20 truncate">
                    {getDisplayText()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 bg-white dark:bg-gray-800"
              >
                {currentMenuItems.map((item, index) => (
                  <DropdownMenuItem
                    key={index}
                    asChild={!item.action}
                    className="rounded-lg px-4 py-2 text-base text-gray-700 dark:text-gray-300 hover:bg-primary/10 hover:text-primary transition-colors font-medium"
                  >
                    {item.action === "logout" ? (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left"
                      >
                        {item.text}
                      </button>
                    ) : item.href ? (
                      <Link href={item.href} className="w-full block">
                        {item.text}
                      </Link>
                    ) : null}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {session?.user && <MandalaPayButton userData={userData} />}

            <Link
              href="/cart"
              className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-primary relative"
            >
              <ShoppingCart className="h-6 w-6" />
              <span className="text-xs mt-1">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="bg-primary dark:bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center">
            <div className="flex items-center">
              <Button
                variant="ghost"
                className="text-primary-foreground hover:bg-primary-hover lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>

            <div className="hidden lg:flex items-center space-x-8 py-3">
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.href;
                const activeClass = isActive
                  ? "text-[#8BC34A]"
                  : "hover:text-accent";

                return item.hasDropdown ? (
                  <div key={index} className="relative group">
                    <Link
                      href={item.href}
                      className={`font-medium transition-colors flex items-center gap-1 ${activeClass}`}
                    >
                      {item.text}
                      <ChevronDown className="h-4 w-4" />
                    </Link>
                    {/* Dropdown menu có thể thêm sau */}
                  </div>
                ) : (
                  <Link
                    key={index}
                    href={item.href}
                    className={`font-medium transition-colors ${activeClass}`}
                  >
                    {item.text}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

const Header = React.memo(HeaderComponent);
export default Header;
