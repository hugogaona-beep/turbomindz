import type { Metadata } from 'next'
import { CommunityRooms } from '@/components/community/CommunityRooms'

export const metadata: Metadata = {
  title: 'The Inner Circle — TURBOMINDZ Community',
}

export default function CommunityPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-xs text-electric uppercase tracking-widest font-body mb-2">Community</p>
          <h1 className="font-display text-h1 font-light">
            The Inner Circle.
          </h1>
          <p className="text-muted font-body mt-3 max-w-xl">
            NFT-gated discussion rooms. Real conversations between holders who think and act.
          </p>
        </div>
        <CommunityRooms />
      </div>
    </div>
  )
}
