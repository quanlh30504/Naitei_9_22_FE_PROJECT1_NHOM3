import AuthProvider from "@/components/Auth/AuthProvider";
import ToastProvider from "@/components/ToastProvider";
import { ConditionalLayout } from "@/components/ConditionalLayout";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/footer";
import AppProviders from "@/components/AppProviders";
import SiteHeader from "@/components/SiteHeader";

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
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <ToastProvider />
          {/* AppProviders sẽ lo việc fetch cart và cung cấp context */}
          <AppProviders>
            <ConditionalLayout
              header={<SiteHeader />} // SiteHeader sẽ tự fetch data của nó
              footer={<Footer />}
            >
              <main className="min-h-screen">{children}</main>
            </ConditionalLayout>
          </AppProviders>
        </AuthProvider>
      </body>
    </html>
  );
}
