'use client'

import useSWR from 'swr'
import { formatNumber, formatEth, formatUsd } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(r => r.json())

const STATS_CONFIG = [
  { key: 'totalMembers',    label: 'Members',       format: (v: number) => formatNumber(v) },
  { key: 'totalNFTs',       label: 'NFTs in Series', format: (v: number) => formatNumber(v) },
  { key: 'floorPrice',      label: 'Floor Price',    format: (v: number) => `${v.toFixed(3)} ETH` },
  { key: 'totalVolume',     label: 'Total Volume',   format: (v: number) => `${v.toFixed(1)} ETH` },
  { key: 'totalListings',   label: 'Listings',       format: (v: number) => formatNumber(v) },
  { key: 'totalDiscussions',label: 'Discussions',    format: (v: number) => formatNumber(v) },
]

export function StatsBanner() {
  const { data } = useSWR('/api/stats', fetcher, { refreshInterval: 60_000 })

  return (
    <section className="border-y border-border bg-midnight/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {STATS_CONFIG.map(stat => (
            <div key={stat.key} className="text-center">
              <p className="font-display text-2xl md:text-3xl font-light text-electric">
                {data ? stat.format(data[stat.key] ?? 0) : '—'}
              </p>
              <p className="text-xs text-muted mt-1 font-body uppercase tracking-widest">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
