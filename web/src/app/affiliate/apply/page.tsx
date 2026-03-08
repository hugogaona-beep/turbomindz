'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { CheckCircle2, Loader2, Mic, Youtube, Twitter, Globe } from 'lucide-react'
import { cn } from '@/lib/utils'

const schema = z.object({
  platform:        z.string().min(2, 'Required'),
  audienceSize:    z.number({ coerce: true }).positive('Must be positive'),
  applicationNote: z.string().min(20, 'Please write at least 20 characters'),
  payoutWallet:    z.string().regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid ETH address'),
  payoutEmail:     z.string().email('Invalid email').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

const PLATFORMS = [
  { value: 'podcast',  label: 'Podcast',  icon: Mic },
  { value: 'youtube',  label: 'YouTube',  icon: Youtube },
  { value: 'twitter',  label: 'Twitter',  icon: Twitter },
  { value: 'blog',     label: 'Blog',     icon: Globe },
  { value: 'other',    label: 'Other',    icon: Globe },
]

export default function AffiliateApplyPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [done, setDone] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { platform: '', payoutWallet: session?.user?.walletAddress || '' }
  })

  const selectedPlatform = watch('platform')

  const onSubmit = async (data: FormData) => {
    const res = await fetch('/api/affiliate/apply', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    })
    if (res.ok) {
      setDone(true)
      toast.success('Application submitted!')
    } else if (res.status === 409) {
      toast.error('You already applied.')
    } else {
      toast.error('Failed. Please try again.')
    }
  }

  if (done) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
          <h1 className="font-display text-h2 font-light mb-3">Application Submitted</h1>
          <p className="text-muted font-body mb-6">
            We review applications within 48 hours. You'll get an email when approved.
          </p>
          <Link href="/affiliate/leaderboard"
            className="px-6 py-3 rounded-xl bg-electric text-obsidian font-semibold text-sm"
          >View Leaderboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="max-w-lg mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-xs text-electric uppercase tracking-widest font-body mb-2">Affiliate Program</p>
          <h1 className="font-display text-h1 font-light">
            Share Genius.
            <br /><span className="text-gradient-gold">Earn Real.</span>
          </h1>
          <p className="text-muted font-body mt-3 text-sm">
            Apply now — earn 10% commission on every sale you drive.
          </p>
        </div>

        {!session ? (
          <div className="p-6 rounded-xl bg-midnight border border-border text-center">
            <p className="text-muted font-body mb-4 text-sm">Connect your wallet to apply.</p>
            <Link href="/auth/connect-wallet?callbackUrl=/affiliate/apply"
              className="px-6 py-3 rounded-xl bg-electric text-obsidian font-semibold text-sm"
            >Connect Wallet</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* Platform */}
            <div>
              <label className="block text-xs text-muted uppercase tracking-wide mb-2 font-body">Your Platform *</label>
              <div className="grid grid-cols-3 gap-2">
                {PLATFORMS.map(p => {
                  const Icon = p.icon
                  return (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setValue('platform', p.value)}
                      className={cn(
                        'flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-colors',
                        selectedPlatform === p.value
                          ? 'border-electric/40 bg-electric/10 text-electric'
                          : 'border-border bg-midnight text-muted hover:text-white'
                      )}
                    >
                      <Icon size={16} />
                      {p.label}
                    </button>
                  )
                })}
              </div>
              {errors.platform && <p className="text-error text-xs mt-1">{errors.platform.message}</p>}
            </div>

            {/* Audience Size */}
            <div>
              <label className="block text-xs text-muted uppercase tracking-wide mb-1.5 font-body">Audience / Subscriber Count *</label>
              <input
                {...register('audienceSize')}
                type="number"
                placeholder="10000"
                className="w-full px-4 py-3 rounded-xl bg-midnight border border-border text-white placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 font-body"
              />
              {errors.audienceSize && <p className="text-error text-xs mt-1">{errors.audienceSize.message}</p>}
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs text-muted uppercase tracking-wide mb-1.5 font-body">Why are you a great fit? *</label>
              <textarea
                {...register('applicationNote')}
                rows={4}
                placeholder="Describe your audience, content style, and why TURBOMINDZ is a natural fit..."
                className="w-full px-4 py-3 rounded-xl bg-midnight border border-border text-white placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 font-body resize-none"
              />
              {errors.applicationNote && <p className="text-error text-xs mt-1">{errors.applicationNote.message}</p>}
            </div>

            {/* Payout Wallet */}
            <div>
              <label className="block text-xs text-muted uppercase tracking-wide mb-1.5 font-body">Payout Wallet (ETH) *</label>
              <input
                {...register('payoutWallet')}
                placeholder="0x..."
                className="w-full px-4 py-3 rounded-xl bg-midnight border border-border text-electric placeholder:text-muted text-sm font-mono focus:outline-none focus:border-electric/50"
              />
              {errors.payoutWallet && <p className="text-error text-xs mt-1">{errors.payoutWallet.message}</p>}
            </div>

            {/* Payout Email */}
            <div>
              <label className="block text-xs text-muted uppercase tracking-wide mb-1.5 font-body">Payout Email (optional)</label>
              <input
                {...register('payoutEmail')}
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-midnight border border-border text-white placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 font-body"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 disabled:opacity-60 transition-colors"
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : null}
              Apply Now — Limited Spots
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
