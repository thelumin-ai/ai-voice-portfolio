import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is not logged in and tries to access /admin (but not /admin/login)
  if (!user && request.nextUrl.pathname.startsWith('/admin') && request.nextUrl.pathname !== '/admin/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in and tries to access /admin/login, redirect to /admin
  if (user && request.nextUrl.pathname === '/admin/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  // If user accesses /admin exactly, redirect to /admin/dashboard
  if (user && request.nextUrl.pathname === '/admin') {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  // --- SaaS auth rules ---
  if (!user && request.nextUrl.pathname.startsWith('/saas/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/saas/login'
    return NextResponse.redirect(url)
  }

  if (user && (request.nextUrl.pathname === '/saas/login' || request.nextUrl.pathname === '/saas/register')) {
    const url = request.nextUrl.clone()
    url.pathname = '/saas/dashboard'
    return NextResponse.redirect(url)
  }

  // --- Subdomain rewrites to /sites/[subdomain] ---
  const hostname = request.headers.get('host') || ''
  const currentPath = request.nextUrl.pathname

  const excludePaths = [
    '/_next',
    '/api',
    '/admin',
    '/saas',
    '/sites',
    '/privacy',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/blog'
  ]

  const isExcluded = excludePaths.some(path => currentPath.startsWith(path)) || currentPath.includes('.')

  const mainDomains = [
    'abimbola-ai-portfolio.vercel.app',
    'abimbola.ai',
    'localhost:3000',
  ]

  const isMainDomain = mainDomains.some(domain => 
    hostname === domain || hostname === `www.${domain}`
  )

  if (!isExcluded && !isMainDomain) {
    let subdomain = ''
    
    for (const domain of mainDomains) {
      if (hostname.endsWith(`.${domain}`)) {
        subdomain = hostname.replace(`.${domain}`, '')
        break
      }
    }

    if (!subdomain && !mainDomains.includes(hostname)) {
      subdomain = hostname
    }

    if (subdomain && subdomain !== 'www') {
      const url = request.nextUrl.clone()
      url.pathname = `/sites/${subdomain}${currentPath === '/' ? '' : currentPath}`
      return NextResponse.rewrite(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
