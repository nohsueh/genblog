import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { i18n } from "@/lib/i18n-config";
import { GoogleAnalytics } from "@next/third-parties/google";
import { LoaderCircle } from "lucide-react";
import { Inter } from "next/font/google";
import Script from "next/script";
import type React from "react";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

// Define the type for the props explicitly
type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ language: string }>;
};

export default async function RootLayout(props: RootLayoutProps) {
  // Safely access properties with fallbacks
  const children = props?.children || null;
  const language = (await props?.params)?.language || i18n.defaultLocale;

  return (
    <html lang={language} suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense
            fallback={
              <div className="flex h-[50vh] w-screen flex-col items-center justify-center">
                <LoaderCircle className="size-10 animate-[spin_0.4s_linear_infinite]" />
              </div>
            }
          >
            {children}
          </Suspense>
          <Toaster richColors />
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT && (
          <Script id="google-adsense-init">
            {`(adsbygoogle = window.adsbygoogle || []).push({});`}
          </Script>
        )}
        {process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID && (
          <GoogleAnalytics
            gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID}
          />
        )}
      </body>
    </html>
  );
}
