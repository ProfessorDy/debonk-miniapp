import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import Script from "next/script";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Debonk miniapp",
  description: "Debonk Miniapp using Next.js 14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className={`${openSans.variable} antialiased`}>
        <Header />
        {children}
        <Navbar />
      </body>
    </html>
  );
}
