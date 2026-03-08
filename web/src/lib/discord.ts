// Discord Bot utilities

const DISCORD_BASE = 'https://discord.com/api/v10'
const BOT_TOKEN    = process.env.DISCORD_BOT_TOKEN ?? ''
const GUILD_ID     = process.env.DISCORD_GUILD_ID  ?? ''

const botHeaders = {
  Authorization:  `Bot ${BOT_TOKEN}`,
  'Content-Type': 'application/json',
}

/** Assign Verified Holder role to a Discord user */
export async function assignVerifiedRole(discordUserId: string): Promise<boolean> {
  const ROLE_ID = process.env.DISCORD_VERIFIED_ROLE_ID ?? ''
  const res = await fetch(
    `${DISCORD_BASE}/guilds/${GUILD_ID}/members/${discordUserId}/roles/${ROLE_ID}`,
    { method: 'PUT', headers: botHeaders }
  )
  return res.ok || res.status === 204
}

/** Remove Verified Holder role (e.g. when NFT sold) */
export async function removeVerifiedRole(discordUserId: string): Promise<boolean> {
  const ROLE_ID = process.env.DISCORD_VERIFIED_ROLE_ID ?? ''
  const res = await fetch(
    `${DISCORD_BASE}/guilds/${GUILD_ID}/members/${discordUserId}/roles/${ROLE_ID}`,
    { method: 'DELETE', headers: botHeaders }
  )
  return res.ok || res.status === 204
}

/** Fetch recent messages from a Discord channel */
export async function getChannelMessages(channelId: string, limit = 50) {
  const res = await fetch(
    `${DISCORD_BASE}/channels/${channelId}/messages?limit=${limit}`,
    { headers: botHeaders }
  )
  if (!res.ok) return []
  return res.json()
}

/** Post a message to a Discord channel (as bot) */
export async function postToChannel(channelId: string, content: string): Promise<any> {
  const res = await fetch(
    `${DISCORD_BASE}/channels/${channelId}/messages`,
    {
      method:  'POST',
      headers: botHeaders,
      body:    JSON.stringify({ content }),
    }
  )
  if (!res.ok) throw new Error(`Discord post failed: ${res.status}`)
  return res.json()
}

/** Get all channels in the guild */
export async function getGuildChannels() {
  const res = await fetch(
    `${DISCORD_BASE}/guilds/${GUILD_ID}/channels`,
    { headers: botHeaders }
  )
  if (!res.ok) return []
  return res.json()
}

/** Send a DM to a user via bot */
export async function sendDirectMessage(discordUserId: string, content: string): Promise<boolean> {
  // Create DM channel
  const dmRes = await fetch(`${DISCORD_BASE}/users/@me/channels`, {
    method:  'POST',
    headers: botHeaders,
    body:    JSON.stringify({ recipient_id: discordUserId }),
  })
  if (!dmRes.ok) return false
  const { id: channelId } = await dmRes.json()

  // Send message
  const msgRes = await fetch(`${DISCORD_BASE}/channels/${channelId}/messages`, {
    method:  'POST',
    headers: botHeaders,
    body:    JSON.stringify({ content }),
  })
  return msgRes.ok
}
