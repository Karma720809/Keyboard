import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aura Pro",
  description: "Experience the ultimate typing feel with our premium, high-customizability mechanical keyboard. Built for professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
