import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

const title = process.env.NEXT_PUBLIC_APP_NAME;
const description =
  "Welcome to our Blog - Discover the latest insights and articles on various topics.";
const images = "https://searchlysis.com/logo.svg";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    images,
  },
  twitter: {
    title,
    description,
    images,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT && (
          <Script
            id="adsense-script"
            strategy="afterInteractive"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}`}
            crossOrigin="anonymous"
          ></Script>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
