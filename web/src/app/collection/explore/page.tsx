import type { Metadata } from 'next'
import { CollectionExplorer } from '@/components/collection/CollectionExplorer'

export const metadata: Metadata = {
  title: '3,000 Minds. One Collection. — TURBOMINDZ',
  description: 'Browse all 3,000 TURBOMINDZ NFTs. Filter by philosopher, art style, rarity, and series.',
}

export default function ExplorePage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-xs text-electric uppercase tracking-widest font-body mb-2">Collection</p>
          <h1 className="font-display text-h1 font-light">
            3,000 Minds.
            <br />
            <span className="text-gradient-gold">One Collection.</span>
          </h1>
          <p className="text-muted font-body mt-3 max-w-xl">
            Every piece unrepeatable. When this series sells out, it never returns.
          </p>
        </div>
        <CollectionExplorer />
      </div>
    </div>
  )
}
