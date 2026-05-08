import Hero from "@/components/home/Hero";
import { getSeoSettings } from "@/app/admin/(protected)/seo/actions";

export async function generateMetadata() {
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

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black w-full overflow-hidden">
      <Hero />
      <Problem />
      <Solutions />
      <UseCases />
      <Portfolio />
      <Testimonials />
      <HowItWorks />
      <TechStack />
      <About />
      <Consultation />
    </div>
  );
}
