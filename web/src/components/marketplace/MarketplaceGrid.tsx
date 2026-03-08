'use client'

import { useState } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { truncateAddress, formatUsd } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { ArrowUpRight, Tag, Briefcase, Gift, Users } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const LISTING_TYPES = [
  { value: '',               label: 'All',       icon: null },
  { value: 'NFT_SALE',       label: 'NFTs',      icon: Tag },
  { value: 'SERVICE',        label: 'Services',  icon: Briefcase },
  { value: 'BUSINESS_OFFER', label: 'Offers',    icon: Gift },
  { value: 'COLLABORATION',  label: 'Collab',    icon: Users },
]

const TYPE_COLORS: Record<string, string> = {
  NFT_SALE:       'bg-electric/10 text-electric border-electric/30',
  SERVICE:        'bg-gold/10 text-gold border-gold/30',
  BUSINESS_OFFER: 'bg-green-400/10 text-green-400 border-green-400/30',
  COLLABORATION:  'bg-purple-400/10 text-purple-400 border-purple-400/30',
}

export function MarketplaceGrid() {
  const [type, setType] = useState('')
  const { data, isLoading } = useSWR(
    `/api/listings?limit=20${type ? `&type=${type}` : ''}`,
    fetcher,
    { refreshInterval: 30_000 }
  )

  const listings = data?.listings || []

  return (
    <div className="flex gap-8">
      {/* Filter Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="p-4 rounded-xl bg-midnight border border-border">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4 font-body">Type</h3>
          <div className="space-y-1.5">
            {LISTING_TYPES.map(t => {
              const Icon = t.icon
              return (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors font-body',
                    type === t.value
                      ? 'bg-electric/10 text-electric border border-electric/30'
                      : 'text-muted hover:bg-void hover:text-white border border-transparent'
                  )}
                >
                  {Icon && <Icon size={14} />}
                  {t.label}
                </button>
              )
            })}
          </div>
        </div>
      </aside>

      {/* Grid */}
      <div className="flex-1">
        {/* Mobile type tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto lg:hidden pb-1">
          {LISTING_TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              className={cn(
                'flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors',
                type === t.value
                  ? 'bg-electric text-obsidian'
                  : 'bg-void border border-border text-muted hover:text-white'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-52 rounded-xl skeleton" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-muted mb-2">No listings yet</p>
            <p className="text-sm text-muted/60 mb-6">Be the first to create one</p>
            <Link
              href="/marketplace/create"
              className="px-5 py-2.5 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
            >
              Create Listing
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {listings.map((listing: any) => (
              <Link
                key={listing.id}
                href={`/marketplace/${listing.id}`}
                className="group p-5 rounded-xl bg-midnight border border-border hover:border-electric/30 hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3"
              >
                {/* Type Badge */}
                <div className="flex items-center justify-between">
                  <span className={cn(
                    'px-2 py-0.5 rounded-full text-xs font-semibold border',
                    TYPE_COLORS[listing.listingType] || 'bg-void text-muted border-border'
                  )}>
                    {listing.listingType.replace('_', ' ')}
                  </span>
                  <ArrowUpRight size={14} className="text-muted group-hover:text-electric transition-colors" />
                </div>

                {/* Title */}
                <h3 className="font-body font-medium text-white line-clamp-2 leading-snug">
                  {listing.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted leading-relaxed line-clamp-2 flex-1">
                  {listing.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    {listing.priceEth && (
                      <p className="font-mono text-sm text-electric font-medium">
                        {listing.priceEth.toFixed(3)} ETH
                      </p>
                    )}
                    {listing.priceUsd && (
                      <p className="text-xs text-muted">{formatUsd(listing.priceUsd)}</p>
                    )}
                    {!listing.priceEth && !listing.priceUsd && (
                      <p className="text-xs text-muted">Contact for pricing</p>
                    )}
                  </div>
                  <p className="text-xs text-muted font-mono">
                    {truncateAddress(listing.sellerWallet)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
