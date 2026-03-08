'use client'

import { useState, useCallback } from 'react'
import useSWRInfinite from 'swr/infinite'
import { useInView } from 'react-intersection-observer'
import { useEffect } from 'react'
import { NFTCard, NFTCardSkeleton } from '@/components/ui/NFTCard'
import { FilterSidebar } from '@/components/collection/FilterSidebar'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// We need to install react-intersection-observer: npm add react-intersection-observer
const fetcher = (url: string) => fetch(url).then(r => r.json())

interface Filters {
  philosopher: string
  series:      string
  artStyle:    string
  rarity:      string
  sort:        string
}

const DEFAULT_FILTERS: Filters = {
  philosopher: '',
  series:      '',
  artStyle:    '',
  rarity:      '',
  sort:        'tokenId',
}

export function CollectionExplorer() {
  const [filters, setFilters]       = useState<Filters>(DEFAULT_FILTERS)
  const [search, setSearch]         = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const getKey = (pageIndex: number, prev: any) => {
    if (prev && !prev.pagination?.hasMore) return null
    const params = new URLSearchParams({
      page:  String(pageIndex + 1),
      limit: '24',
      sort:  filters.sort,
      ...(filters.philosopher && { philosopher: filters.philosopher }),
      ...(filters.series      && { series:      filters.series }),
      ...(filters.artStyle    && { artStyle:    filters.artStyle }),
      ...(filters.rarity      && { rarity:      filters.rarity }),
    })
    return `/api/nfts?${params}`
  }

  const { data, size, setSize, isLoading } = useSWRInfinite(getKey, fetcher)

  const nfts    = data?.flatMap(d => d.nfts || []) || []
  const hasMore = data?.[data.length - 1]?.pagination?.hasMore

  const { ref: loaderRef, inView } = useInView({ threshold: 0.1 })

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setSize(s => s + 1)
    }
  }, [inView, hasMore, isLoading])

  const activeFilterCount = Object.values(filters).filter(
    (v, i) => v !== '' && i < 4 // exclude sort
  ).length

  return (
    <div className="flex gap-6">
      {/* Filter Sidebar — Desktop */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <FilterSidebar filters={filters} onChange={setFilters} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Search + Filter Bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by philosopher, quote..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-midnight border border-border text-white placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 transition-colors font-body"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors',
              activeFilterCount > 0
                ? 'border-electric/40 bg-electric/10 text-electric'
                : 'border-border bg-midnight text-muted hover:text-white'
            )}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-electric text-obsidian text-xs flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort */}
          <select
            value={filters.sort}
            onChange={e => setFilters(f => ({ ...f, sort: e.target.value }))}
            className="px-3 py-2.5 rounded-xl bg-midnight border border-border text-sm text-white focus:outline-none focus:border-electric/50 font-body"
          >
            <option value="tokenId">ID: Ascending</option>
            <option value="viewCount">Most Viewed</option>
            <option value="lastSalePrice">Price</option>
          </select>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden mb-6 p-4 rounded-xl bg-midnight border border-border">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>
        )}

        {/* Active Filter Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(filters).map(([k, v]) => {
              if (!v || k === 'sort') return null
              return (
                <span
                  key={k}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-electric/10 border border-electric/30 text-electric text-xs font-medium"
                >
                  {k}: {v}
                  <button onClick={() => setFilters(f => ({ ...f, [k]: '' }))}>
                    <X size={12} />
                  </button>
                </span>
              )
            })}
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="text-xs text-muted hover:text-white transition-colors"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Grid */}
        {isLoading && nfts.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <NFTCardSkeleton key={i} index={i} />
            ))}
          </div>
        ) : nfts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl text-muted mb-2">No results found</p>
            <p className="text-sm text-muted/60 mb-4">Try adjusting your filters</p>
            <button
              onClick={() => setFilters(DEFAULT_FILTERS)}
              className="px-4 py-2 rounded-lg bg-void border border-border text-sm text-white hover:border-electric/40 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {nfts.map((nft: any, i: number) => (
                <NFTCard
                  key={nft.tokenId}
                  tokenId={nft.tokenId}
                  imageUrl={nft.imageUrl}
                  quoteText={nft.quoteText}
                  philosopherName={nft.philosopherName}
                  rarity={nft.rarity}
                  staggerIndex={i % 12}
                />
              ))}
            </div>

            {/* Infinite scroll loader */}
            <div ref={loaderRef} className="py-8 flex justify-center">
              {isLoading && hasMore && (
                <div className="flex gap-2">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-2 h-2 rounded-full bg-electric/60 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
