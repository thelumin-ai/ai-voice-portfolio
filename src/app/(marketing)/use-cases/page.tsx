import { getPublishedUseCases } from '@/app/admin/(protected)/use-cases/actions'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import * as LucideIcons from 'lucide-react'
import { mergePublishedUseCases } from '@/lib/useCasesData'
import { isSafeHttpUrl } from '@/lib/url'

const iconRegistry = LucideIcons as unknown as Record<string, LucideIcon>

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'AI Voice Agent Use Cases & Industry Deployments | Abimbola.AI',
  description:
    'Explore dedicated AI voice agent architectures across Real Estate, Solar, Home Services, Consulting, Finance, Customer Support, Outbound Sales, IVR 2.0, Scheduling, CRM Sync, Multi-Language, and Custom Analytics.',
  alternates: { canonical: '/use-cases' },
}

const getIcon = (iconName?: string | null): LucideIcon => {
  return (iconName && iconRegistry[iconName]) || LucideIcons.Briefcase
}

export default async function UseCasesIndexPage() {
  let dbData = null
  try {
    const { data } = await getPublishedUseCases()
    dbData = data
  } catch (error) {
    console.error('Failed to fetch use cases:', error)
  }

  const useCases = mergePublishedUseCases(dbData)

  return (
    <div className="bg-white dark:bg-black min-h-screen pt-16 pb-20 transition-colors duration-300 overflow-x-clip">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1360px]">
        {/* Hero Header */}
        <div className="max-w-3xl mb-16">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-600/20 blur-[50px] rounded-full pointer-events-none" />
            <h1 className="text-4xl md:text-6xl font-extrabold text-black dark:text-white mb-6 leading-tight relative z-10 transition-colors duration-300">
              Dedicated <span className="text-blue-600 dark:text-blue-500">AI Voice</span> Use Cases
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
              Every industry and phone workflow has its own caller psychology, qualification logic, and CRM stack. Select a use case below to explore its full architecture, real call scenarios, and sample conversation transcript.
            </p>
          </div>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {useCases.map((useCase) => {
            const IconComponent = getIcon(useCase.icon_name)
            const coverUrl =
              useCase.cover_image_url &&
              (isSafeHttpUrl(useCase.cover_image_url) ||
                (useCase.cover_image_url.startsWith('/') &&
                  !useCase.cover_image_url.startsWith('//')))
                ? useCase.cover_image_url
                : 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1000&auto=format&fit=crop'
            const topStat = useCase.results?.[0]

            return (
              <Link
                key={useCase.industry_slug}
                href={`/use-cases/${useCase.industry_slug}`}
                className="group rounded-3xl border border-black/10 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-950 overflow-hidden flex flex-col hover:border-blue-500/50 hover:shadow-2xl transition-all duration-300"
              >
                <div className="relative h-52 w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={coverUrl}
                    alt={useCase.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transform scale-100 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-200">
                      {useCase.categoryTag}
                    </span>
                    {topStat && (
                      <span className="rounded-full bg-blue-600/90 backdrop-blur-md px-2.5 py-1 text-xs font-bold text-white">
                        {topStat.stat}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors">
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white">{useCase.name}</h2>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {useCase.headline}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {useCase.subhead}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400">
                    <span>Explore {useCase.name} Architecture</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
