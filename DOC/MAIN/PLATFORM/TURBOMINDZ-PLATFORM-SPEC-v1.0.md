# TURBOMINDZ NFT — COMPLETE PLATFORM SPECIFICATION v1.0
# Generated: 2026-03-07
# Status: Ready for Figma Make + Development Implementation

---

## PART 1 — SYSTEMS ARCHITECT: TECHNICAL BLUEPRINT

### 1. INFORMATION ARCHITECTURE — Full Sitemap

```
turbomindz.com/
│
├── / (Home)
│   ├── Hero + Manifesto
│   ├── Featured NFT Gallery (live feed)
│   ├── Community Stats (members, NFTs, discussions)
│   └── CTA: Join / Explore Collection
│
├── /collection
│   ├── /collection/explore          — Public browsable gallery (all 3,000)
│   ├── /collection/[tokenId]        — Single NFT page (quote, art, owner, traits)
│   └── /collection/my-vault         — Auth: Owner's personal NFT collection
│
├── /marketplace
│   ├── /marketplace/listings        — Member-listed NFTs + services
│   ├── /marketplace/offers          — Member business offers / perks
│   ├── /marketplace/[listingId]     — Single listing detail
│   └── /marketplace/create          — Auth: Create new listing
│
├── /community
│   ├── /community/rooms             — Discord-mirrored room index
│   ├── /community/rooms/[roomId]    — Live Discord channel embed (NFT-gated)
│   ├── /community/philosophy        — Philosophy Challenge board
│   ├── /community/business          — Member business promotion board
│   └── /community/members           — Member directory
│
├── /dashboard
│   ├── /dashboard/vault             — My NFTs
│   ├── /dashboard/listings          — My marketplace listings
│   ├── /dashboard/messages          — Notifications + DMs
│   ├── /dashboard/perks             — Loaded services on my NFTs
│   └── /dashboard/affiliate         — Commission tracking + referral links
│
├── /affiliate
│   ├── /affiliate/apply             — Podcaster / promoter signup
│   ├── /affiliate/portal            — Auth: Dashboard for affiliates
│   └── /affiliate/leaderboard       — Top earners (public)
│
├── /drops
│   ├── /drops/upcoming              — Next release countdown
│   └── /drops/archive               — Past drop history
│
├── /about
│   ├── /about/manifesto             — Philosophy + mission
│   ├── /about/team                  — Founding team
│   └── /about/transparency          — Monthly transparency reports
│
├── /auth
│   ├── /auth/connect-wallet
│   ├── /auth/register
│   ├── /auth/login
│   └── /auth/recovery
│
└── /legal
    ├── /legal/terms
    ├── /legal/privacy
    └── /legal/nft-ownership-rights
```

---

### 2. USER JOURNEY MAPPING

**PATH A — New Visitor → NFT Purchaser**
Landing (Hero) → Scroll Featured Gallery → Click single NFT → View quote + community preview → CTA: "Own This Mind" → Connect Wallet → OpenSea purchase → Return to /dashboard/vault → Join Discord room

**PATH B — NFT Owner → Active Community Member**
/auth/connect-wallet → Wallet verified → /dashboard/vault → Click NFT → "Enter Discussion Room" → /community/rooms/[roomId] → Post first message → Discover /marketplace/offers → Load service onto NFT → Post to marketplace

**PATH C — Affiliate/Promoter → Commission Earner**
/affiliate/apply → Submit info → Approved → Referral URL → /affiliate/portal → Share links → Referral purchases → Commission tracked → Monthly payout

---

### 3. DATA ARCHITECTURE

```
USER: id, wallet_address, email, username, avatar, discord_id, role, join_date, referral_code
NFT: token_id, owner_wallet, image_url, ipfs_hash, quote_text, philosopher_name, art_style, series, traits, opensea_url, mint_date
NFT_SERVICE_PAYLOAD: id, nft_token_id, loaded_by_wallet, service_type, description, provider, expiry_date, claimed_by_wallet
LISTING: id, seller_wallet, nft_token_id, listing_type, title, description, price_usd, price_eth, status
DISCUSSION_POST: id, room_id, author_wallet, content, media_urls, parent_post_id, likes, discord_message_id
AFFILIATE: id, user_id, referral_code, commission_rate, total_referrals, total_earned_usd, payout_wallet
DROP: id, series_number, nft_count, release_date, price_eth, status
MEMBER_OFFER: id, member_wallet, business_name, offer_title, description, discount_percent, valid_for, expiry_date
```

