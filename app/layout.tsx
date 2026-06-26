import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Event Platform — Beautiful sites for life's big moments",
  description:
    "Wedding, birthday, engagement and corporate event websites — pick a template, send your details, go live.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans bg-white text-neutral-900">{children}</body>
    </html>
  );
}
