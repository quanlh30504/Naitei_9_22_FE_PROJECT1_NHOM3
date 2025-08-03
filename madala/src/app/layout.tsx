import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/Components/Auth/AuthProvider";
import ToastProvider from "@/Components/ToastProvider";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/Components/header";
import Footer from "@/Components/footer";
import { getUserForHeader } from "@/lib/actions/user";
import { getCart } from "@/lib/actions/cart";
import { CartProvider } from "@/app/cart/context/CartContext";
import { CompareProvider } from "@/contexts/CompareContext";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Madala - Cửa hàng thời trang và phụ kiện",
  description:
    "Madala - Điểm đến hoàn hảo cho thời trang và phụ kiện chất lượng cao",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await getUserForHeader();

  // lấy dữ liệu giỏ hàng của người dùng
  const cartResult = await getCart();
  const initialCart = cartResult.success ? cartResult.data : null;

  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider initialCart={initialCart}>
            <CompareProvider>
              <ToastProvider />
              <Header initialUserData={userData} />
              <main className="min-h-screen">
                {children}
              </main>
              <Footer />
            </CompareProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
