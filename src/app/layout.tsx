import type { Metadata } from "next";
import { Providers } from "@/providers/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { VillageStructuredData } from "@/components/seo/VillageStructuredData";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lodhaura Village Portal | Gram Panchayat Digital Hub",
    template: "%s | Lodhaura Village Portal",
  },
  description:
    "Official digital portal for Lodhaura village, Atraulit, Sandila, Hardoi, Uttar Pradesh (241204). Panchayat services, gallery, events, schemes & community updates.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Lodhaura",
  },
  keywords: [
    "Lodhaura",
    "Atraulit",
    "Sandila",
    "Hardoi",
    "village portal",
    "gram panchayat",
    "Uttar Pradesh",
    "241204",
    "rural India",
  ],
  authors: [{ name: "Lodhaura Gram Panchayat" }],
  openGraph: {
    title: "Lodhaura Village Portal",
    description:
      "Connect with Lodhaura — directory, events, services & community updates.",
    locale: "en_IN",
    type: "website",
    siteName: "Lodhaura Village Portal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lodhaura Village Portal",
    description: "Your community hub for Lodhaura village.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icons/icon-192.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <head>
        <VillageStructuredData />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
