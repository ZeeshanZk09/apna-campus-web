import type { Metadata, Viewport } from "next";
import Layout from "@/components/layout/layout";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Apna Campus - Learning Management System",
    template: "%s | Apna Campus",
  },
  description:
    "The official Learning Management System for Apna Campus Institute. Modular, Secure and Professional LMS.",
  keywords: [
    "LMS",
    "Learning Management System",
    "Apna Campus",
    "Education",
    "Institute",
  ],
  authors: [{ name: "Apna Campus Team" }],
  creator: "Apna Campus",
  publisher: "Apna Campus",
  metadataBase: new URL("https://apna-campus.netlify.app"), // Replace with actual domain
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apna-campus.netlify.app", // Replace with actual domain
    siteName: "Apna Campus",
    title: "Apna Campus - Portfolio App",
    description:
      "Explore our portfolio of educational projects and campus initiatives.",
    images: [
      {
        url: "/logo/apna-campus-logo.png", // Replace with actual Open Graph image
        width: 1200,
        height: 630,
        alt: "Apna Campus Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apna Campus - Portfolio App",
    description:
      "Explore our portfolio of educational projects and campus initiatives.",
    images: ["/logo/apna-campus-logo.png"], // Replace with actual Twitter image
    creator: "@apna-campus", // Replace with actual Twitter username
  },
  icons: {
    icon: [
      { url: "/logo/apna-campus-logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo/apna-campus-logo.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/logo/apna-campus-logo.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/logo/apna-campus-logo.png",
        color: "#5bbad5",
      },
    ],
  },
  manifest: "/site.webmanifest", // Consider adding a webmanifest file
  verification: {
    google: "n3zhHWv55V2TBqwJtUEVc9-YMIGteykJyrSfCzQ57ck", // Add Google Search Console verification
  },
  category: "education",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#010101" },
    { media: "(prefers-color-scheme: dark)", color: "#ededed" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark scroll-smooth">
      <Layout>{children}</Layout>
    </html>
  );
}
