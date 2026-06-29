'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { DEFAULT_CONTENT } from './default-content'

// ─── Route helper ───────────────────────────────────────────────────────────
function useTemplateRouter() {
  const pathname = usePathname() || ''
  return (path: string) => {
    const base = path === '/' ? '' : path
    if (pathname.startsWith('/templates/roofing-004/preview'))
      return `/templates/roofing-004/preview${base}`
    if (pathname.startsWith('/templates/roofing-004'))
      return `/templates/roofing-004${base}`
    const m = pathname.match(/^\/sites\/([^/]+)/)
    if (m) return `/sites/${m[1]}${base}`
    return path
  }
}

// ─── Shared header ───────────────────────────────────────────────────────────
function Header({
  content,
  go,
}: {
  content: typeof DEFAULT_CONTENT
  go: (p: string) => string
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname() || ''

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/quote', label: 'Quote' },
    { href: '/contact', label: 'Contact' },
  ]

  const isActive = (href: string) => {
    const resolved = go(href)
    return pathname === resolved || (href !== '/' && pathname.startsWith(resolved))
  }

  return (
    <header className="bg-[#131313] border-b border-[#353535] sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-5 md:px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href={go('/')} className="flex items-center gap-2.5 flex-shrink-0">
          <span className="material-symbols-outlined text-[#ff5637] text-[28px] leading-none">
            roofing
          </span>
          <span className="font-black text-lg tracking-tight text-white uppercase leading-none">
            {content.header.logoText}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((n) => (
            <Link
              key={n.href}
              href={go(n.href)}
              className={`text-sm font-semibold tracking-wide transition-colors duration-200 pb-0.5 ${
                isActive(n.href)
                  ? 'text-[#ffb4a5] border-b-2 border-[#ffb4a5]'
                  : 'text-[#c6c6c7] hover:text-white'
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href={go('/quote')}
          className="hidden md:inline-flex items-center px-6 py-2.5 bg-[#ff5637] hover:bg-[#ba1d00] text-white font-bold text-sm uppercase tracking-wider transition-colors duration-200"
        >
          {content.header.ctaText}
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((p) => !p)}
          className="md:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-[28px]">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0e0e0e] border-t border-[#353535] px-5 py-6 space-y-4">
          {navLinks.map((n) => (
            <Link
              key={n.href}
              href={go(n.href)}
              onClick={() => setMobileOpen(false)}
              className={`block text-base font-semibold uppercase tracking-wider py-2 border-b border-[#353535] ${
                isActive(n.href) ? 'text-[#ffb4a5]' : 'text-[#c6c6c7]'
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href={go('/quote')}
            onClick={() => setMobileOpen(false)}
            className="block text-center bg-[#ff5637] hover:bg-[#ba1d00] text-white font-bold py-3 uppercase tracking-wider mt-4 transition-colors"
          >
            {content.header.ctaText}
          </Link>
        </div>
      )}
    </header>
  )
}

// ─── Shared footer ───────────────────────────────────────────────────────────
function Footer({
  content,
  go,
}: {
  content: typeof DEFAULT_CONTENT
  go: (p: string) => string
}) {
  return (
    <footer className="bg-[#0e0e0e] border-t border-[#353535]">
      <div className="max-w-[1280px] mx-auto px-5 md:px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2 space-y-5">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#ff5637] text-[28px]">roofing</span>
            <span className="font-black text-white uppercase tracking-tight">
              {content.header.logoText}
            </span>
          </div>
          <p className="text-[#c6c6c7] text-sm leading-relaxed max-w-sm">
            {content.footer.tagline}
          </p>
          <p className="text-[#5c403a] text-xs">{content.footer.copyright}</p>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">
            Services
          </h4>
          <ul className="space-y-3">
            {content.footer.servicesLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={go(l.href)}
                  className="text-[#c6c6c7] text-sm hover:text-[#ffb4a5] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-5">
            Company
          </h4>
          <ul className="space-y-3">
            {content.footer.companyLinks.map((l) => (
              <li key={l.label}>
                <Link
                  href={go(l.href)}
                  className="text-[#c6c6c7] text-sm hover:text-[#ffb4a5] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

// ─── Home page ───────────────────────────────────────────────────────────────
export default function Roofing004Template() {
  const [content] = useState(DEFAULT_CONTENT)
  const go = useTemplateRouter()

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] font-sans overflow-x-hidden">
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;800&family=Work+Sans:wght@400;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200');
        .r004-root { font-family: 'Work Sans', sans-serif; }
        .r004-montserrat { font-family: 'Montserrat', sans-serif; }
        .r004-hero-overlay {
          background: linear-gradient(to right, rgba(15,15,15,0.92) 0%, rgba(15,15,15,0.55) 55%, rgba(15,15,15,0.15) 100%);
        }
      `}</style>

      <div className="r004-root">
        <Header content={content} go={go} />

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="relative w-full min-h-[700px] md:min-h-[820px] flex items-center">
          {/* Background image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=1600"
              alt={content.home.heroImageAlt}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 r004-hero-overlay" />
          </div>

          {/* Content */}
          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-5 md:px-6 py-24">
            <div className="max-w-2xl">
              <h1 className="r004-montserrat text-4xl sm:text-5xl md:text-[72px] font-black text-white leading-[1.05] tracking-tight mb-6">
                {content.home.heroHeading.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < content.home.heroHeading.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h1>
              <p className="text-lg text-[#c6c6c7] leading-relaxed mb-10 max-w-xl">
                {content.home.heroSubtext}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={go('/quote')}
                  className="inline-flex items-center px-8 py-4 bg-[#ff5637] hover:bg-[#ba1d00] text-white font-bold uppercase tracking-wider text-sm transition-colors"
                >
                  {content.home.heroCta}
                </Link>
                <Link
                  href={go('/services')}
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-[#131313] font-bold uppercase tracking-wider text-sm transition-colors"
                >
                  {content.home.heroCtaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── BENTO SERVICES GRID ───────────────────────────────────── */}
        <section className="w-full max-w-[1280px] mx-auto px-5 md:px-6 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1px] bg-[#131313]">
            {/* Orange highlight block */}
            <div className="bg-[#ff5637] p-10 lg:p-14 flex flex-col justify-center relative overflow-hidden">
              <h2 className="r004-montserrat text-2xl md:text-[32px] font-black text-white mb-5 leading-tight relative z-10">
                {content.home.bentoHeading.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < content.home.bentoHeading.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </h2>
              <p className="text-white/90 text-sm leading-relaxed mb-8 relative z-10">
                {content.home.bentoDesc}
              </p>
              <Link
                href={go('/contact')}
                className="self-start inline-flex items-center border-2 border-white text-white hover:bg-white hover:text-[#ff5637] font-bold uppercase tracking-wider text-xs px-6 py-3 transition-colors relative z-10"
              >
                {content.home.bentoCta}
              </Link>
              {/* Decorative circle */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-[#131313] rounded-full z-0 opacity-30 hidden lg:block" />
            </div>

            {/* 2×3 service card grid */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[#131313]">
              {content.home.services.map((svc, idx) => (
                <div
                  key={idx}
                  className="bg-[#2a2a2a] p-8 flex flex-col gap-4 hover:border-b-2 hover:border-[#ff5637] transition-all duration-200 group"
                >
                  <span className="material-symbols-outlined text-[#ff5637] text-[32px] leading-none">
                    {svc.icon}
                  </span>
                  <div>
                    <h3 className="text-white font-bold text-xs uppercase tracking-widest mb-2">
                      {svc.title}
                    </h3>
                    <p className="text-[#c6c6c7] text-sm leading-relaxed">{svc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PERFORMANCE CARDS ─────────────────────────────────────── */}
        <section className="w-full max-w-[1280px] mx-auto px-5 md:px-6 pb-24">
          <h2 className="r004-montserrat text-3xl md:text-[48px] font-black text-white text-center mb-14 tracking-tight">
            {content.home.performanceHeading}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {content.home.performanceCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-[#202020] border border-[#353535] flex flex-col group overflow-hidden hover:border-[#ff5637]/50 transition-colors duration-300"
              >
                {/* Image */}
                <div className="h-56 overflow-hidden relative flex-shrink-0">
                  <img
                    src={card.image}
                    alt={card.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="r004-montserrat text-[28px] font-black text-white mb-4 leading-tight">
                    {card.heading}
                  </h3>
                  <p className="text-[#c6c6c7] text-sm leading-relaxed mb-8 flex-grow">
                    {card.desc}
                  </p>
                  <Link
                    href={go(card.link)}
                    className="block text-center bg-[#ff5637] hover:bg-[#ba1d00] text-white font-bold uppercase tracking-wider text-sm py-4 transition-colors"
                  >
                    {card.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Footer content={content} go={go} />
      </div>
    </div>
  )
}

// Export shared components for use by inner pages
export { Header, Footer, useTemplateRouter }
