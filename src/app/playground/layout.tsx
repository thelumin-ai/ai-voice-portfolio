import { getSeoSettings } from "@/app/admin/(protected)/seo/actions";

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  try {
    const { data: settings } = await getSeoSettings();
    const seo = settings?.find((s: any) => s.page_path === '/playground');
    
    if (seo) {
      return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
          title: seo.title,
          description: seo.description,
          images: seo.og_image_url ? [seo.og_image_url] : [],
        }
      };
    }
  } catch (error) {
    console.error("Error generating metadata for playground page:", error);
  }
  
  return {
    title: "AI Voice Playground | Abimbola Akinsanmi",
    description: "Experience ultra-low latency voice AI in real-time.",
  };
}

export default function PlaygroundLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return <>{children}</>;
  }
