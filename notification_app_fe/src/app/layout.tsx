import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Campus Notifications System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
          {children}
        </main>
      </body>
    </html>
  );
}
