import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const PHILOSOPHERS = [
  { name: 'Marcus Aurelius', era: 'Roman Stoic' },
  { name: 'Socrates',        era: 'Ancient Greek' },
  { name: 'Nietzsche',       era: 'German Idealist' },
  { name: 'Epictetus',       era: 'Stoic' },
  { name: 'Aristotle',       era: 'Ancient Greek' },
  { name: 'Seneca',          era: 'Roman Stoic' },
]

const QUOTES = [
  'The obstacle is the way.',
  'Know thyself.',
  'What stands in the way becomes the way.',
  'We suffer more in imagination than in reality.',
  'Excellence is never an accident.',
  'To be is to do.',
]

const ART_STYLES = ['Baroque', 'Minimalist', 'Cyberpunk', 'Oil Painting', 'Abstract']
const RARITIES   = ['COMMON', 'COMMON', 'COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY']

async function main() {
  console.log('Seeding database...')

  // Seed 20 sample NFTs
  for (let i = 1; i <= 20; i++) {
    const philosopher = PHILOSOPHERS[i % PHILOSOPHERS.length]
    const rarity      = RARITIES[i % RARITIES.length]

    await prisma.nFT.upsert({
      where:  { tokenId: i },
      update: {},
      create: {
        tokenId:         i,
        ownerWallet:     '0x0000000000000000000000000000000000000000',
        imageUrl:        `https://picsum.photos/seed/${i}/400/400`,
        ipfsHash:        `QmPlaceholder${i}`,
        quoteText:       QUOTES[i % QUOTES.length],
        philosopherName: philosopher.name,
        philosopherEra:  philosopher.era,
        artStyle:        ART_STYLES[i % ART_STYLES.length],
        series:          1,
        rarity,
        openSeaUrl:      `https://opensea.io/assets/ethereum/0x0000000000000000000000000000000000000000/${i}`,
      },
    })
  }

  // Seed platform stats
  await prisma.platformStats.upsert({
    where:  { id: 1 },
    update: {},
    create: {
      id:               1,
      totalMembers:     847,
      totalNFTs:        3000,
      totalListings:    124,
      totalVolume:      312.5,
      floorPrice:       0.085,
      totalDiscussions: 2841,
    },
  })

  // Seed rooms
  const rooms = [
    { slug: 'stoicism',           name: 'Stoicism',           category: 'PHILOSOPHY', discordChannelId: null },
    { slug: 'business-networking',name: 'Business Networking',category: 'BUSINESS',   discordChannelId: null },
    { slug: 'general',            name: 'General',            category: 'GENERAL',    discordChannelId: null, isGated: false },
  ]

  for (const room of rooms) {
    await prisma.discussionRoom.upsert({
      where:  { slug: room.slug },
      update: {},
      create: {
        slug:     room.slug,
        name:     room.name,
        category: room.category,
        isGated:  (room as any).isGated ?? true,
      },
    })
  }

  // Seed upcoming drop
  await prisma.drop.upsert({
    where:  { seriesNumber: 1 },
    update: {},
    create: {
      seriesNumber: 1,
      name:         'Series I — The Stoics',
      description:  '3,000 AI-generated portraits of history\'s greatest stoic minds.',
      nftCount:     3000,
      releaseDate:  new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      priceEth:     0.085,
      priceUsd:     220,
      status:       'UPCOMING',
    },
  })

  console.log('Seed complete!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
