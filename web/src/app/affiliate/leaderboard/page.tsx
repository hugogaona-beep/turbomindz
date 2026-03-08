import type { Metadata } from 'next'
import { Trophy } from 'lucide-react'
import { formatUsd, truncateAddress } from '@/lib/utils'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Affiliate Leaderboard — TURBOMINDZ' }

async function getLeaderboard() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/affiliate/leaderboard`, {
      next: { revalidate: 300 }
    })
    if (!res.ok) return []
    const { leaderboard } = await res.json()
    return leaderboard || []
  } catch {
    return []
  }
}

const RANK_STYLES = ['text-gold', 'text-[#C0C0C0]', 'text-[#CD7F32]']

export default async function LeaderboardPage() {
  const leaders: any[] = await getLeaderboard()

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-xs text-electric uppercase tracking-widest font-body mb-2">Affiliate Program</p>
          <h1 className="font-display text-h1 font-light mb-3">
            Share Genius.
            <br />
            <span className="text-gradient-gold">Earn Real.</span>
          </h1>
          <p className="text-muted font-body">Podcasters and creators earn commission on every sale they drive.</p>
          <Link
            href="/affiliate/apply"
            className="inline-flex mt-6 px-6 py-3 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
          >
            Apply Now — Limited Spots
          </Link>
        </div>

        <div className="space-y-2">
          {leaders.length === 0 ? (
            <div className="text-center py-16 text-muted font-body">
              No affiliates yet — be the first.
            </div>
          ) : leaders.map((leader: any, i: number) => (
            <div
              key={i}
              className="flex items-center gap-4 p-4 rounded-xl bg-midnight border border-border"
            >
              <span className={`font-display text-xl font-light w-8 text-center ${RANK_STYLES[i] || 'text-muted'}`}>
                {i < 3 ? (
                  <Trophy size={18} className="mx-auto" />
                ) : (
                  `#${leader.rank}`
                )}
              </span>
              <div className="flex-1">
                <p className="font-body font-medium text-white text-sm">{leader.username}</p>
                <p className="text-xs text-muted">{leader.platform}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-electric">{formatUsd(leader.totalEarnedUsd)}</p>
                <p className="text-xs text-muted">{leader.totalReferrals} referrals</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
