import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return (
    url &&
    key &&
    url.startsWith('http') &&
    !url.includes('your_supabase') &&
    !key.includes('your_supabase')
  );
};

export async function middleware(request) {
  // If Supabase isn't configured, allow access to login page but block other admin routes
  if (!isSupabaseConfigured()) {
    if (request.nextUrl.pathname === '/admin/login') {
      return NextResponse.next();
    }
    if (request.nextUrl.pathname.startsWith('/admin')) {
      // Redirect to login with a message
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
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

  // Protect admin routes (except login)
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/admin/login' && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/admin/:path*'],
}
