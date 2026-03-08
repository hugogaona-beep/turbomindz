'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { cn } from '@/lib/utils'
import { Bell, Menu, X, Zap } from 'lucide-react'

const NAV_LINKS = [
  { href: '/collection/explore', label: 'Collection' },
  { href: '/marketplace/listings', label: 'Marketplace' },
  { href: '/community/rooms', label: 'Community' },
  { href: '/drops/upcoming', label: 'Drops' },
  { href: '/affiliate/leaderboard', label: 'Affiliate' },
]

export function NavBar() {
  const pathname  = usePathname()
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-obsidian/95 backdrop-blur-xl border-b border-border'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-electric/10 border border-electric/30 flex items-center justify-center group-hover:bg-electric/20 transition-colors">
            <Zap size={16} className="text-electric" />
          </div>
          <span className="font-display text-xl tracking-wide text-white">
            TURBO<span className="text-electric">MINDZ</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-body text-sm font-medium transition-colors duration-150',
                pathname?.startsWith(link.href.split('/')[1] ? '/' + link.href.split('/')[1] : link.href)
                  ? 'text-electric'
                  : 'text-muted hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {session && (
            <Link href="/dashboard/messages" className="relative p-2 text-muted hover:text-white transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-electric" />
            </Link>
          )}

          <ConnectButton
            showBalance={false}
            chainStatus="none"
            accountStatus="avatar"
          />

          {session && (
            <Link
              href="/dashboard"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-void border border-border text-sm font-medium text-white hover:border-electric/40 transition-colors"
            >
              Dashboard
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-muted hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-midnight border-t border-border">
          <nav className="flex flex-col px-4 py-4 gap-1">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  pathname?.startsWith('/' + link.href.split('/')[1])
                    ? 'bg-electric/10 text-electric'
                    : 'text-muted hover:bg-void hover:text-white'
                )}
              >
                {link.label}
              </Link>
            ))}
            {session && (
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-void border border-border text-white"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
