import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Searchlysis Blog Builder Demo",
  description: "Created with Searchlysis Blog Builder",
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
