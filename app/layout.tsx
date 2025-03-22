import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Searchlysis Blog Builder Demo",
  description: "Created with Searchlysis Blog Builder",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
