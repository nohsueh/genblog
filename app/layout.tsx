import type { Metadata } from "next";
import "./globals.css";

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
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}`}
            crossOrigin="anonymous"
          ></script>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `console.log('GOOGLE_ADSENSE:', '${process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT}')`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
