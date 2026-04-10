
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import { Modal, ModalProvider } from "../context/modal";
import { AuthProvider } from "@/context/auth";
import AuthGuard from "@/components/auth/AuthGuard";
import DonateFloating from "@/components/donate/DonateFloating";
import CookieConsentBanner from "@/components/cookieConsent/CookieConsentBanner";
import Script from "next/script";

// const gtmId: string | undefined = process.env.GOOGLE_TAG_MANAGER_ID

const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

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


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <head>
        {(gaId || adsId) ? (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId || adsId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                ${gaId ? `gtag('config', '${gaId}');` : ""}
                ${adsId ? `gtag('config', '${adsId}');` : ""}

                gtag('consent', 'default', {
                analytics_storage: 'denied',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              `}
            </Script>

            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />

          </>
        ) : null}
      </head>

      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased flex flex-col min-h-screen`}>
          <AuthProvider>
            <ModalProvider>
              <AuthGuard />
              <Navbar />
              <DonateFloating />
              <main className="flex-grow flex flex-col">
                {children}
              </main>
              <Footer />
              <Modal />
              <CookieConsentBanner />
            </ModalProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
