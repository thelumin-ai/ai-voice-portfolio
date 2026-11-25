import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isAdminUser } from '@/lib/auth/admin'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Only enforce auth on /admin routes; public routes pass through immediately
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Gracefully handle missing Supabase env vars instead of crashing with HTTP 500
  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname !== '/admin/login') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        )
      },
    },
  })

  let user = null
  try {
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch (err) {
    console.error('Proxy Supabase auth error:', err)
  }

  const authorizedAdmin = isAdminUser(user)

  const redirectWithCookies = (targetPath: string) => {
    const url = request.nextUrl.clone()
    url.pathname = targetPath
    const redirectResponse = NextResponse.redirect(url)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie)
    })
    return redirectResponse
  }

  // Unauthenticated or non-admin users accessing /admin/* (except /admin/login)
  if (!authorizedAdmin && pathname !== '/admin/login') {
    return redirectWithCookies('/admin/login')
  }

  // Authorized admin accessing /admin/login or /admin root -> redirect to dashboard
  if (authorizedAdmin && (pathname === '/admin/login' || pathname === '/admin')) {
    return redirectWithCookies('/admin/dashboard')
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
