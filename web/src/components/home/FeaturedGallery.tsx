import Link from 'next/link'
import prisma from '@/lib/prisma'
import { NFTCard } from '@/components/ui/NFTCard'
import { ArrowRight } from 'lucide-react'

async function getFeaturedNFTs() {
  try {
    return await prisma.nFT.findMany({
      take:    6,
      orderBy: { viewCount: 'desc' },
    })
  } catch {
    return []
  }
}

export async function FeaturedGallery() {
  const nfts = await getFeaturedNFTs()

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-xs text-electric uppercase tracking-widest font-body mb-3">
            Featured
          </p>
          <h2 className="font-display text-h2 font-light">
            3,000 Minds.
            <br />
            <span className="text-gradient-gold">One Collection.</span>
          </h2>
        </div>
        <Link
          href="/collection/explore"
          className="hidden md:inline-flex items-center gap-2 text-sm text-muted hover:text-electric transition-colors group"
        >
          View All
          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Grid */}
      {nfts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {nfts.map((nft, i) => (
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
      ) : (
        // Placeholder when DB is empty
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden bg-midnight border border-border opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
            >
              <div className="aspect-square bg-gradient-to-br from-electric/5 to-gold/5 flex items-center justify-center">
                <span className="font-display text-3xl text-electric/20">#{i + 1}</span>
              </div>
              <div className="p-3">
                <div className="h-3 w-4/5 rounded skeleton mb-2" />
                <div className="h-2.5 w-2/5 rounded skeleton" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center md:hidden">
        <Link
          href="/collection/explore"
          className="inline-flex items-center gap-2 text-sm text-electric hover:text-electric/80 transition-colors"
        >
          Find Your Philosopher <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  )
}
