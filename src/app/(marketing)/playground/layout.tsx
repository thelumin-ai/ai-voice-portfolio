import { getSeoSettings } from "@/app/admin/(protected)/seo/actions";
import { getSiteSettings } from "@/app/admin/(protected)/settings/actions";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    const { data: settings } = await getSeoSettings();
    const seo = settings?.find((s: { page_path?: string }) => s.page_path === '/playground');

    if (seo) {
      return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        alternates: { canonical: '/playground' },
        ...(seo.og_image_url
          ? {
              openGraph: {
                title: seo.title,
                description: seo.description,
                images: [seo.og_image_url],
              },
            }
          : {}),
      };
    }
  } catch (error) {
    console.error("Error generating metadata for playground page:", error);
  }

  return {
    title: "AI Voice Playground | Abimbola Akinsanmi",
    description: "Experience ultra-low latency voice AI in real-time.",
    alternates: { canonical: '/playground' },
  };
}

export default async function PlaygroundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let settings: Awaited<ReturnType<typeof getSiteSettings>>['data'] | undefined;
  try {
    const res = await getSiteSettings();
    settings = res?.data;
  } catch (error) {
    console.error("Failed to fetch site settings for playground layout:", error);
  }

  let consultationLink =
    "https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021";
  if (settings?.consultation_provider === 'fiverr' && settings?.consultation_link_fiverr) {
    consultationLink = settings.consultation_link_fiverr;
  } else if (settings?.consultation_provider === 'calendly' && settings?.consultation_link_calendly) {
    consultationLink = settings.consultation_link_calendly;
  } else if (settings?.consultation_link_upwork) {
    consultationLink = settings.consultation_link_upwork;
  }

  return <div data-consultation-link={consultationLink}>{children}</div>;
}