---

### 4. API SURFACE

```
POST /api/auth/wallet-verify
POST /api/auth/register
GET  /api/auth/me

GET  /api/nfts                     (paginated, filtered)
GET  /api/nfts/:tokenId
GET  /api/nfts/owner/:wallet
POST /api/nfts/:tokenId/payload
GET  /api/nfts/:tokenId/payload

GET    /api/listings
POST   /api/listings
PATCH  /api/listings/:id
DELETE /api/listings/:id
POST   /api/listings/:id/contact

GET  /api/rooms
GET  /api/rooms/:roomId/messages
POST /api/rooms/:roomId/messages

POST /api/affiliate/apply
GET  /api/affiliate/stats
GET  /api/affiliate/leaderboard
POST /api/affiliate/track

GET  /api/drops
GET  /api/drops/upcoming
POST /api/drops/notify
```

**Integrations:** OpenSea API | Discord Bot API | Alchemy (on-chain) | Pinata (IPFS) | Stripe | SendGrid

---

### 5. COMPONENT INVENTORY (35 Components)

1. NavBar — sticky, wallet connect, notifications
2. WalletConnectModal — MetaMask, WalletConnect, Coinbase
3. HeroSection — animated NFT showcase + CTAs
4. NFTCard — thumbnail, quote, philosopher, price
5. NFTGalleryGrid — masonry, infinite scroll
6. NFTDetailPanel — art, quote, traits, owner, history
7. PhilosopherBadge — portrait + attribution
8. TraitPills — rarity chips
9. CollectionVault — personal owner view
10. ServicePayloadCard — loaded services on NFT
11. LoadServiceModal — multi-step service loader
12. MarketplaceListingCard — listing preview
13. ListingCreateForm — multi-step create
14. MemberOfferCard — business offer display
15. DiscordRoomList — gated channel index
16. DiscordChatEmbed — live mirrored chat
17. MessageBubble — chat message
18. PhilosophyChallengePost — rich text discussion
19. MemberCard — profile card
20. AffiliateDashboard — stats, chart, referral link
21. AffiliateLeaderboard — top earners table
22. DropCountdownTimer — real-time countdown
23. DropCard — drop preview
24. NotificationToast — real-time alerts
25. FilterSidebar — faceted search filters
26. SearchBar — full-text search
27. StatsBanner — live platform metrics
28. TransparencyReport — monthly metrics card
29. AuthGuard — wallet + NFT ownership gate
30. OnboardingFlow — new member wizard
31. PriceTicker — ETH/USD + floor price
32. ShareButton — social sharing
33. RichTextEditor — markdown composer
34. ImageUploader — drag-drop + IPFS
35. Footer — nav, legal, newsletter

---

### 6. TECHNOLOGY STACK

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS Variables |
| Animations | Framer Motion |
| Web3 | Wagmi + Viem + RainbowKit |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | NextAuth.js + SIWE |
| Storage | Pinata (IPFS) |
| Discord | Discord.js Bot |
| Search | Algolia |
| Email | SendGrid |
| Payments | Stripe + ETH native |
| Hosting | Vercel |
| CDN | Cloudflare |
| Monitoring | Sentry + Vercel Analytics |

---

### 7. PERFORMANCE TARGETS

| Metric | Target |
|--------|--------|
| LCP | < 1.8s |
| INP | < 100ms |
| CLS | < 0.1 |
| TTFB | < 200ms |
| Lighthouse Performance | ≥ 92 |
| Lighthouse SEO | ≥ 98 |

---

### 8. SEO FRAMEWORK

URL pattern: /collection/0042, /community/rooms/stoicism
Title: `{Quote Snippet} — TURBOMINDZ #{tokenId}`
Schema: Product (NFT pages), Organization (home), FAQPage, BreadcrumbList, Event (drops)

---

## PART 2 — VISUAL SYSTEM ARCHITECT: DESIGN SYSTEM

### Color System
```
Brand Electric:  #00F5FF   (primary accent)
Brand Gold:      #FFD700   (secondary accent)
Obsidian:        #0A0A0F   (bg primary)
Midnight:        #12121A   (bg surface)
Void:            #1C1C2E   (bg elevated)
Text Primary:    #F8F8FF
Text Muted:      #8888A8
Border:          #2A2A3E
Success:         #00E676
Error:           #FF1744
```

