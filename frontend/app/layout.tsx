import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { PostProvider } from "@/context/PostContext";
import { SocketProvider } from "@/context/SocketContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KrishiSocial - Connect, Learn & Grow Together",
  description: "The community platform for farmers, mandi prices, crop disease diagnosis & expert farming advice.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KrishiSocial",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#2E7D32",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}>
      <body className="antialiased bg-[#F8FBF8] min-h-full w-full overflow-x-clip font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
        <AuthProvider>
          <SocketProvider>
            <PostProvider>
              {children}
            </PostProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
