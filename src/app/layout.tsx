import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./client-layout";

export const metadata: Metadata = {
  title: "TradeBook — Africa's Wholesale Social Commerce Platform",
  description: "Connect directly with manufacturers. Transparent wholesale pricing. No middlemen. Follow manufacturers, compare prices, join group buys, and order at wholesale prices.",
  keywords: "wholesale, B2B, manufacturers, Rwanda, Africa, transparent pricing, group buying, social commerce",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
