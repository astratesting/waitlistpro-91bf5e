import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "WaitlistPro — Launch Smarter, Grow Faster",
  description:
    "Build viral waitlists, manage signups at scale, and convert early adopters into customers. Trusted by 10,000+ product teams.",
  keywords: ["waitlist", "product launch", "email marketing", "analytics", "growth"],
  openGraph: {
    title: "WaitlistPro — Launch Smarter, Grow Faster",
    description:
      "Build viral waitlists, manage signups at scale, and convert early adopters into customers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
        <body className={`${inter.className} antialiased bg-background text-foreground`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
