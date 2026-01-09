import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Hackathon Platform",
  description: "AI challenges hackathon competition platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
