import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Transparency Reports — TURBOMINDZ' }

const REPORTS = [
  {
    month: 'February 2026',
    stats: [
      { label: 'New Members',    value: '47'    },
      { label: 'Total Volume',   value: '31 ETH' },
      { label: 'Floor Price',    value: '0.085 ETH' },
      { label: 'Listings Posted',value: '23'    },
      { label: 'Affiliate Payouts', value: '$840' },
      { label: 'Discord Messages', value: '2,841' },
    ],
  },
]

export default function TransparencyPage() {
  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <p className="text-xs text-electric uppercase tracking-widest font-body mb-2">About</p>
        <h1 className="font-display text-h1 font-light mb-3">Transparency Reports</h1>
        <p className="text-muted font-body mb-12">
          We publish monthly metrics so the community can track platform health.
        </p>

        <div className="space-y-6">
          {REPORTS.map(report => (
            <div key={report.month} className="p-6 rounded-xl bg-midnight border border-border">
              <h2 className="font-display text-xl font-light text-white mb-6">{report.month}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {report.stats.map(s => (
                  <div key={s.label} className="p-3 rounded-lg bg-void border border-border">
                    <p className="text-xs text-muted uppercase tracking-wide font-body mb-1">{s.label}</p>
                    <p className="font-display text-xl font-light text-electric">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
