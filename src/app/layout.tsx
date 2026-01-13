import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "./components/Navbar";

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
        <Navbar />
        {children}
      </body>
    </html>
  );
}
