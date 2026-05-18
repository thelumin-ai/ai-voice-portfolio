import Hero from "@/components/home/Hero";
import { getSeoSettings } from "@/app/admin/(protected)/seo/actions";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    const { data: settings } = await getSeoSettings();
    const homeSeo = settings?.find((s: any) => s.page_path === '/');
    
    if (homeSeo) {
      return {
        title: homeSeo.title,
        description: homeSeo.description,
        keywords: homeSeo.keywords,
        openGraph: {
          title: homeSeo.title,
          description: homeSeo.description,
          images: homeSeo.og_image_url ? [homeSeo.og_image_url] : [],
        }
      };
    }
  } catch (error) {
    console.error("Error generating metadata for home page:", error);
  }
  
  return {
    title: "AI Voice Automation Engineer | Abimbola Akinsanmi",
    description: "High-converting AI voice agents that automatically call leads, qualify prospects, and schedule appointments.",
  };
}
import Problem from "@/components/home/Problem";
import Solutions from "@/components/home/Solutions";
import UseCases from "@/components/home/UseCases";
import Portfolio from "@/components/home/Portfolio";
import HowItWorks from "@/components/home/HowItWorks";
import TechStack from "@/components/home/TechStack";
import Testimonials from "@/components/home/Testimonials";
import About from "@/components/home/About";
import Consultation from "@/components/home/Consultation";
import Estimator from "@/components/home/Estimator";
import RoiCalculator from "@/components/home/RoiCalculator";

import { getSiteSettings } from "./admin/(protected)/settings/actions";

export default async function Home() {
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
    <div className="flex flex-col min-h-screen bg-black w-full overflow-hidden">
      <Hero />
      <Problem />
      <Solutions />
      <UseCases />
      <Portfolio />
      <Estimator />
      <RoiCalculator />
      <Testimonials />
      <HowItWorks />
      <TechStack />
      <About profileImageUrl={settings?.profile_image_url} />
      <Consultation consultationLink={consultationLink} />
    </div>
  );
}
