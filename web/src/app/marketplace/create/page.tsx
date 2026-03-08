import type { Metadata } from 'next'
import { ListingCreateForm } from '@/components/marketplace/ListingCreateForm'

export const metadata: Metadata = { title: 'Create Listing — TURBOMINDZ Marketplace' }

export default function CreateListingPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-xs text-electric uppercase tracking-widest font-body mb-2">Marketplace</p>
          <h1 className="font-display text-h2 font-light">Create a Listing</h1>
          <p className="text-muted text-sm mt-2 font-body">
            Post an NFT, service, business offer, or collaboration opportunity.
          </p>
        </div>
        <ListingCreateForm />
      </div>
    </div>
  )
}
