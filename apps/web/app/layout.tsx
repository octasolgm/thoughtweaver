import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import { AppProviders } from "../lib/contexts";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Thoughtweaver",
  description: "AI-Powered Ideation Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
