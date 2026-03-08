'use client'

import { useListingForm } from '@/hooks/useListingForm'
import { cn } from '@/lib/utils'
import {
  Tag, Briefcase, Gift, Users,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2
} from 'lucide-react'

const LISTING_TYPES = [
  { value: 'NFT_SALE',       label: 'NFT Sale',        icon: Tag,      desc: 'Sell or auction a TURBOMINDZ NFT' },
  { value: 'SERVICE',        label: 'Service',         icon: Briefcase,desc: 'Offer a professional service' },
  { value: 'BUSINESS_OFFER', label: 'Business Offer',  icon: Gift,     desc: 'Exclusive deal for members' },
  { value: 'COLLABORATION',  label: 'Collaboration',   icon: Users,    desc: 'Find a partner or co-founder' },
] as const

const STEPS = ['Type', 'Details', 'Pricing', 'Preview']

export function ListingCreateForm() {
  const { form, step, setStep, goNext, goBack, canGoBack, submit, currentStepIndex } = useListingForm()
  const { register, watch, setValue, handleSubmit, formState: { errors } } = form
  const data = watch()

  if (step === 'SUCCESS') {
    return (
      <div className="text-center py-16">
        <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-light text-white mb-2">Listing Created!</h2>
        <p className="text-muted font-body">Redirecting to marketplace...</p>
      </div>
    )
  }

  return (
    <div>
      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={cn(
              'flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors flex-shrink-0',
              i < currentStepIndex ? 'bg-green-400 text-obsidian' :
              i === currentStepIndex ? 'bg-electric text-obsidian' :
              'bg-void border border-border text-muted'
            )}>
              {i < currentStepIndex ? <CheckCircle2 size={14} /> : i + 1}
            </div>
            <span className={cn(
              'text-xs font-body hidden sm:block',
              i === currentStepIndex ? 'text-white' : 'text-muted'
            )}>{s}</span>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-border" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(submit)}>

        {/* ── STEP 1: TYPE ── */}
        {step === 'TYPE' && (
          <div className="space-y-3">
            <h2 className="font-display text-xl font-light text-white mb-4">What are you listing?</h2>
            {LISTING_TYPES.map(type => {
              const Icon    = type.icon
              const selected = data.listingType === type.value
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setValue('listingType', type.value)}
                  className={cn(
                    'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-150',
                    selected
                      ? 'border-electric/50 bg-electric/5'
                      : 'border-border bg-midnight hover:border-border/80'
                  )}
                >
                  <div className={cn(
                    'p-2.5 rounded-lg border',
                    selected ? 'bg-electric/10 border-electric/30 text-electric' : 'bg-void border-border text-muted'
                  )}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className={cn('font-medium text-sm', selected ? 'text-electric' : 'text-white')}>
                      {type.label}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{type.desc}</p>
                  </div>
                  {selected && <CheckCircle2 size={16} className="text-electric ml-auto" />}
                </button>
              )
            })}
          </div>
        )}

        {/* ── STEP 2: DETAILS ── */}
        {step === 'DETAILS' && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-light text-white mb-4">Listing Details</h2>

            <div>
              <label className="block text-xs text-muted uppercase tracking-wide mb-1.5 font-body">Title *</label>
              <input
                {...register('title')}
                placeholder="e.g. 1-hour business strategy session"
                className="w-full px-4 py-3 rounded-xl bg-midnight border border-border text-white placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 transition-colors font-body"
              />
              {errors.title && <p className="text-error text-xs mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <label className="block text-xs text-muted uppercase tracking-wide mb-1.5 font-body">Description *</label>
              <textarea
                {...register('description')}
                rows={5}
                placeholder="Describe what you're offering, who it's for, and what they get..."
                className="w-full px-4 py-3 rounded-xl bg-midnight border border-border text-white placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 transition-colors font-body resize-none"
              />
              {errors.description && <p className="text-error text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div>
              <label className="block text-xs text-muted uppercase tracking-wide mb-1.5 font-body">Contact Email</label>
              <input
                {...register('contactEmail')}
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl bg-midnight border border-border text-white placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 transition-colors font-body"
              />
            </div>

            <div>
              <label className="block text-xs text-muted uppercase tracking-wide mb-1.5 font-body">External URL</label>
              <input
                {...register('externalUrl')}
                type="url"
                placeholder="https://your-website.com"
                className="w-full px-4 py-3 rounded-xl bg-midnight border border-border text-white placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 transition-colors font-body"
              />
            </div>
          </div>
        )}

        {/* ── STEP 3: PRICING ── */}
        {step === 'PRICING' && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-light text-white mb-4">Set Your Price</h2>
            <p className="text-muted text-sm font-body -mt-2 mb-4">Leave blank for "Contact for pricing".</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-muted uppercase tracking-wide mb-1.5 font-body">Price in ETH</label>
                <div className="relative">
                  <input
                    {...register('priceEth', { valueAsNumber: true })}
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="0.085"
                    className="w-full pl-4 pr-12 py-3 rounded-xl bg-midnight border border-border text-electric placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 transition-colors font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted">ETH</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-muted uppercase tracking-wide mb-1.5 font-body">Price in USD</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm">$</span>
                  <input
                    {...register('priceUsd', { valueAsNumber: true })}
                    type="number"
                    step="1"
                    min="0"
                    placeholder="220"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-midnight border border-border text-white placeholder:text-muted text-sm focus:outline-none focus:border-electric/50 transition-colors font-body"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 4: PREVIEW ── */}
        {step === 'PREVIEW' && (
          <div className="space-y-5">
            <h2 className="font-display text-xl font-light text-white mb-4">Review Your Listing</h2>
            <div className="p-6 rounded-xl bg-midnight border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full bg-electric/10 border border-electric/30 text-electric text-xs font-semibold">
                  {data.listingType?.replace('_', ' ')}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Title</p>
                <p className="font-medium text-white">{data.title}</p>
              </div>
              <div>
                <p className="text-xs text-muted mb-1">Description</p>
                <p className="text-sm text-muted leading-relaxed">{data.description}</p>
              </div>
              {(data.priceEth || data.priceUsd) && (
                <div>
                  <p className="text-xs text-muted mb-1">Price</p>
                  <p className="font-mono text-electric">
                    {data.priceEth ? `${data.priceEth} ETH` : ''}
                    {data.priceEth && data.priceUsd ? ' / ' : ''}
                    {data.priceUsd ? `$${data.priceUsd}` : ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            type="button"
            onClick={goBack}
            disabled={!canGoBack}
            className={cn(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-colors',
              canGoBack
                ? 'border-border bg-void text-white hover:border-electric/40'
                : 'opacity-0 pointer-events-none'
            )}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          {step === 'PREVIEW' ? (
            <button
              type="submit"
              className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
            >
              <CheckCircle2 size={16} />
              Publish Listing
            </button>
          ) : step === 'SUBMITTING' ? (
            <div className="flex items-center gap-2 text-muted text-sm">
              <Loader2 size={16} className="animate-spin text-electric" />
              Publishing...
            </div>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-electric text-obsidian font-semibold text-sm hover:bg-electric/90 transition-colors"
            >
              Continue
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
