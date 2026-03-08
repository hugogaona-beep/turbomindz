'use client'

import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

const ROTATING_QUOTES = [
  { quote: '"Know thyself."',         philosopher: 'Socrates' },
  { quote: '"Be present, be ready."', philosopher: 'Marcus Aurelius' },
  { quote: '"The obstacle is the way."', philosopher: 'Stoicism' },
  { quote: '"Amor fati."',            philosopher: 'Nietzsche' },
  { quote: '"Act. Think. Own."',      philosopher: 'TURBOMINDZ' },
]

// Floating card grid positions
const CARD_POSITIONS = [
  { top: '10%', left: '5%',  rotate: -8,  delay: 0 },
  { top: '5%',  left: '20%', rotate: 4,   delay: 0.15 },
  { top: '15%', right: '20%',rotate: -4,  delay: 0.3 },
  { top: '8%',  right: '5%', rotate: 7,   delay: 0.45 },
  { top: '55%', left: '3%',  rotate: 5,   delay: 0.6 },
  { top: '60%', right: '3%', rotate: -6,  delay: 0.75 },
]

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-16"
      style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,245,255,0.10) 0%, transparent 70%)',
      }}
    >
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Floating NFT Cards (decorative) */}
      {CARD_POSITIONS.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute hidden lg:block w-32 h-40 rounded-xl bg-midnight border border-electric/20 overflow-hidden"
          style={{ ...pos } as any}
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: [0, 0.7, 0.5],
            y: [30, 0, -8, 0],
          }}
          transition={{
            duration: 4,
            delay: pos.delay,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-3/4 bg-gradient-to-br from-electric/5 to-gold/5" />
          <div className="p-2">
            <div className="h-1.5 w-4/5 rounded-full bg-border mb-1" />
            <div className="h-1.5 w-3/5 rounded-full bg-border/60" />
          </div>
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-electric/10 border border-electric/20 text-electric text-sm font-medium mb-8"
        >
          <Sparkles size={14} />
          3,000 Exclusive NFTs — Series I
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-light text-h1 md:text-display-lg lg:text-display-xl leading-none mb-6"
        >
          Own The Philosophy.
          <br />
          <span className="text-gradient-electric">Join The Elite.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-body text-lg md:text-xl text-muted max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          3,000 exclusive NFTs merging AI art with timeless wisdom —
          for thinkers who act.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/collection/explore"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-electric text-obsidian font-semibold text-sm transition-all duration-200 hover:bg-electric/90 hover:shadow-electric"
          >
            Explore The Collection
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/community/rooms"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-void border border-border text-white font-semibold text-sm transition-all duration-200 hover:border-electric/40 hover:bg-midnight"
          >
            Join The Community
          </Link>
        </motion.div>

        {/* Rotating Quotes Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 overflow-hidden"
        >
          <div className="flex gap-12 animate-ticker whitespace-nowrap">
            {[...ROTATING_QUOTES, ...ROTATING_QUOTES].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3 text-sm text-muted">
                <span className="font-display italic text-gold/80">{item.quote}</span>
                <span className="text-border">—</span>
                <span className="font-body text-muted/70">{item.philosopher}</span>
                <span className="text-electric/30 mx-4">✦</span>
              </span>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-obsidian to-transparent pointer-events-none" />
    </section>
  )
}
