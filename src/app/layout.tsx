import type { Metadata } from "next";
import { Geist, Geist_Mono, PT_Sans_Narrow } from "next/font/google";
import "./globals.css";
import MainLayout from "@/ui/Layout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const ptSansNarrow = PT_Sans_Narrow({
  variable: "--font-pt-sans-narrow",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shophaul",
  description: "Your go-to shopping destination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ptSansNarrow.variable} ${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-pt-sans-narrow)]`}
      >
        <main>
          <MainLayout>{children}</MainLayout>
        </main>
      </body>
    </html>
  );
}
