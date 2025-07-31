import { SessionProvider } from "next-auth/react";
import AuthProvider from "@/Components/Auth/AuthProvider";
import ToastProvider from "@/Components/ToastProvider";
import { ConditionalLayout } from "@/Components/ConditionalLayout";
import CompareProvider from "@/contexts/CompareContext";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getUserForHeader } from "@/lib/actions/user";
import Header from "@/Components/header";
import Footer from "@/Components/footer";

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

  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider />
          <ConditionalLayout
            header={<Header initialUserData={userData} />}
            footer={<Footer />}
          >
            <CompareProvider>
              <main className="min-h-screen">{children}</main>
            </CompareProvider>
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