### Typography Scale
```
T1 Display XL:  96px  / Cormorant Garamond 300  — Hero
T2 Display L:   72px  / Cormorant Garamond 300  — Section head
T3 H1:          56px  / Cormorant Garamond 400  — Page title
T4 H2:          40px  / Cormorant Garamond 400  — Section title
T5 H3:          28px  / DM Sans 500             — Card head
T6 H4:          20px  / DM Sans 600             — Sub-section
T7 Body L:      18px  / DM Sans 400             — Long-form
T8 Body:        16px  / DM Sans 400             — Default
T9 Caption:     13px  / DM Sans 400             — Labels
```

### Spacing (8px grid)
```
--space-1: 4px  --space-2: 8px   --space-3: 12px  --space-4: 16px
--space-5: 24px --space-6: 32px  --space-8: 48px  --space-10: 64px
--space-12: 80px --space-16: 128px
```

### Motion
```
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)
--dur-fast: 150ms  --dur-normal: 250ms  --dur-slow: 400ms
Page load stagger: 60ms delay per card
NFT hover glow: box-shadow 0 0 24px rgba(0,245,255,0.35)
```

### Breakpoints
```
sm: 640px  md: 768px  lg: 1024px  xl: 1280px  2xl: 1536px
```

### Accessibility
- Electric on Obsidian: 12.4:1 contrast ✓
- Gold on Obsidian: 11.1:1 contrast ✓
- WCAG AA compliant throughout
- prefers-reduced-motion respected

### Design Tokens (JSON)
```json
{
  "color": {
    "brand-electric": { "value": "#00F5FF" },
    "brand-gold": { "value": "#FFD700" },
    "bg-primary": { "value": "#0A0A0F" },
    "bg-surface": { "value": "#12121A" },
    "text-primary": { "value": "#F8F8FF" },
    "text-muted": { "value": "#8888A8" }
  },
  "font": {
    "display": { "value": "Cormorant Garamond, serif" },
    "body": { "value": "DM Sans, sans-serif" }
  },
  "space": {
    "4": { "value": "16px" }, "6": { "value": "32px" }, "10": { "value": "64px" }
  }
}
```

