import nextDynamic from 'next/dynamic';
import Hero from "@/components/home/Hero";
import { getSeoSettings } from "@/app/admin/(protected)/seo/actions";
import { getSiteSettings } from "@/app/admin/(protected)/settings/actions";
import { getContentSettings } from "@/app/admin/(protected)/content/actions";
import { getTestimonials } from "@/app/admin/(protected)/testimonials/actions";
import { defaultHeroContent, defaultAboutContent, defaultProblemContent } from "@/app/admin/(protected)/content/defaults";
import { sanitizeHref } from "@/lib/url";
import { serializeJsonLd } from "@/lib/seo/jsonLd";

export const revalidate = 60;

export async function generateMetadata() {
  try {
    const { data: settings } = await getSeoSettings();
    const homeSeo = settings?.find((s: { page_path?: string }) => s.page_path === '/');

    if (homeSeo) {
      return {
        title: homeSeo.title,
        description: homeSeo.description,
        keywords: homeSeo.keywords,
        alternates: { canonical: '/' },
        ...(homeSeo.og_image_url
          ? {
              openGraph: {
                title: homeSeo.title,
                description: homeSeo.description,
                images: [homeSeo.og_image_url],
              },
            }
          : {}),
      };
    }
  } catch (error) {
    console.error("Error generating metadata for home page:", error);
  }

  return {
    title: "AI Voice Automation Engineer | Abimbola Akinsanmi",
    description: "High-converting AI voice agents that automatically call leads, qualify prospects, and schedule appointments.",
    alternates: { canonical: '/' },
  };
}

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

export default async function Home() {
  const [settingsRes, contentRes, testimonialsRes] = await Promise.allSettled([
    getSiteSettings(),
    getContentSettings(),
    getTestimonials(),
  ]);

  const settings = settingsRes.status === 'fulfilled' ? settingsRes.value?.data : undefined;
  const contentSettings = contentRes.status === 'fulfilled'
    ? contentRes.value
    : { hero: defaultHeroContent, about: defaultAboutContent, problem: defaultProblemContent };
  const testimonials = testimonialsRes.status === 'fulfilled' ? testimonialsRes.value?.data || [] : [];

  let rawConsult = "https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021";
  if (settings?.consultation_provider === 'fiverr' && settings?.consultation_link_fiverr) {
    rawConsult = settings.consultation_link_fiverr;
  } else if (settings?.consultation_provider === 'calendly' && settings?.consultation_link_calendly) {
    rawConsult = settings.consultation_link_calendly;
  } else if (settings?.consultation_link_upwork) {
    rawConsult = settings.consultation_link_upwork;
  }
  const consultationLink = sanitizeHref(rawConsult, "/#consultation");

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://abimbola-ai-portfolio.vercel.app').replace(/\/+$/, '');
  const personName = contentSettings.about?.name || 'Abimbola Akinsanmi';
  const sameAsLinks = [
    settings?.social_links?.linkedin,
    settings?.social_links?.github,
    settings?.social_links?.twitter,
  ].filter((link): link is string => Boolean(link));

  const homeStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: personName,
        jobTitle: contentSettings.about?.title || 'AI Voice & Workflow Automation Engineer',
        url: siteUrl,
        ...(sameAsLinks.length > 0 ? { sameAs: sameAsLinks } : {}),
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${siteUrl}/#service`,
        name: `${personName} — AI Voice Automation`,
        description:
          contentSettings.hero?.subtext ||
          'High-converting AI voice agents that automatically call leads, qualify prospects, and schedule appointments.',
        serviceType: 'AI Voice Agents & Workflow Automation',
        url: siteUrl,
        provider: { '@id': `${siteUrl}/#person` },
      },
    ],
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black w-full overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(homeStructuredData) }}
      />
      <Hero consultationLink={consultationLink} content={contentSettings.hero} />
      <Problem content={contentSettings.problem} />
      <Solutions />
      <UseCases />
      <Portfolio />
      <Estimator />
      <RoiCalculator />
      <Testimonials initialTestimonials={testimonials} />
      <HowItWorks />
      <TechStack />
      <About
        profileImageUrl={settings?.profile_image_url}
        consultationLink={consultationLink}
        socialLinks={settings?.social_links}
        content={contentSettings.about}
      />
      <Consultation consultationLink={consultationLink} />
    </div>
  );
}
