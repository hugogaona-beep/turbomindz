'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useAffiliate() {
  const { data, isLoading, error, mutate } = useSWR(
    '/api/affiliate/stats',
    fetcher,
    { revalidateOnFocus: false }
  )

  return {
    affiliate:   data?.affiliate   || null,
    referrals:   data?.referrals   || [],
    payouts:     data?.payouts     || [],
    dailyData:   data?.dailyData   || [],
    referralUrl: data?.referralUrl || '',
    isLoading,
    error,
    isEnrolled:  !!data?.affiliate,
    isApproved:  data?.affiliate?.status === 'APPROVED',
    refresh:     mutate,
  }
}
