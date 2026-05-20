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
import nextDynamic from 'next/dynamic';

const Problem = nextDynamic(() => import("@/components/home/Problem"));
const Solutions = nextDynamic(() => import("@/components/home/Solutions"));
const UseCases = nextDynamic(() => import("@/components/home/UseCases"));
const Portfolio = nextDynamic(() => import("@/components/home/Portfolio"));
const HowItWorks = nextDynamic(() => import("@/components/home/HowItWorks"));
const TechStack = nextDynamic(() => import("@/components/home/TechStack"));
const Testimonials = nextDynamic(() => import("@/components/home/Testimonials"));
const About = nextDynamic(() => import("@/components/home/About"));
const Consultation = nextDynamic(() => import("@/components/home/Consultation"));
const Estimator = nextDynamic(() => import("@/components/home/Estimator"));
const RoiCalculator = nextDynamic(() => import("@/components/home/RoiCalculator"));

import { getSiteSettings } from "./admin/(protected)/settings/actions";
import { getContentSettings } from "./admin/(protected)/content/actions";
import { getTestimonials } from "./admin/(protected)/testimonials/actions";

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

  // Fetch content settings for Hero, About, Problem
  const contentSettings = await getContentSettings();
  const { data: testimonials } = await getTestimonials();

  return (
    <div className="flex flex-col min-h-screen bg-black w-full overflow-hidden">
      <Hero consultationLink={consultationLink} content={contentSettings.hero} />
      <Problem content={contentSettings.problem} />
      <Solutions />
      <UseCases />
      <Portfolio />
      <Estimator />
      <RoiCalculator />
      <Testimonials initialTestimonials={testimonials || []} />
      <HowItWorks />
      <TechStack />
      <About profileImageUrl={settings?.profile_image_url} consultationLink={consultationLink} socialLinks={settings?.social_links} content={contentSettings.about} />
      <Consultation consultationLink={consultationLink} />
    </div>
  );
}
