import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatEth(value: number, decimals = 4): string {
  return `${value.toFixed(decimals)} ETH`
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style:    'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value)
}

export function getTimeUntil(date: Date): {
  days: number; hours: number; minutes: number; seconds: number
} {
  const diff = Math.max(0, date.getTime() - Date.now())
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000)  / 60000),
    seconds: Math.floor((diff % 60000)    / 1000),
  }
}

export function ipfsToHttp(ipfsUri: string): string {
  const gateway = process.env.NEXT_PUBLIC_IPFS_GATEWAY ||
    'https://gateway.pinata.cloud/ipfs/'
  if (ipfsUri.startsWith('ipfs://')) {
    return ipfsUri.replace('ipfs://', gateway)
  }
  return ipfsUri
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}
