import { Shield, MessageSquare, TrendingUp } from 'lucide-react'

const STEPS = [
  {
    icon:  Shield,
    title: 'Your NFT. Your Rights. Your Legacy.',
    body:  'Full commercial rights, freely tradeable, and loadable with real business services. Every TURBOMINDZ is yours to use, build on, and pass forward.',
    color: 'text-electric',
    bg:    'bg-electric/10 border-electric/20',
  },
  {
    icon:  MessageSquare,
    title: 'Access The Room Where Ideas Compound.',
    body:  'Discord-gated rooms for verified holders only. Deep philosophy, live business networking, and peer accountability — for thinkers who act.',
    color: 'text-gold',
    bg:    'bg-gold/10 border-gold/20',
  },
  {
    icon:  TrendingUp,
    title: 'Turn Wisdom Into Commerce.',
    body:  'Load your NFT with luxury services, post business offers, and trade in the member marketplace. Philosophy has never been this profitable.',
    color: 'text-green-400',
    bg:    'bg-green-400/10 border-green-400/20',
  },
]

export function HowItWorks() {
  return (
    <section className="py-24 bg-midnight/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-xs text-electric uppercase tracking-widest font-body mb-3">How It Works</p>
          <h2 className="font-display text-h2 font-light">
            More Than Art.
            <br />
            <span className="text-gradient-electric">A Platform For Builders.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            return (
              <div
                key={i}
                className="relative p-8 rounded-2xl bg-midnight border border-border hover:border-electric/20 transition-colors duration-300 group"
              >
                {/* Number */}
                <span className="absolute top-6 right-6 font-display text-6xl font-light text-border/50 select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className={`inline-flex p-3 rounded-xl border mb-6 ${step.bg}`}>
                  <Icon size={24} className={step.color} />
                </div>

                <h3 className="font-display text-xl font-light mb-3 text-white leading-snug">
                  {step.title}
                </h3>
                <p className="text-muted text-sm leading-relaxed font-body">
                  {step.body}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
