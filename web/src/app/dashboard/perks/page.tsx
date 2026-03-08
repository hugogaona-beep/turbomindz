'use client'

import useSWR from 'swr'
import { useSession } from 'next-auth/react'
import { useNFTOwnership } from '@/hooks/useNFTOwnership'
import { Package, Plus, Calendar, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function PerksPage() {
  const { data: session } = useSession()
  const { nfts, isLoading: nftsLoading } = useNFTOwnership()

  // Collect all payloads from all owned NFTs
  const allPayloads = nfts.flatMap((nft: any) =>
    (nft.payloads || []).map((p: any) => ({ ...p, nft }))
  )

  const active  = allPayloads.filter((p: any) => p.isActive && !p.claimedBy)
  const claimed = allPayloads.filter((p: any) => p.claimedBy)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-h2 font-light">My Perks</h1>
          <p className="text-muted text-sm mt-1 font-body">
            Services loaded onto your NFTs
          </p>
        </div>
      </div>

      {nftsLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 rounded-xl skeleton" />)}
        </div>
      ) : nfts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <div className="inline-flex p-4 rounded-full bg-electric/10 border border-electric/20 mb-4">
            <Package size={24} className="text-electric" />
          </div>
          <h2 className="font-display text-2xl font-light mb-2">No NFTs in vault</h2>
          <p className="text-muted text-sm mb-6 font-body">Own a TURBOMINDZ NFT to load and receive perks.</p>
          <Link href="/collection/explore"
            className="px-6 py-3 rounded-xl bg-electric text-obsidian font-semibold text-sm"
          >Explore Collection</Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Active Perks */}
          {active.length > 0 && (
            <div>
              <h2 className="font-body font-semibold text-white mb-4 flex items-center gap-2">
                <Package size={16} className="text-electric" />
                Active Perks ({active.length})
              </h2>
              <div className="space-y-3">
                {active.map((p: any) => (
                  <div key={p.id} className="p-5 rounded-xl bg-midnight border border-electric/20">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-white text-sm">{p.title}</p>
                          <span className="px-2 py-0.5 rounded-full bg-electric/10 text-electric border border-electric/30 text-xs">
                            {p.serviceType.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-muted mb-2">{p.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span>by {p.provider}</span>
                          {p.valueUsd && <span className="text-gold">${p.valueUsd} value</span>}
                          {p.expiryDate && (
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />
                              Expires {new Date(p.expiryDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        href={`/collection/${p.nft.tokenId}`}
                        className="text-xs text-muted hover:text-electric transition-colors flex-shrink-0"
                      >
                        NFT #{p.nft.tokenId}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Claimed */}
          {claimed.length > 0 && (
            <div>
              <h2 className="font-body font-semibold text-muted mb-4 flex items-center gap-2">
                <CheckCircle2 size={16} />
                Claimed ({claimed.length})
              </h2>
              <div className="space-y-2 opacity-60">
                {claimed.map((p: any) => (
                  <div key={p.id} className="p-4 rounded-xl bg-midnight border border-border flex items-center justify-between">
                    <p className="text-sm text-muted line-through">{p.title}</p>
                    <span className="text-xs text-green-400">Claimed</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allPayloads.length === 0 && (
            <div className="text-center py-16 border border-dashed border-border rounded-xl">
              <p className="text-muted font-body text-sm">No perks loaded yet.</p>
              <p className="text-muted/60 text-xs mt-1">Visit your NFT page to load a service.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
