import Script from "next/script";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          id="adsense-script"
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}`}
          crossOrigin="anonymous"
        ></Script>
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
