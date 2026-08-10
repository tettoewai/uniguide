import { NextResponse } from 'next/server'
import { auth } from '@/auth'

const PROTECTED_PATHS = ['/dashboard', '/onboarding', '/recommendations', '/favorites', '/settings']
const ADMIN_PATHS = ['/admin']

export default auth((req) => {
  const session = req.auth
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p))
  const isAdmin = ADMIN_PATHS.some((p) => pathname.startsWith(p))

  if (!session?.user) {
    if (isProtected || isAdmin) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.nextUrl),
      )
    }
  } else {
    const isUserPage = isProtected && session.user.role === 'ADMIN'
    if (isUserPage) {
      return NextResponse.redirect(new URL('/admin/universities', req.nextUrl))
    }
    if (isAdmin && session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
    }
    if (pathname === '/login' || pathname === '/register') {
      return NextResponse.redirect(
        new URL(session.user.role === 'ADMIN' ? '/admin/universities' : '/dashboard', req.nextUrl),
      )
    }
  }
})

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/recommendations/:path*',
    '/favorites/:path*',
    '/admin/:path*',
    '/settings',
    '/login',
    '/register',
  ],
}