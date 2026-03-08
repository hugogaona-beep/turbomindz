'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const FAQS = [
  { q: 'Do I need crypto to buy?',         a: 'You can purchase with ETH via OpenSea, or use fiat through verified partners. We make it accessible.' },
  { q: 'What rights do I get?',            a: 'Full commercial rights to your NFT artwork. Use it in branding, products, media — it\'s yours.' },
  { q: 'How do I access Discord rooms?',   a: 'Connect your wallet. Ownership is verified automatically via Alchemy. You\'re in instantly.' },
  { q: 'Can I load services onto my NFT?', a: 'Yes. Any holder can load business services, offers, or perks onto their NFT. No permission required.' },
  { q: 'How does affiliate commission work?', a: 'Apply for the program. Get a unique referral URL. Earn commission in ETH or USD on every sale you drive.' },
  { q: 'Will there be more than 3,000 NFTs?', a: 'Each series is permanently limited. Series I: 3,000 minds. When it\'s gone, it\'s gone.' },
  { q: 'Can I sell on OpenSea?',           a: 'Yes. Your NFT and all loaded service payloads transfer to the new owner automatically.' },
  { q: 'Is this just speculation?',        a: 'No. Real business networking, live community commerce, and philosophy-driven execution. This is utility.' },
]

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="text-center mb-12">
        <p className="text-xs text-electric uppercase tracking-widest font-body mb-3">FAQ</p>
        <h2 className="font-display text-h2 font-light">Common Questions</h2>
      </div>

      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div
            key={i}
            className={cn(
              'rounded-xl border transition-colors duration-200',
              open === i ? 'border-electric/30 bg-midnight' : 'border-border bg-midnight/50'
            )}
          >
            <button
              className="w-full flex items-center justify-between px-6 py-4 text-left"
              onClick={() => setOpen(open === i ? null : i)}
            >
              <span className="font-body font-medium text-white text-sm">{faq.q}</span>
              <ChevronDown
                size={16}
                className={cn(
                  'text-muted flex-shrink-0 ml-4 transition-transform duration-200',
                  open === i && 'rotate-180 text-electric'
                )}
              />
            </button>
            {open === i && (
              <div className="px-6 pb-4">
                <p className="text-muted text-sm leading-relaxed font-body">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
