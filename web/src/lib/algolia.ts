import { algoliasearch } from 'algoliasearch'

const APP_ID   = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!
const SEARCH_KEY = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
const ADMIN_KEY  = process.env.ALGOLIA_ADMIN_KEY!

// Public search client
export const searchClient = algoliasearch(APP_ID, SEARCH_KEY)

// Admin client (server-side only)
export const adminClient = algoliasearch(APP_ID, ADMIN_KEY)

export const INDICES = {
  NFTS:     process.env.ALGOLIA_INDEX_NFTS     || 'turbomindz_nfts',
  LISTINGS: process.env.ALGOLIA_INDEX_LISTINGS  || 'turbomindz_listings',
}

/** Index an NFT record */
export async function indexNFT(nft: {
  tokenId: number
  quoteText: string
  philosopherName: string
  artStyle: string
  series: number
  imageUrl: string
  rarity: string
}) {
  const index = adminClient.initIndex(INDICES.NFTS)
  return index.saveObject({
    objectID: String(nft.tokenId),
    ...nft,
  })
}

/** Index a listing record */
export async function indexListing(listing: {
  id: string
  title: string
  description: string
  listingType: string
  priceUsd?: number
  priceEth?: number
  sellerWallet: string
}) {
  const index = adminClient.initIndex(INDICES.LISTINGS)
  return index.saveObject({
    objectID: listing.id,
    ...listing,
  })
}

/** Remove listing from index */
export async function deleteListingIndex(id: string) {
  const index = adminClient.initIndex(INDICES.LISTINGS)
  return index.deleteObject(id)
}
