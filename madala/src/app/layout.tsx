import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/Components/Auth/AuthProvider";
import ToastProvider from "@/app/products/components/ToastProvider";
import CompareProvider from "@/contexts/CompareContext";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/Components/header";
import Footer from "@/Components/footer";
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
  description: "Madala - Điểm đến hoàn hảo cho thời trang và phụ kiện chất lượng cao",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <CompareProvider>
            <ToastProvider />
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
          </CompareProvider >
        </AuthProvider>
      </body>
    </html>
  );
}
