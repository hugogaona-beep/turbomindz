'use client'

const RARITIES   = ['LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON']
const ART_STYLES = ['Baroque', 'Minimalist', 'Cyberpunk', 'Oil Painting', 'Watercolor', 'Abstract']
const SERIES     = ['1', '2', '3']

interface Filters {
  philosopher: string
  series:      string
  artStyle:    string
  rarity:      string
  sort:        string
}

interface FilterSidebarProps {
  filters:  Filters
  onChange: (f: Filters) => void
}

export function FilterSidebar({ filters, onChange }: FilterSidebarProps) {
  const set = (key: keyof Filters) => (value: string) =>
    onChange({ ...filters, [key]: filters[key] === value ? '' : value })

  return (
    <div className="space-y-6">

      {/* Rarity */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3 font-body">
          Rarity
        </h3>
        <div className="space-y-1.5">
          {RARITIES.map(r => (
            <button
              key={r}
              onClick={() => set('rarity')(r)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-body ${
                filters.rarity === r
                  ? 'bg-electric/10 text-electric border border-electric/30'
                  : 'text-muted hover:bg-void hover:text-white border border-transparent'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Art Style */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3 font-body">
          Art Style
        </h3>
        <div className="space-y-1.5">
          {ART_STYLES.map(s => (
            <button
              key={s}
              onClick={() => set('artStyle')(s)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors font-body ${
                filters.artStyle === s
                  ? 'bg-electric/10 text-electric border border-electric/30'
                  : 'text-muted hover:bg-void hover:text-white border border-transparent'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Series */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-muted mb-3 font-body">
          Series
        </h3>
        <div className="flex gap-2">
          {SERIES.map(s => (
            <button
              key={s}
              onClick={() => set('series')(s)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors font-body ${
                filters.series === s
                  ? 'bg-electric/10 text-electric border border-electric/30'
                  : 'bg-void text-muted border border-border hover:text-white'
              }`}
            >
              S{s}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
