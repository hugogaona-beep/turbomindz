'use client'

import useSWR from 'swr'
import { formatUsd } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, TrendingUp, Users, DollarSign } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export default function AffiliateDashboardPage() {
  const { data, isLoading } = useSWR('/api/affiliate/stats', fetcher)
  const [copied, setCopied] = useState(false)

  const copyLink = () => {
    if (data?.referralUrl) {
      navigator.clipboard.writeText(data.referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => <div key={i} className="h-24 rounded-xl skeleton" />)}
      </div>
    )
  }

  if (!data?.affiliate) {
    return (
      <div className="text-center py-24 border border-dashed border-border rounded-2xl">
        <h2 className="font-display text-2xl font-light mb-2">Not enrolled yet</h2>
        <p className="text-muted text-sm mb-6 font-body">Apply to the affiliate program and start earning.</p>
        <Link href="/affiliate/apply"
          className="px-6 py-3 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
        >
          Apply Now
        </Link>
      </div>
    )
  }

  const { affiliate, referralUrl, dailyData } = data
  const chartData = (dailyData || []).map((d: any) => ({
    date:  new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sales: d._count?.id || 0,
    earned: d._sum?.commissionUsd || 0,
  }))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-h2 font-light">Affiliate Dashboard</h1>
        <p className="text-muted text-sm mt-1 font-body">
          Status: <span className={affiliate.status === 'APPROVED' ? 'text-green-400' : 'text-gold'}>
            {affiliate.status}
          </span>
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Users,       label: 'Total Referrals', value: affiliate.totalReferrals, color: 'text-electric' },
          { icon: DollarSign,  label: 'Total Earned',    value: formatUsd(affiliate.totalEarnedUsd), color: 'text-gold' },
          { icon: TrendingUp,  label: 'Pending Payout',  value: formatUsd(affiliate.pendingUsd), color: 'text-green-400' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className="p-5 rounded-xl bg-midnight border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className={s.color} />
                <p className="text-xs text-muted uppercase tracking-wide font-body">{s.label}</p>
              </div>
              <p className={`font-display text-2xl font-light ${s.color}`}>{s.value}</p>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="p-6 rounded-xl bg-midnight border border-border">
          <h3 className="font-body font-semibold text-white mb-4">30-Day Performance</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{ fill: '#8888A8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#8888A8', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: '#1C1C2E', border: '1px solid #2A2A3E', borderRadius: '8px', color: '#F8F8FF' }}
              />
              <Line type="monotone" dataKey="earned" stroke="#00F5FF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Referral Link + QR */}
      <div className="p-6 rounded-xl bg-midnight border border-border">
        <h3 className="font-body font-semibold text-white mb-4">Your Referral Link</h3>
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-void border border-border font-mono text-sm text-electric mb-3 overflow-hidden">
              <span className="truncate">{referralUrl}</span>
              <button
                onClick={copyLink}
                className="flex-shrink-0 p-1 rounded hover:bg-electric/10 transition-colors"
              >
                {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-xs text-muted font-body">
              Commission rate: <span className="text-electric">{(affiliate.commissionRate * 100).toFixed(0)}%</span> per sale
            </p>
          </div>
          {referralUrl && (
            <div className="p-3 rounded-xl bg-white">
              <QRCodeSVG value={referralUrl} size={80} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
