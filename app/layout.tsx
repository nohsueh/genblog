import GoogleAdsense from "@/components/google-adsense";
import { getDefaultFavicon } from "@/lib/utils";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: [
      {
        url: process.env.NEXT_PUBLIC_ICON || getDefaultFavicon(),
      },
    ],
    apple: [
      {
        url: process.env.NEXT_PUBLIC_ICON || getDefaultFavicon(),
      },
    ],
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
      </head>
      {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID && (
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID}
        />
      )}
      {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT && (
        <GoogleAdsense
          clientId={process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}
        />
      )}
      {children}
    </html>
  );
}
