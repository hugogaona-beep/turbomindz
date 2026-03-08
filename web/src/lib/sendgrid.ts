import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM = {
  email: process.env.SENDGRID_FROM_EMAIL ?? 'hello@turbomindz.com',
  name:  process.env.SENDGRID_FROM_NAME  ?? 'TURBOMINDZ',
}

export async function sendWelcomeEmail(to: string, username: string) {
  return sgMail.send({
    to,
    from: FROM,
    subject: 'Welcome to TURBOMINDZ — Own The Philosophy.',
    html: `
      <div style="background:#0A0A0F;color:#F8F8FF;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#00F5FF;font-size:32px;margin-bottom:16px;">Welcome, ${username || 'Philosopher'}.</h1>
        <p style="color:#8888A8;font-size:16px;line-height:1.6;">
          You've joined an exclusive community of thinkers who act.
          Your TURBOMINDZ NFT is more than art — it's your key to the inner circle.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
           style="display:inline-block;background:#00F5FF;color:#0A0A0F;padding:14px 28px;border-radius:8px;font-weight:600;margin-top:24px;text-decoration:none;">
          Enter Your Vault
        </a>
      </div>
    `,
  })
}

export async function sendDropAlertEmail(to: string, dropName: string, releaseDate: string) {
  return sgMail.send({
    to,
    from: FROM,
    subject: `DROP ALERT: ${dropName} — TURBOMINDZ`,
    html: `
      <div style="background:#0A0A0F;color:#F8F8FF;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#FFD700;font-size:28px;">New Drop: ${dropName}</h1>
        <p style="color:#8888A8;font-size:16px;line-height:1.6;">
          The next TURBOMINDZ series drops on <strong style="color:#F8F8FF;">${releaseDate}</strong>.
          Don't miss your chance to own a piece of philosophy.
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/drops"
           style="display:inline-block;background:#FFD700;color:#0A0A0F;padding:14px 28px;border-radius:8px;font-weight:600;margin-top:24px;text-decoration:none;">
          View Drop Details
        </a>
      </div>
    `,
  })
}

export async function sendAffiliateApprovalEmail(to: string, referralCode: string) {
  return sgMail.send({
    to,
    from: FROM,
    subject: 'You\'re Approved — TURBOMINDZ Affiliate Program',
    html: `
      <div style="background:#0A0A0F;color:#F8F8FF;font-family:sans-serif;padding:40px;max-width:600px;margin:0 auto;">
        <h1 style="color:#00F5FF;font-size:28px;">Welcome to the Affiliate Program</h1>
        <p style="color:#8888A8;font-size:16px;">Your referral code:
          <strong style="color:#FFD700;font-size:20px;">${referralCode}</strong>
        </p>
        <p style="color:#8888A8;font-size:16px;line-height:1.6;">
          Share your link: <code style="color:#00F5FF;">${process.env.NEXT_PUBLIC_APP_URL}?ref=${referralCode}</code>
        </p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/affiliate/portal"
           style="display:inline-block;background:#00F5FF;color:#0A0A0F;padding:14px 28px;border-radius:8px;font-weight:600;margin-top:24px;text-decoration:none;">
          Open Your Portal
        </a>
      </div>
    `,
  })
}
