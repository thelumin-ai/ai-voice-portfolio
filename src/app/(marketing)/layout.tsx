import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import dynamic from 'next/dynamic';
import { getSiteSettings } from "../admin/(protected)/settings/actions";

const FloatingChatbot = dynamic(() => import("@/components/FloatingChatbot"));

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
  let settings: any = null;
  try {
    const res = await getSiteSettings();
    settings = res?.data;
  } catch (error) {
    console.error("Failed to load site settings for marketing layout:", error);
  }

  let consultationLink = "https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021";
  if (settings?.consultation_provider === 'fiverr' && settings?.consultation_link_fiverr) {
    consultationLink = settings.consultation_link_fiverr;
  } else if (settings?.consultation_provider === 'calendly' && settings?.consultation_link_calendly) {
    consultationLink = settings.consultation_link_calendly;
  } else if (settings?.consultation_link_upwork) {
    consultationLink = settings.consultation_link_upwork;
  }

  return (
    <>
      <Navbar consultationLink={consultationLink} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <FloatingChatbot />
    </>
  );
}
