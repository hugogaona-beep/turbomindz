'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { truncateAddress } from '@/lib/utils'
import { cn } from '@/lib/utils'
import {
  LayoutGrid, List, Bell, Package, BarChart2, LogOut
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const NAV_ITEMS = [
  { href: '/dashboard/vault',     label: 'My Vault',   icon: LayoutGrid },
  { href: '/dashboard/listings',  label: 'Listings',   icon: List },
  { href: '/dashboard/messages',  label: 'Messages',   icon: Bell },
  { href: '/dashboard/perks',     label: 'Perks',      icon: Package },
  { href: '/dashboard/affiliate', label: 'Affiliate',  icon: BarChart2 },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <aside className="hidden md:flex w-60 flex-shrink-0 flex-col border-r border-border bg-obsidian px-4 py-8 sticky top-16 h-[calc(100vh-4rem)]">

      {/* Wallet */}
      <div className="mb-8 px-3">
        <p className="text-xs text-muted uppercase tracking-widest mb-1">Connected as</p>
        <p className="font-mono text-sm text-electric">
          {session?.user?.walletAddress
            ? truncateAddress(session.user.walletAddress)
            : '...'}
        </p>
        {session?.user?.username && (
          <p className="text-sm text-white mt-0.5">{session.user.username}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map(item => {
          const Icon   = item.icon
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-electric/10 text-electric border border-electric/20'
                  : 'text-muted hover:bg-void hover:text-white'
              )}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <button
        onClick={() => signOut({ callbackUrl: '/' })}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted hover:text-white hover:bg-void transition-colors"
      >
        <LogOut size={16} />
        Disconnect
      </button>
    </aside>
  )
}
