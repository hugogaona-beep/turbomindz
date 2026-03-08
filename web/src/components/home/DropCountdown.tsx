'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import { getTimeUntil } from '@/lib/utils'

const fetcher = (url: string) => fetch(url).then(r => r.json())

function CountUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-16 md:w-20 h-16 md:h-20 rounded-xl bg-void border border-border flex items-center justify-center overflow-hidden">
        <span className="font-display text-2xl md:text-3xl font-light text-electric tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
        {/* Pulse ring */}
        <div className="absolute inset-0 rounded-xl border border-electric/20 animate-glow-pulse" />
      </div>
      <span className="text-xs text-muted uppercase tracking-widest font-body">{label}</span>
    </div>
  )
}

export function DropCountdown() {
  const { data } = useSWR('/api/drops/upcoming', fetcher)
  const drop = data?.drop

  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    if (!drop?.releaseDate) return
    const target = new Date(drop.releaseDate)
    const tick = () => setTime(getTimeUntil(target))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [drop?.releaseDate])

  if (!drop) return null

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Gold gradient background */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, #FFD700, transparent)' }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-xs text-gold uppercase tracking-widest font-body mb-3">Next Drop</p>
        <h2 className="font-display text-h2 font-light mb-4">
          {drop.name}
        </h2>
        <p className="text-muted font-body mb-10">
          {drop.nftCount} new minds enter the collection. {drop.priceEth} ETH each.
          When this series sells out, it never returns.
        </p>

        {/* Countdown */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-10">
          <CountUnit value={time.days}    label="Days" />
          <span className="font-display text-3xl text-electric/30 -mt-6">:</span>
          <CountUnit value={time.hours}   label="Hours" />
          <span className="font-display text-3xl text-electric/30 -mt-6">:</span>
          <CountUnit value={time.minutes} label="Min" />
          <span className="font-display text-3xl text-electric/30 -mt-6">:</span>
          <CountUnit value={time.seconds} label="Sec" />
        </div>

        <Link
          href="/drops/upcoming"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gold text-obsidian font-semibold text-sm hover:bg-gold/90 hover:shadow-gold transition-all duration-200"
        >
          Get Notified For This Drop
        </Link>
      </div>
    </section>
  )
}
