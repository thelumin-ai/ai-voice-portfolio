import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChatbot from "@/components/FloatingChatbot";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getSiteSettings } from "./admin/(protected)/settings/actions";

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
  alternates: {
    canonical: '/',
  },
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
  const { data: settings } = await getSiteSettings();
  
  let consultationLink = "https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021";
  if (settings?.consultation_provider === 'fiverr' && settings?.consultation_link_fiverr) {
      consultationLink = settings.consultation_link_fiverr;
  } else if (settings?.consultation_provider === 'calendly' && settings?.consultation_link_calendly) {
      consultationLink = settings.consultation_link_calendly;
  } else if (settings?.consultation_link_upwork) {
      consultationLink = settings.consultation_link_upwork;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://abimbola-ai-portfolio.vercel.app/#person",
        "name": "Abimbola Akinsanmi",
        "jobTitle": "AI Voice Automation Engineer",
        "url": "https://abimbola-ai-portfolio.vercel.app",
        "sameAs": [
          "https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021",
          "https://github.com/thelumin-ai"
        ],
        "knowsAbout": ["AI Voice Agents", "WebRTC Voice Automations", "Next.js Development", "Supabase Backend Architecture", "Vapi.ai", "Retell AI Real-Time Voice Agents"]
      },
      {
        "@type": "WebSite",
        "@id": "https://abimbola-ai-portfolio.vercel.app/#website",
        "url": "https://abimbola-ai-portfolio.vercel.app",
        "name": "AI Voice Automation Engineer | Abimbola Akinsanmi",
        "publisher": {
          "@id": "https://abimbola-ai-portfolio.vercel.app/#person"
        }
      },
      {
        "@type": "ProfessionalService",
        "@id": "https://abimbola-ai-portfolio.vercel.app/#service",
        "name": "Abimbola AI Voice Automation & SaaS Systems",
        "url": "https://abimbola-ai-portfolio.vercel.app",
        "image": "https://abimbola-ai-portfolio.vercel.app/og-image.png",
        "description": "High-converting AI voice agents that automatically call leads, qualify prospects, and schedule appointments.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Lagos",
          "addressCountry": "NG"
        },
        "priceRange": "$$"
      }
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased min-h-screen flex flex-col bg-white dark:bg-black text-black dark:text-white transition-colors duration-300`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar consultationLink={consultationLink} />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <FloatingChatbot />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
