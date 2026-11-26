import { getPublishedUseCaseBySlug } from '@/app/admin/(protected)/use-cases/actions'
import { getSiteSettings } from '@/app/admin/(protected)/settings/actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import * as LucideIcons from 'lucide-react'
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Cpu,
  MessageSquareQuote,
  PhoneCall,
  Sparkles,
  Workflow,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import WebRTCVoiceDemo from '@/components/WebRTCVoiceDemo'
import { sanitizeHref, isSafeHttpUrl } from '@/lib/url'
import { serializeJsonLd } from '@/lib/seo/jsonLd'
import {
  RICH_USE_CASES,
  resolveRichUseCase,
  type UseCaseAccent,
} from '@/lib/useCasesData'

const iconRegistry = LucideIcons as unknown as Record<string, LucideIcon>

const ACCENT_STYLES: Record<
  UseCaseAccent,
  {
    badge: string
    glow: string
    iconBox: string
    statText: string
    stepBadge: string
    borderHover: string
    ctaBtn: string
    aiBubble: string
  }
> = {
  blue: {
    badge:
      'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/25',
    glow: 'bg-blue-600/20',
    iconBox: 'bg-blue-600 text-white shadow-blue-600/25',
    statText: 'from-blue-600 to-indigo-500 dark:from-white dark:to-blue-400',
    stepBadge:
      'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30',
    borderHover: 'hover:border-blue-500/40',
    ctaBtn: 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20',
    aiBubble:
      'bg-blue-600/10 border-blue-500/25 text-gray-900 dark:text-zinc-100',
  },
  amber: {
    badge:
      'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/25',
    glow: 'bg-amber-500/20',
    iconBox: 'bg-amber-500 text-zinc-950 shadow-amber-500/25',
    statText: 'from-amber-600 to-orange-500 dark:from-white dark:to-amber-400',
    stepBadge:
      'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    borderHover: 'hover:border-amber-500/40',
    ctaBtn: 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20',
    aiBubble:
      'bg-amber-500/10 border-amber-500/25 text-gray-900 dark:text-zinc-100',
  },
  emerald: {
    badge:
      'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
    glow: 'bg-emerald-500/20',
    iconBox: 'bg-emerald-600 text-white shadow-emerald-600/25',
    statText:
      'from-emerald-600 to-teal-500 dark:from-white dark:to-emerald-400',
    stepBadge:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    borderHover: 'hover:border-emerald-500/40',
    ctaBtn:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20',
    aiBubble:
      'bg-emerald-500/10 border-emerald-500/25 text-gray-900 dark:text-zinc-100',
  },
  violet: {
    badge:
      'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/25',
    glow: 'bg-violet-600/20',
    iconBox: 'bg-violet-600 text-white shadow-violet-600/25',
    statText:
      'from-violet-600 to-purple-500 dark:from-white dark:to-violet-400',
    stepBadge:
      'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30',
    borderHover: 'hover:border-violet-500/40',
    ctaBtn:
      'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-600/20',
    aiBubble:
      'bg-violet-500/10 border-violet-500/25 text-gray-900 dark:text-zinc-100',
  },
  cyan: {
    badge:
      'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/25',
    glow: 'bg-cyan-500/20',
    iconBox: 'bg-cyan-600 text-white shadow-cyan-600/25',
    statText: 'from-cyan-600 to-blue-500 dark:from-white dark:to-cyan-400',
    stepBadge:
      'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30',
    borderHover: 'hover:border-cyan-500/40',
    ctaBtn: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-cyan-600/20',
    aiBubble:
      'bg-cyan-500/10 border-cyan-500/25 text-gray-900 dark:text-zinc-100',
  },
  rose: {
    badge:
      'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25',
    glow: 'bg-rose-500/20',
    iconBox: 'bg-rose-600 text-white shadow-rose-600/25',
    statText: 'from-rose-600 to-pink-500 dark:from-white dark:to-rose-400',
    stepBadge:
      'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
    borderHover: 'hover:border-rose-500/40',
    ctaBtn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20',
    aiBubble:
      'bg-rose-500/10 border-rose-500/25 text-gray-900 dark:text-zinc-100',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>
}) {
  const { industry } = await params
  const { data: dbUseCase } = await getPublishedUseCaseBySlug(industry)
  const data = resolveRichUseCase(industry, dbUseCase)

  if (!data) {
    return { title: 'Use Case Not Found' }
  }

  return {
    title: `${data.name} AI Voice Agents — ${data.headline} | Abimbola.AI`,
    description: data.subhead,
    alternates: { canonical: `/use-cases/${industry}` },
    ...(data.cover_image_url
      ? {
          openGraph: {
            title: `${data.name} — ${data.headline}`,
            description: data.subhead,
            images: [data.cover_image_url],
          },
        }
      : {}),
  }
}

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ industry: string }>
}) {
  const { industry } = await params

  const { data: dbUseCase } = await getPublishedUseCaseBySlug(industry)
  const data = resolveRichUseCase(industry, dbUseCase)

  if (!data) {
    notFound()
  }

  const palette = ACCENT_STYLES[data.accent] || ACCENT_STYLES.blue
  const HeroIcon = (data.icon_name && iconRegistry[data.icon_name]) || Cpu

  const { data: settings } = await getSiteSettings()
  let rawConsult =
    'https://www.upwork.com/services/product/development-it-abimbola-1889268991195383021'
  if (settings?.consultation_provider === 'fiverr' && settings?.consultation_link_fiverr) {
    rawConsult = settings.consultation_link_fiverr
  } else if (
    settings?.consultation_provider === 'calendly' &&
    settings?.consultation_link_calendly
  ) {
    rawConsult = settings.consultation_link_calendly
  } else if (settings?.consultation_link_upwork) {
    rawConsult = settings.consultation_link_upwork
  }
  const consultationLink = sanitizeHref(rawConsult, '/#consultation')

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || 'https://abimbola-ai-portfolio.vercel.app'
  ).replace(/\/+$/, '')
  const pageUrl = `${siteUrl}/use-cases/${industry}`

  const useCaseStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `${data.name} — ${data.headline}`,
        description: data.subhead,
        serviceType: `${data.name} AI Voice Automation`,
        url: pageUrl,
        provider: {
          '@type': 'Person',
          name: 'Abimbola Akinsanmi',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Use Cases',
            item: `${siteUrl}/use-cases`,
          },
          { '@type': 'ListItem', position: 3, name: data.name, item: pageUrl },
        ],
      },
    ],
  }

  const hasSafeCover =
    Boolean(data.cover_image_url) &&
    (isSafeHttpUrl(data.cover_image_url) ||
      (data.cover_image_url.startsWith('/') && !data.cover_image_url.startsWith('//')))

  // Pick 3 related use cases for cross-discovery at the bottom
  const currentIdx = RICH_USE_CASES.findIndex((u) => u.industry_slug === data.industry_slug)
  const relatedUseCases = RICH_USE_CASES.filter(
    (u) => u.industry_slug !== data.industry_slug
  ).slice(currentIdx >= 0 ? currentIdx % Math.max(1, RICH_USE_CASES.length - 4) : 0, (currentIdx >= 0 ? currentIdx % Math.max(1, RICH_USE_CASES.length - 4) : 0) + 3)

  return (
    <div className="bg-white dark:bg-black text-gray-900 dark:text-white min-h-screen pt-14 pb-24 transition-colors duration-300 overflow-x-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(useCaseStructuredData) }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1320px]">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center text-sm text-gray-500 dark:text-zinc-400 mb-8 gap-1"
        >
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 opacity-60" />
          <Link
            href="/use-cases"
            className="hover:text-black dark:hover:text-white transition-colors"
          >
            Use Cases
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 opacity-60" />
          <span className="font-medium text-gray-900 dark:text-white bg-black/5 dark:bg-white/10 px-2.5 py-0.5 rounded-md">
            {data.name}
          </span>
        </nav>

        {/* Tailored Industry Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-20 relative">
          <div
            className={`absolute -top-16 -left-16 w-72 h-72 ${palette.glow} blur-[90px] rounded-full pointer-events-none`}
          />

          <div className="lg:col-span-7 relative z-10 space-y-6">
            <div
              className={`inline-flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${palette.badge}`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full shadow-sm ${palette.iconBox}`}
              >
                <HeroIcon className="h-3.5 w-3.5" />
              </span>
              <span className="text-gray-800 dark:text-zinc-200">{data.categoryTag}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-gray-950 dark:text-white leading-[1.1]">
              {data.headline}
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-zinc-300 leading-relaxed max-w-2xl">
              {data.subhead}
            </p>

            {/* Hero Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={consultationLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold shadow-lg transition-all ${palette.ctaBtn}`}
              >
                <PhoneCall className="h-4 w-4" />
                <span>Build My {data.name} Agent</span>
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/15 dark:border-white/15 bg-black/[0.03] dark:bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-gray-900 dark:text-white hover:bg-black/[0.07] dark:hover:bg-white/10 transition-colors"
              >
                <span>Try Live Voice Demos</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Key Outcome Strip */}
            {data.results && data.results.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                {data.results.map((result, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-gray-50/90 dark:bg-zinc-900/70 p-4"
                  >
                    <div
                      className={`text-2xl sm:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${palette.statText}`}
                    >
                      {result.stat}
                    </div>
                    <div className="text-xs font-medium text-gray-600 dark:text-zinc-400 uppercase tracking-wider mt-1">
                      {result.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-black/10 dark:border-white/15 shadow-2xl bg-zinc-900">
              {hasSafeCover && (
                <Image
                  src={data.cover_image_url}
                  alt={`${data.name} AI Voice Agent Deployment`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 inset-x-0 p-6 text-white">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/80 mb-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{data.name} Deployment Blueprint</span>
                </div>
                <p className="text-sm text-zinc-200 leading-snug">
                  Custom-trained on {data.name.toLowerCase()} terminology, objection handling, and real-time calendar/CRM APIs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Two-Column Deep Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left 7 Columns: Specific Industry Narrative, Scenarios, Pipeline & Capabilities */}
          <div className="lg:col-span-7 space-y-16">
            {/* 1. The Industry Bottleneck */}
            <section className="rounded-3xl border border-black/10 dark:border-white/10 bg-gray-50/80 dark:bg-zinc-950 p-6 sm:p-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                <Zap className="h-4 w-4" />
                <span>Why {data.name} Teams Lose Calls &amp; Revenue</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white">
                The {data.name} Bottleneck
              </h2>
              <p className="text-gray-700 dark:text-zinc-300 text-base sm:text-lg leading-relaxed">
                {data.problem}
              </p>
            </section>

            {/* 2. Deep-Dive Architecture Narrative */}
            <section className="space-y-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white">
                {data.deepDive.title}
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-zinc-300 text-base sm:text-lg leading-relaxed">
                {data.deepDive.paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* 3. High-Impact Industry Scenarios */}
            <section className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white">
                  High-Impact {data.name} Workflows
                </h2>
                <p className="text-sm sm:text-base text-gray-600 dark:text-zinc-400 mt-1">
                  Specific inbound and outbound call types automated for {data.name.toLowerCase()} operations.
                </p>
              </div>

              <div className="space-y-4">
                {data.scenarios.map((scenario, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/70 p-6 transition-colors ${palette.borderHover}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-lg border text-xs font-bold ${palette.stepBadge}`}
                      >
                        0{idx + 1}
                      </span>
                      <h3 className="text-lg font-bold text-gray-950 dark:text-white">
                        {scenario.title}
                      </h3>
                    </div>

                    <div className="grid gap-2.5 text-sm">
                      <p className="text-gray-600 dark:text-zinc-400">
                        <strong className="text-gray-900 dark:text-zinc-200">Trigger: </strong>
                        {scenario.trigger}
                      </p>
                      <p className="text-gray-600 dark:text-zinc-400">
                        <strong className="text-gray-900 dark:text-zinc-200">AI Action: </strong>
                        {scenario.action}
                      </p>
                      <p className="text-gray-800 dark:text-zinc-200 font-medium pt-1">
                        <strong className="text-emerald-600 dark:text-emerald-400">Outcome: </strong>
                        {scenario.outcome}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. End-to-End Call Architecture */}
            <section className="space-y-6">
              <div className="flex items-center gap-2.5">
                <Workflow className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white">
                  End-to-End Call Execution Flow
                </h2>
              </div>

              <div className="space-y-4">
                {data.flow.map((step, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-black/10 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 p-5 sm:p-6 flex gap-4 items-start"
                  >
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center font-bold text-sm ${palette.stepBadge}`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-gray-950 dark:text-white font-bold text-base sm:text-lg mb-1">
                        {step.step}
                      </h3>
                      <p className="text-gray-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Capabilities & Integrations */}
            <section className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white">
                Built-In {data.name} Capabilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {data.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900/50 p-4"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-800 dark:text-zinc-200">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {data.integrations && data.integrations.length > 0 && (
                <div className="pt-4 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                    Common {data.name} Stack &amp; API Integrations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.integrations.map((tool) => (
                      <span
                        key={tool}
                        className="rounded-lg border border-black/10 dark:border-white/10 bg-gray-100 dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-gray-800 dark:text-zinc-300"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right 5 Columns: Sample Call Dialogue + Live Demo (if configured) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Live WebRTC Demo Card when agent ID is configured */}
            {data.vapiAgentId && (
              <div className="rounded-3xl border border-black/10 dark:border-white/15 bg-gray-50 dark:bg-zinc-900/90 p-6 shadow-xl">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-xl font-bold text-gray-950 dark:text-white">
                    Talk to the {data.name} Agent
                  </h2>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="text-gray-600 dark:text-zinc-400 text-sm mb-5">
                  Start a live microphone session to test real-time qualification for {data.name}.
                </p>
                <WebRTCVoiceDemo
                  agentRole={data.name}
                  vapiAgentId={(() => {
                    const urlOrId = data.vapiAgentId
                    if (urlOrId.includes('vapi.ai')) {
                      try {
                        const urlObj = new URL(urlOrId)
                        const assistantId =
                          urlObj.searchParams.get('assistantId') || urlObj.searchParams.get('id')
                        if (assistantId) return assistantId
                      } catch {
                        // Ignore URL parse issues and use raw ID
                      }
                    }
                    return urlOrId
                  })()}
                />
              </div>
            )}

            {/* Realistic Industry Call Transcript Card */}
            <div className="rounded-3xl border border-black/10 dark:border-white/15 bg-gray-50/90 dark:bg-zinc-900/90 p-6 shadow-xl space-y-5">
              <div className="border-b border-black/10 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-400 mb-1">
                  <MessageSquareQuote className="h-4 w-4" />
                  <span>Example {data.name} Call Flow</span>
                </div>
                <h2 className="text-lg font-bold text-gray-950 dark:text-white">
                  {data.sampleDialogue.agentName}
                </h2>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">
                  Scenario: {data.sampleDialogue.context}
                </p>
              </div>

              <div className="space-y-3">
                {data.sampleDialogue.turns.map((turn, idx) => {
                  const isAi = turn.speaker === 'AI'
                  return (
                    <div
                      key={idx}
                      className={`rounded-2xl border p-3.5 text-sm leading-relaxed ${
                        isAi
                          ? palette.aiBubble
                          : 'bg-white dark:bg-black/60 border-black/10 dark:border-white/10 text-gray-700 dark:text-zinc-300 ml-4'
                      }`}
                    >
                      <span className="block text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">
                        {isAi ? data.sampleDialogue.agentName : 'Caller'}
                      </span>
                      <p>{turn.text}</p>
                    </div>
                  )
                })}
              </div>

              <div className="pt-2 space-y-2.5">
                <Link
                  href="/playground"
                  className={`flex w-full items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all shadow-md ${palette.ctaBtn}`}
                >
                  <span>Test Live Voice Agents in Playground</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/#estimator"
                  className="block w-full text-center py-2.5 px-4 rounded-xl border border-black/10 dark:border-white/10 text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Estimate Scope &amp; Pricing for {data.name}
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Related Use Cases Cross-Navigation */}
        {relatedUseCases.length > 0 && (
          <section className="mt-24 pt-16 border-t border-black/10 dark:border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-950 dark:text-white">
                  Explore Other Dedicated Use Cases
                </h2>
                <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1">
                  See how voice AI is architected for adjacent industries and workflows.
                </p>
              </div>
              <Link
                href="/use-cases"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>View all 12 use cases</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedUseCases.map((item) => {
                const RelIcon = (item.icon_name && iconRegistry[item.icon_name]) || Cpu
                return (
                  <Link
                    key={item.industry_slug}
                    href={`/use-cases/${item.industry_slug}`}
                    className="group rounded-2xl border border-black/10 dark:border-white/10 bg-gray-50/70 dark:bg-zinc-900/60 p-6 flex flex-col justify-between hover:border-blue-500/40 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                          <RelIcon className="h-5 w-5" />
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-zinc-400">
                          {item.categoryTag}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-zinc-400 mt-1.5 line-clamp-2">
                        {item.subhead}
                      </p>
                    </div>
                    <div className="mt-5 inline-flex items-center text-xs font-bold text-blue-600 dark:text-blue-400">
                      <span>Read {item.name} breakdown</span>
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Tailored Bottom CTA */}
        <div className="mt-20 text-center bg-gray-950 dark:bg-zinc-900/90 rounded-3xl p-8 sm:p-12 border border-black/10 dark:border-white/15 text-white relative overflow-hidden">
          <div
            className={`absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-48 ${palette.glow} blur-[90px] pointer-events-none`}
          />
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to deploy AI voice agents for {data.name}?
            </h2>
            <p className="text-zinc-300 text-base sm:text-lg">
              Let&apos;s map your exact {data.name.toLowerCase()} call scripts, qualification logic, and{' '}
              {data.integrations.slice(0, 2).join(' / ')} integrations in a 1-on-1 architecture session.
            </p>
            <div className="pt-2">
              <Link
                href={consultationLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-4 text-sm font-bold text-black shadow-lg hover:bg-zinc-200 transition-all"
              >
                Book Your {data.name} Strategy Session
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
