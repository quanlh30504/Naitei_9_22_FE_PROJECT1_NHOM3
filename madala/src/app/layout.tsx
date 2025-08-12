import AuthProvider from "@/Components/Auth/AuthProvider";
import ToastProvider from "@/Components/ToastProvider";
import { ConditionalLayout } from "@/Components/ConditionalLayout";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/Components/footer";
import SiteHeader from "@/Components/SiteHeader";
import { getCart } from "@/lib/actions/cart";
import StoreInitializer from "@/Components/StoreInitializer";
import CartStateSyncer from "@/Components/CartStateSyncer";

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
  const cartResult = await getCart();
  const initialCart = cartResult.success ? cartResult.data : null;
  const plainInitialCart = initialCart
    ? JSON.parse(JSON.stringify(initialCart))
    : null;
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider />
          <CartStateSyncer serverCart={plainInitialCart} />
          <ConditionalLayout
            header={<SiteHeader />} // SiteHeader sẽ tự fetch data của nó
            footer={<Footer />}
          >
            <main className="min-h-screen">{children}</main>
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
