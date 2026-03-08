'use client'

import useSWR from 'swr'
import { useSession } from 'next-auth/react'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useNFTOwnership() {
  const { data: session } = useSession()
  const wallet = session?.user?.walletAddress

  const { data, isLoading, error, mutate } = useSWR(
    wallet ? `/api/nfts/owner/${wallet}` : null,
    fetcher,
    {
      revalidateOnFocus:  false,
      revalidateOnMount:  true,
      dedupingInterval:   60_000,
    }
  )

  const nfts   = data?.nfts || []
  const owns   = nfts.length > 0
  const count  = data?.count || 0

  const ownsToken = (tokenId: number) =>
    nfts.some((n: any) => n.tokenId === tokenId)

  return {
    nfts,
    count,
    isHolder:   owns,
    isLoading,
    error,
    ownsToken,
    refresh:    mutate,
  }
}
