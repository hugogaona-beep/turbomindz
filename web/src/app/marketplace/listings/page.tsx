import type { Metadata } from 'next'
import { MarketplaceGrid } from '@/components/marketplace/MarketplaceGrid'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Marketplace — TURBOMINDZ',
  description: 'Member-listed NFTs, services, and business offers from TURBOMINDZ holders.',
}

export default function MarketplacePage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs text-electric uppercase tracking-widest font-body mb-2">Marketplace</p>
            <h1 className="font-display text-h1 font-light">
              Turn Wisdom
              <br />
              <span className="text-gradient-electric">Into Commerce.</span>
            </h1>
          </div>
          <Link
            href="/marketplace/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
          >
            <Plus size={16} />
            Create Listing
          </Link>
        </div>
        <MarketplaceGrid />
      </div>
    </div>
  )
}
