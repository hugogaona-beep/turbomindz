'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface NFTCardProps {
  tokenId:        number
  imageUrl:       string
  quoteText:      string
  philosopherName: string
  artStyle?:      string
  rarity?:        string
  priceEth?:      number
  className?:     string
  staggerIndex?:  number
}

const RARITY_COLORS: Record<string, string> = {
  LEGENDARY: 'text-gold border-gold/40 bg-gold/10',
  EPIC:      'text-electric border-electric/40 bg-electric/10',
  RARE:      'text-purple-400 border-purple-400/40 bg-purple-400/10',
  UNCOMMON:  'text-green-400 border-green-400/40 bg-green-400/10',
  COMMON:    'text-muted border-border bg-void',
}

export function NFTCard({
  tokenId, imageUrl, quoteText, philosopherName,
  artStyle, rarity = 'COMMON', priceEth, className, staggerIndex = 0,
}: NFTCardProps) {
  const rarityClass = RARITY_COLORS[rarity] || RARITY_COLORS.COMMON

  return (
    <Link
      href={`/collection/${tokenId}`}
      className={cn(
        'group relative flex flex-col rounded-xl overflow-hidden',
        'bg-midnight border border-border',
        'transition-all duration-300 ease-out-quart',
        'hover:-translate-y-1 hover:shadow-electric hover:border-electric/30',
        'opacity-0 animate-fade-up',
        className
      )}
      style={{ animationDelay: `${staggerIndex * 60}ms`, animationFillMode: 'forwards' }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-void">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={`TURBOMINDZ #${tokenId}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-void to-midnight">
            <span className="font-display text-4xl text-electric/30">#{tokenId}</span>
          </div>
        )}

        {/* Rarity Badge */}
        {rarity !== 'COMMON' && (
          <div className={cn(
            'absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold border',
            rarityClass
          )}>
            {rarity}
          </div>
        )}

        {/* Price Badge */}
        {priceEth && (
          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-obsidian/80 backdrop-blur-sm border border-border text-xs font-mono text-electric">
            {priceEth.toFixed(3)} ETH
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display text-sm italic text-[#F8F8FF]/80 leading-tight line-clamp-2">
            "{quoteText}"
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted font-body">{philosopherName}</span>
          <span className="text-xs text-electric/60 font-mono">#{tokenId}</span>
        </div>
      </div>
    </Link>
  )
}

/** Skeleton loader for NFTCard */
export function NFTCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="rounded-xl overflow-hidden bg-midnight border border-border"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="aspect-square skeleton" />
      <div className="p-3 space-y-2">
        <div className="h-4 w-4/5 rounded skeleton" />
        <div className="h-3 w-2/5 rounded skeleton" />
      </div>
    </div>
  )
}
