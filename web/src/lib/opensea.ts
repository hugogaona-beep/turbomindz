// OpenSea API v2 integration

const OPENSEA_BASE   = 'https://api.opensea.io/api/v2'
const COLLECTION_SLUG = process.env.NEXT_PUBLIC_OPENSEA_COLLECTION_SLUG ?? 'turbomindz'
const HEADERS = {
  'X-API-KEY':    process.env.OPENSEA_API_KEY ?? '',
  'Content-Type': 'application/json',
}

export interface OpenSeaNFT {
  tokenId:        number
  name:           string
  imageUrl:       string
  owner:          string
  floorPrice:     number | null
  lastSalePrice:  number | null
  openSeaUrl:     string
  traits:         { trait_type: string; value: string }[]
}

export interface CollectionStats {
  floorPrice:    number
  totalVolume:   number
  totalSupply:   number
  numOwners:     number
  averagePrice:  number
}

/** Fetch collection-level stats */
export async function getCollectionStats(): Promise<CollectionStats> {
  const res = await fetch(
    `${OPENSEA_BASE}/collections/${COLLECTION_SLUG}/stats`,
    { headers: HEADERS, next: { revalidate: 300 } }
  )
  if (!res.ok) throw new Error('OpenSea stats error')
  const d = await res.json()
  return {
    floorPrice:   d.total?.floor_price    ?? 0,
    totalVolume:  d.total?.volume         ?? 0,
    totalSupply:  d.total?.num_owners     ?? 0,
    numOwners:    d.total?.num_owners     ?? 0,
    averagePrice: d.total?.average_price  ?? 0,
  }
}

/** Fetch a single NFT from OpenSea */
export async function getOpenSeaNFT(tokenId: number): Promise<OpenSeaNFT | null> {
  const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? ''
  const res = await fetch(
    `${OPENSEA_BASE}/chain/ethereum/contract/${CONTRACT}/nfts/${tokenId}`,
    { headers: HEADERS, next: { revalidate: 120 } }
  )
  if (!res.ok) return null
  const { nft } = await res.json()
  return {
    tokenId:       tokenId,
    name:          nft.name,
    imageUrl:      nft.image_url,
    owner:         nft.owners?.[0]?.address ?? '',
    floorPrice:    null,
    lastSalePrice: null,
    openSeaUrl:    `https://opensea.io/assets/ethereum/${CONTRACT}/${tokenId}`,
    traits:        nft.traits ?? [],
  }
}

/** Get listings for the collection */
export async function getCollectionListings(limit = 20) {
  const CONTRACT = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? ''
  const res = await fetch(
    `${OPENSEA_BASE}/listings/collection/${COLLECTION_SLUG}/best?limit=${limit}`,
    { headers: HEADERS, next: { revalidate: 60 } }
  )
  if (!res.ok) return []
  const { listings } = await res.json()
  return listings ?? []
}
