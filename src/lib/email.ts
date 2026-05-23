import { Resend } from 'resend'
import nodemailer from 'nodemailer'

// ─── Resend (推荐，免费 3000封/月，只需一个 API Key) ─────────────────────────
function getResendClient(): Resend | null {
  const key = process.env.RESEND_API_KEY
  if (!key || key === 'your-resend-api-key') return null
  return new Resend(key)
}

// ─── nodemailer fallback (SMTP — Gmail/QQ/Outlook 等) ────────────────────────
function getSmtpTransport(): ReturnType<typeof nodemailer.createTransport> | null {
  const host = process.env.SMTP_HOST
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS
  if (!host || !user || !pass) return null
  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: parseInt(process.env.SMTP_PORT || '587') === 465,
    auth: { user, pass },
  })
}

function buildHtml(code: string, siteUrl: string, fromName: string, purpose: 'register' | 'reset'): string {
  const title = purpose === 'reset' ? 'Reset your password' : 'Verify your email address'
  const body = purpose === 'reset'
    ? 'Use the 6-digit code below to reset your password. Expires in <strong>10 minutes</strong>.'
    : 'Use the 6-digit code below to complete your registration. Expires in <strong>10 minutes</strong>.'

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#2563eb;padding:28px 32px;">
          <a href="${siteUrl}" style="color:#fff;font-size:22px;font-weight:700;text-decoration:none;">${fromName}</a>
        </td></tr>
        <tr><td style="padding:36px 32px 24px;">
          <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">${title}</h2>
          <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
            ${body}
          </p>
          <div style="background:#f0f4ff;border:2px solid #2563eb;border-radius:10px;padding:20px;text-align:center;margin:0 0 24px;">
            <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#2563eb;font-family:monospace;">${code}</span>
          </div>
          <p style="margin:0;color:#9ca3af;font-size:13px;">If you did not request this, please ignore this email.</p>
        </td></tr>
        <tr><td style="border-top:1px solid #f3f4f6;padding:20px 32px;text-align:center;">
          <p style="margin:0;color:#9ca3af;font-size:12px;">© ${new Date().getFullYear()} ${fromName}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  return sendCodeEmail(email, code, 'register')
}

export async function sendPasswordResetEmail(email: string, code: string): Promise<boolean> {
  return sendCodeEmail(email, code, 'reset')
}

async function sendCodeEmail(email: string, code: string, purpose: 'register' | 'reset'): Promise<boolean> {
  const siteUrl   = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aigcroom.shop'
  const fromName  = process.env.EMAIL_FROM_NAME || 'AIGC Room'
  const fromEmail = process.env.EMAIL_FROM || 'noreply@aigcroom.shop'
  const subject   = purpose === 'reset'
    ? `${code} is your ${fromName} password reset code`
    : `${code} is your ${fromName} verification code`
  const html      = buildHtml(code, siteUrl, fromName, purpose)
  const text      = purpose === 'reset'
    ? `Your ${fromName} password reset code is: ${code}\n\nExpires in 10 minutes.`
    : `Your ${fromName} verification code is: ${code}\n\nExpires in 10 minutes.`

  // Try Resend first
  const resend = getResendClient()
  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from:    `${fromName} <${fromEmail}>`,
        to:      email,
        subject,
        html,
        text,
      })
      if (!error) return true
      console.error('[Resend] error:', error)
    } catch (err) {
      console.error('[Resend] exception:', err)
    }
  }

  // Fallback to SMTP
  const transport = getSmtpTransport()
  if (transport) {
    try {
      await transport.sendMail({
        from:    `"${fromName}" <${process.env.SMTP_USER}>`,
        to:      email,
        subject,
        html,
        text,
      })
      return true
    } catch (err) {
      console.error('[SMTP] Failed:', err)
    }
  }

  // Neither configured
  console.warn(`[Email] Not configured. Code for ${email}: ${code}`)
  return false
}
