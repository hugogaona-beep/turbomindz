import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        electric:  '#00F5FF',
        gold:      '#FFD700',
        obsidian:  '#0A0A0F',
        midnight:  '#12121A',
        void:      '#1C1C2E',
        surface:   '#12121A',
        border:    '#2A2A3E',
        muted:     '#8888A8',
        success:   '#00E676',
        error:     '#FF1744',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body:    ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['6rem',   { lineHeight: '1.0', letterSpacing: '-0.02em' }],
        'display-lg': ['4.5rem', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h1':         ['3.5rem', { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
        'h2':         ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.01em' }],
        'h3':         ['1.75rem',{ lineHeight: '1.3' }],
        'h4':         ['1.25rem',{ lineHeight: '1.4' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'glow-pulse':    'glow-pulse 2s ease-in-out infinite',
        'float':         'float 6s ease-in-out infinite',
        'shimmer':       'shimmer 2s linear infinite',
        'spin-slow':     'spin 8s linear infinite',
        'fade-up':       'fade-up 0.6s ease forwards',
        'iris-wipe':     'iris-wipe 0.5s ease forwards',
        'ticker':        'ticker 30s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0,245,255,0.3)' },
          '50%':       { boxShadow: '0 0 40px rgba(0,245,255,0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'iris-wipe': {
          '0%':   { clipPath: 'circle(0% at 50% 50%)' },
          '100%': { clipPath: 'circle(150% at 50% 50%)' },
        },
        'ticker': {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      backgroundImage: {
        'grid-pattern':    "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232A2A3E' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'noise':           "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
        'electric-gradient': 'linear-gradient(135deg, #00F5FF 0%, #0080FF 100%)',
        'gold-gradient':     'linear-gradient(135deg, #FFD700 0%, #FF8C00 100%)',
        'hero-gradient':     'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,245,255,0.12) 0%, transparent 70%)',
      },
      boxShadow: {
        'electric':  '0 0 24px rgba(0,245,255,0.35)',
        'electric-lg':'0 0 48px rgba(0,245,255,0.5)',
        'gold':      '0 0 24px rgba(255,215,0,0.35)',
        'card':      '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':'0 8px 48px rgba(0,0,0,0.6)',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'spring':    'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
