import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Routes requiring authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/collection/my-vault',
  '/marketplace/create',
  '/community/rooms',
  '/affiliate/portal',
]

// Routes requiring NFT ownership (subset of protected)
const NFT_GATED_ROUTES = [
  '/community/rooms',
  '/dashboard/vault',
  '/dashboard/perks',
]

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Check if route requires auth
  const requiresAuth = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  if (!requiresAuth) return NextResponse.next()

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    const loginUrl = new URL('/auth/connect-wallet', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // NFT ownership check — handled client-side via useNFTOwnership hook
  // Server-side check is done in API routes for security

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/collection/my-vault',
    '/marketplace/create',
    '/community/rooms/:path*',
    '/affiliate/portal',
  ],
}