### CSS Variables
```css
:root {
  --color-electric: #00F5FF;
  --color-gold: #FFD700;
  --color-obsidian: #0A0A0F;
  --color-midnight: #12121A;
  --color-void: #1C1C2E;
  --color-text: #F8F8FF;
  --color-text-muted: #8888A8;
  --color-border: #2A2A3E;
  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'DM Sans', system-ui, sans-serif;
  --ease-out: cubic-bezier(0.25, 1, 0.5, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

---

## PART 3 — CONVERSION COPY ARCHITECT

### Home — Hero
H1: "Own The Philosophy. Join The Elite."
Sub: "3,000 exclusive NFTs merging AI art with timeless wisdom — for thinkers who act."
CTA Primary: [EXPLORE THE COLLECTION]
CTA Secondary: [JOIN THE COMMUNITY]

### Feature Blocks
1. "Your NFT. Your Rights. Your Legacy." — Full commercial rights, tradeable, loadable with services.
2. "Access The Room Where Ideas Compound." — Discord-gated rooms for verified holders only.
3. "Turn Wisdom Into Commerce." — Load NFTs with luxury services, trade in the member marketplace.

### Collection Page
H2: "3,000 Minds. One Collection."
Body: Every piece unrepeatable. When this series sells out, it never returns.
CTA: [FIND YOUR PHILOSOPHER]

### Affiliate Page
H2: "Share Genius. Earn Real."
Sub: Podcasters and creators earn commission on every sale they drive.
CTA: [APPLY NOW — LIMITED SPOTS]

### FAQ (8 Questions)
1. Crypto required? → ETH via OpenSea or fiat via verified partners.
2. What rights do I get? → Full commercial rights.
3. How do I access Discord rooms? → Connect wallet, ownership verified automatically.
4. Can I load services onto any NFT? → Yes, no permission required.
5. How does affiliate commission work? → Unique URL, ETH or USD payout.
6. More than 3,000 NFTs? → Each series permanently limited.
7. Can I sell on OpenSea? → Yes, service payloads transfer to new owner.
8. Just speculation? → No — real business networking, commerce, and community.

---

## PART 4 — INTERACTION SYSTEMS ENGINEER

### Module 1 — Multi-Step Listing Form
States: IDLE → STEP_1_TYPE → STEP_2_DETAILS → STEP_3_PRICING → STEP_4_PREVIEW → SUBMITTING → SUCCESS|ERROR
Steps: Type selection → Dynamic fields → Price (ETH+USD) → Preview → Confirm

### Module 2 — NFT Marketplace Search
States: IDLE → LOADING → RESULTS|EMPTY|ERROR
Filters: Type | Price range | Series | Philosopher | Sort
Pagination: Infinite scroll, intersection observer
Loading: 12 skeleton cards

### Module 3 — Authentication
States: UNAUTHENTICATED → WALLET_CONNECTING → SIGNING → VERIFYING → AUTHENTICATED|FAILED
Session: JWT httpOnly cookie, NFT re-verified on session start via Alchemy

### Module 4 — Member Dashboard
Vault: NFT grid + slide-over detail panel + LoadServiceModal
Listings: CRUD table, inline edit, bulk delete
Affiliate: Stats cards + Recharts line graph + QR code referral link
Data: SWR with optimistic updates + rollback on error

### Module 5 — Discord Room Chat
States: CHECKING_OWNERSHIP → UNLOCKED|LOCKED
Real-time: Supabase Realtime WebSocket, 5s polling fallback
Rate limit: 1 message/2s with visual cooldown bar

### React Hooks
```
useWallet()         — connection, address, chain, sign
useNFTOwnership()   — owned tokens, verification
useDiscordRoom()    — messages, send, WebSocket
useMarketplace()    — listings CRUD, filters, pagination
useAffiliate()      — stats, referral link, payouts
useListingForm()    — multi-step form state, validation
```

---

## PART 5 — FIGMA MAKE PROMPTS

### PROMPT 1 — HOMEPAGE
Create a luxury Web3 NFT homepage with a dark, editorial aesthetic. Background: #0A0A0F, accent: #00F5FF, highlights: #FFD700. Typography: Cormorant Garamond display, DM Sans body. Include: 1) Full-viewport hero with 6 animated rotating NFT cards, headline "Own The Philosophy. Join The Elite." in 96px Cormorant, dual CTAs. 2) Live stats counter bar. 3) Featured NFT horizontal scroll (6 cards, lift+glow hover). 4) 3-column "How It Works". 5) Gold drop countdown with pulse animation. 6) Dark footer. Full mobile responsiveness. Staggered 60ms card reveal on load.

### PROMPT 2 — NFT DETAIL PAGE
Split-panel luxury layout. Left (60%): Full-height NFT art with grain overlay and electric cyan gradient border. Right (40%): #12121A surface with gold series badge, 40px Cormorant italic quote in gold, philosopher portrait, rarity trait pills, wallet address, service payloads accordion, "Own This Mind" CTA. Below fold: Discussion preview tab + Related NFTs grid. Dark mode only.

### PROMPT 3 — COMMUNITY / DISCORD ROOMS
Dark editorial community hub. Header: "The Inner Circle" + wallet status chip. Room grid (3-col desktop): locked cards with frosted blur + lock icon, unlocked with electric glow border. Pinned Philosophy Challenge card in gold. Member offers masonry below. Iris wipe unlock animation 500ms. Filter tabs: All | Philosophy | Business | General.

### PROMPT 4 — MEMBER DASHBOARD
Dark dashboard: 240px fixed left sidebar (#0A0A0F) with electric active states + wallet display. Main tabs: Vault (NFT masonry grid + slide-over detail panel), Listings (data table with status badges, inline edit), Affiliate (stats cards + 30-day electric line chart + QR referral link). Skeleton shimmer loading. Mobile: sidebar → bottom tab bar.

### PROMPT 5 — MARKETPLACE
High-density dark marketplace. Left filter sidebar (280px): type toggles, electric dual-handle price slider, series/philosopher checkboxes, sort dropdown, applied filter chips. Main grid (4-col): listing cards with type badge pills, seller info, ETH price large + USD muted, hover "View Offer" CTA. Infinite scroll + skeleton. Empty state: illustration + reset button. Filter changes: 200ms opacity transition.

---

## IMPLEMENTATION PRIORITY ORDER

1. Auth system (wallet connect + SIWE)
2. NFT collection pages (public, SEO-critical)
3. Discord bot + room gating
4. Member dashboard + vault
5. Marketplace (listings + search)
6. Affiliate portal
7. Drop system + countdown
8. Analytics + transparency reports
