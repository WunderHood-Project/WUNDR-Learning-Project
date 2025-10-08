
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Modal, ModalProvider } from "./context/modal";
import { AuthProvider } from "@/app/context/auth";
import ResetPasswordWrapper from "@/components/login/ResetPasswordWrapper";
import AuthGuard from "@/components/auth/AuthGuard";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "WonderHood", template: "%s — WonderHood" },
  description: "Community programs and events by WonderHood.",
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};


export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <AuthProvider>
          <ModalProvider>
            <AuthGuard />
            <Navbar />
              {children}
              <ResetPasswordWrapper />
            <Footer />
            <Modal />
          </ModalProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
