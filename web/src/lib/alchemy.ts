// Alchemy — on-chain NFT ownership verification

const ALCHEMY_BASE = `https://eth-mainnet.g.alchemy.com/nft/v3/${process.env.ALCHEMY_API_KEY}`
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? ''

export interface OwnedNFT {
  tokenId: number
  imageUrl: string
  title: string
}

/** Returns all TURBOMINDZ token IDs owned by a wallet */
export async function getNFTsForOwner(walletAddress: string): Promise<OwnedNFT[]> {
  const url = `${ALCHEMY_BASE}/getNFTsForOwner?owner=${walletAddress}&contractAddresses[]=${CONTRACT_ADDRESS}&withMetadata=true`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`Alchemy error: ${res.status}`)
  const data = await res.json()
  return data.ownedNfts.map((nft: any) => ({
    tokenId: parseInt(nft.tokenId, 16),
    imageUrl: nft.image?.cachedUrl || nft.image?.originalUrl || '',
    title: nft.name || `TURBOMINDZ #${parseInt(nft.tokenId, 16)}`,
  }))
}

/** Verify a wallet owns at least one TURBOMINDZ NFT */
export async function verifyNFTOwnership(walletAddress: string): Promise<boolean> {
  const nfts = await getNFTsForOwner(walletAddress)
  return nfts.length > 0
}

/** Get owner of a specific token */
export async function getTokenOwner(tokenId: number): Promise<string | null> {
  const url = `${ALCHEMY_BASE}/getOwnersForNFT?contractAddress=${CONTRACT_ADDRESS}&tokenId=${tokenId}`
  const res = await fetch(url, { next: { revalidate: 30 } })
  if (!res.ok) return null
  const data = await res.json()
  return data.owners?.[0] ?? null
}
