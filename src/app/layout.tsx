import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
  title: "AI Voice Automation Engineer | Abimbola Akinsanmi",
  description: "High-converting AI voice agents that automatically call leads, qualify prospects, and schedule appointments.",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
