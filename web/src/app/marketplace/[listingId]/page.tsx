import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import prisma from '@/lib/prisma'
import { formatUsd, truncateAddress } from '@/lib/utils'
import { ArrowLeft, Mail, ExternalLink, Tag, Briefcase, Gift, Users } from 'lucide-react'
import Link from 'next/link'

interface Props { params: Promise<{ listingId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { listingId } = await params
  const listing = await prisma.listing.findUnique({ where: { id: listingId } })
  if (!listing) return { title: 'Listing Not Found' }
  return { title: `${listing.title} — TURBOMINDZ Marketplace` }
}

const TYPE_ICONS: Record<string, any> = {
  NFT_SALE:       Tag,
  SERVICE:        Briefcase,
  BUSINESS_OFFER: Gift,
  COLLABORATION:  Users,
}

export default async function ListingDetailPage({ params }: Props) {
  const { listingId } = await params
  const listing = await prisma.listing.findUnique({
    where:   { id: listingId },
    include: { seller: { select: { username: true, avatar: true, walletAddress: true, isVerified: true, joinDate: true } } },
  })
  if (!listing) notFound()

  const Icon = TYPE_ICONS[listing.listingType] || Tag

  // Increment view count
  await prisma.listing.update({ where: { id: listingId }, data: { viewCount: { increment: 1 } } })

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/marketplace/listings" className="inline-flex items-center gap-2 text-sm text-muted hover:text-white mb-8 transition-colors">
          <ArrowLeft size={14} /> Back to Marketplace
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-electric/10 border border-electric/20">
                <Icon size={18} className="text-electric" />
              </div>
              <span className="text-xs text-electric uppercase tracking-wide font-body">
                {listing.listingType.replace('_', ' ')}
              </span>
            </div>

            <h1 className="font-display text-h2 font-light">{listing.title}</h1>
            <p className="text-muted font-body leading-relaxed whitespace-pre-wrap">{listing.description}</p>

            {listing.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {listing.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-void border border-border text-xs text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price */}
            <div className="p-5 rounded-xl bg-midnight border border-border">
              {listing.priceEth && (
                <p className="font-mono text-2xl text-electric font-light">{listing.priceEth.toFixed(3)} ETH</p>
              )}
              {listing.priceUsd && (
                <p className="text-muted text-sm">{formatUsd(listing.priceUsd)}</p>
              )}
              {!listing.priceEth && !listing.priceUsd && (
                <p className="text-muted text-sm">Contact for pricing</p>
              )}

              {listing.contactEmail && (
                <a
                  href={`mailto:${listing.contactEmail}?subject=Re: ${listing.title}`}
                  className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
                >
                  <Mail size={15} />
                  Contact Seller
                </a>
              )}
              {listing.externalUrl && (
                <a
                  href={listing.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-void border border-border text-white font-medium text-sm hover:border-electric/40 transition-colors"
                >
                  <ExternalLink size={14} />
                  View Details
                </a>
              )}
            </div>

            {/* Seller */}
            <div className="p-5 rounded-xl bg-midnight border border-border">
              <p className="text-xs text-muted uppercase tracking-wide mb-3 font-body">Seller</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-electric/10 border border-electric/20 flex items-center justify-center">
                  <span className="text-electric text-xs font-mono">
                    {listing.seller.walletAddress.slice(2, 4).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {listing.seller.username || truncateAddress(listing.seller.walletAddress)}
                    {listing.seller.isVerified && (
                      <span className="ml-1.5 text-electric text-xs">✓</span>
                    )}
                  </p>
                  <p className="text-xs text-muted">
                    Member since {new Date(listing.seller.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted text-center font-body">
              {listing.viewCount} views · Listed {new Date(listing.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
