import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainNav } from '../components/nav/MainNav';
import { Toaster } from 'react-hot-toast';
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Content App",
  description: "Content management and processing application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        <div className="relative flex min-h-screen flex-col">
          <MainNav />
          <div className="flex-1">
            <div className="container py-6">
              {children}
            </div>
          </div>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
