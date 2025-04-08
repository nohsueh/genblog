import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_TITLE,
  description:
    "Welcome to our Blog - Discover the latest insights and articles on various topics.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
