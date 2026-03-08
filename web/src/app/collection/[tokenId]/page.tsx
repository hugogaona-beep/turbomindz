import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { truncateAddress } from '@/lib/utils'
import { ArrowLeft, ExternalLink, Package } from 'lucide-react'

interface Props {
  params: Promise<{ tokenId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tokenId } = await params
  const nft = await prisma.nFT.findUnique({ where: { tokenId: parseInt(tokenId) } })
  if (!nft) return { title: 'NFT Not Found' }
  return {
    title: `"${nft.quoteText.slice(0, 40)}..." — TURBOMINDZ #${nft.tokenId}`,
    description: `${nft.philosopherName} — TURBOMINDZ #${nft.tokenId}`,
    openGraph: { images: [{ url: nft.imageUrl }] },
  }
}

export default async function NFTDetailPage({ params }: Props) {
  const { tokenId } = await params
  const id  = parseInt(tokenId)
  if (isNaN(id)) notFound()

  const nft = await prisma.nFT.findUnique({
    where:   { tokenId: id },
    include: { traits: true, payloads: { where: { isActive: true } } },
  })

  if (!nft) notFound()

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Back */}
        <Link
          href="/collection/explore"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Collection
        </Link>

        <div className="grid lg:grid-cols-5 gap-10">

          {/* Art Panel — 60% */}
          <div className="lg:col-span-3">
            <div className="relative aspect-square rounded-2xl overflow-hidden electric-border grain-overlay">
              {nft.imageUrl ? (
                <Image
                  src={nft.imageUrl}
                  alt={`TURBOMINDZ #${nft.tokenId}`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-electric/5 to-gold/5 flex items-center justify-center">
                  <span className="font-display text-8xl text-electric/20">#{id}</span>
                </div>
              )}
            </div>
          </div>

          {/* Info Panel — 40% */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Series Badge + ID */}
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
                Series {nft.series}
              </span>
              <span className="font-mono text-sm text-muted">#{nft.tokenId}</span>
            </div>

            {/* Quote */}
            <div>
              <blockquote className="font-display text-h3 font-light italic text-gold leading-snug mb-3">
                "{nft.quoteText}"
              </blockquote>
              <p className="text-sm text-muted font-body">— {nft.philosopherName}</p>
            </div>

            {/* Traits */}
            {nft.traits.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Properties</h3>
                <div className="flex flex-wrap gap-2">
                  {nft.traits.map(trait => (
                    <div
                      key={trait.id}
                      className="px-3 py-1.5 rounded-lg bg-void border border-border text-center"
                    >
                      <p className="text-xs text-electric uppercase tracking-wide">{trait.traitType}</p>
                      <p className="text-sm font-medium text-white">{trait.value}</p>
                      <p className="text-xs text-muted">{trait.rarity.toFixed(1)}% have this</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Owner */}
            <div className="p-4 rounded-xl bg-void border border-border">
              <p className="text-xs text-muted uppercase tracking-wide mb-1">Current Owner</p>
              <p className="font-mono text-sm text-white">{truncateAddress(nft.ownerWallet)}</p>
            </div>

            {/* Service Payloads */}
            {nft.payloads.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3 flex items-center gap-2">
                  <Package size={12} />
                  Loaded Services ({nft.payloads.length})
                </h3>
                <div className="space-y-2">
                  {nft.payloads.map(p => (
                    <div key={p.id} className="p-3 rounded-xl bg-void border border-border">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">{p.title}</p>
                        {p.valueUsd && (
                          <span className="text-xs text-gold">${p.valueUsd}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <a
              href={nft.openSeaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 hover:shadow-electric transition-all"
            >
              Own This Mind
              <ExternalLink size={14} />
            </a>

            <Link
              href="/community/rooms"
              className="flex items-center justify-center px-6 py-3 rounded-xl bg-void border border-border text-white text-sm font-medium hover:border-electric/40 transition-colors"
            >
              Enter Discussion Room
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
