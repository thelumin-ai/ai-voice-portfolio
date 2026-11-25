import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { serializeJsonLd } from "@/lib/seo/jsonLd";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://abimbola-ai-portfolio.vercel.app'),
  title: "AI Voice Automation Engineer | Abimbola Akinsanmi",
  description: "High-converting AI voice agents that automatically call leads, qualify prospects, and schedule appointments.",
  verification: {
    google: "ua1-FfmwrIXAlxh92HTeJ4tqadx-m-dGx5Nki3eqdVw",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://abimbola-ai-portfolio.vercel.app',
    siteName: 'Abimbola Akinsanmi - AI Voice Automation Portfolio',
    title: 'AI Voice Automation Engineer | Abimbola Akinsanmi',
    description: 'High-converting AI voice agents that automatically call leads, qualify prospects, and schedule appointments.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Voice Automation Engineer - Abimbola Akinsanmi',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Voice Automation Engineer | Abimbola Akinsanmi',
    description: 'High-converting AI voice agents that automatically call leads, qualify prospects, and schedule appointments.',
    images: ['/og-image.png'],
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://abimbola-ai-portfolio.vercel.app').replace(/\/+$/, '');
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    "url": siteUrl,
    "name": "AI Voice Automation Engineer | Abimbola Akinsanmi",
    "description": "High-converting AI voice agents that automatically call leads, qualify prospects, and schedule appointments.",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 overflow-x-clip`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
