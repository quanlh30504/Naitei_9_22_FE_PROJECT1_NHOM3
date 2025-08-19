import AuthProvider from "@/Components/Auth/AuthProvider";
import BanWatcher from "@/Components/Auth/BanWatcher";
import ToastProvider from "@/Components/ToastProvider";
import { ConditionalLayout } from "@/Components/ConditionalLayout";
import CompareProvider from "@/contexts/CompareContext";
import { ThemeProvider } from "@/Components/providers/ThemeProvider";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/Components/header";
import Footer from "@/Components/footer";
import SiteHeader from "@/Components/SiteHeader";
import { getCart } from "@/lib/actions/cart";
import StoreInitializer from "@/Components/StoreInitializer";
import CartStateSyncer from "@/Components/CartStateSyncer";
import { CartProvider } from "@/app/cart/context/CartContext";

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
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          themes={["light", "dark"]}
          disableTransitionOnChange={true}
          storageKey="madala-theme"
          forcedTheme={undefined}
        >
          <AuthProvider>
            <BanWatcher />
            <ToastProvider />
            <CartProvider initialCart={JSON.parse(JSON.stringify(initialCart))}>
              <ConditionalLayout
                header={<SiteHeader />}
                footer={<Footer />}
              >
                <CompareProvider>
                  <main className="min-h-screen">{children}</main>
                </CompareProvider>
              </ConditionalLayout>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
