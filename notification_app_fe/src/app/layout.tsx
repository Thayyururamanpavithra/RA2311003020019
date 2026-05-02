import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { AppLayout } from "@/components/common/AppLayout";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: "Campus Notifications",
  description: "Advanced Campus Notifications Microservice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className={outfit.className}>
        <ThemeContextProvider>
          <NotificationProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </NotificationProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
