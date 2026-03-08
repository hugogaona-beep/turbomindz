'use client'

import { useSession } from 'next-auth/react'
import useSWR from 'swr'
import { NFTCard, NFTCardSkeleton } from '@/components/ui/NFTCard'
import Link from 'next/link'
import { Gem } from 'lucide-react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function VaultPage() {
  const { data: session } = useSession()
  const wallet = session?.user?.walletAddress

  const { data, isLoading } = useSWR(
    wallet ? `/api/nfts/owner/${wallet}` : null,
    fetcher
  )

  const nfts = data?.nfts || []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-h2 font-light">My Vault</h1>
          <p className="text-muted text-sm mt-1 font-body">
            {isLoading ? 'Loading...' : `${nfts.length} NFT${nfts.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        {nfts.length > 0 && (
          <Link
            href="/collection/explore"
            className="px-4 py-2 rounded-lg bg-void border border-border text-sm text-white hover:border-electric/40 transition-colors"
          >
            Get More
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <NFTCardSkeleton key={i} index={i} />
          ))}
        </div>
      ) : nfts.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <div className="inline-flex p-4 rounded-full bg-electric/10 border border-electric/20 mb-4">
            <Gem size={24} className="text-electric" />
          </div>
          <h2 className="font-display text-2xl font-light mb-2">Your vault is empty</h2>
          <p className="text-muted text-sm mb-6 font-body">
            Own a TURBOMINDZ NFT to unlock your vault and all community features.
          </p>
          <Link
            href="/collection/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
          >
            Explore The Collection
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {nfts.map((nft: any, i: number) => (
            <NFTCard
              key={nft.tokenId}
              tokenId={nft.tokenId}
              imageUrl={nft.imageUrl}
              quoteText={nft.quoteText}
              philosopherName={nft.philosopherName}
              rarity={nft.rarity}
              staggerIndex={i}
            />
          ))}
        </div>
      )}
    </div>
  )
}
