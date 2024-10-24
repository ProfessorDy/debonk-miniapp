import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import Script from "next/script";

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
        <meta httpEquiv="Permissions-Policy" content="clipboard-read=*" />
      </head>
      <body className="antialiased">
        <Header />
        {children}
        <ToastContainer position="bottom-center" autoClose={2000} />
        <Navbar />
      </body>
    </html>
  );
}
