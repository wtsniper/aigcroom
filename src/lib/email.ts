import nodemailer from 'nodemailer'

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT || '587')
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  })
}

export async function sendVerificationEmail(email: string, code: string): Promise<boolean> {
  const transporter = createTransporter()
  const fromName = process.env.EMAIL_FROM_NAME || 'AIGCRoom'
  const fromAddress = process.env.SMTP_USER || ''
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (!transporter) {
    console.warn('[Email] SMTP not configured. Verification code:', code)
    return false
  }

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verification</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;box-shadow:0 1px 4px rgba(0,0,0,.08);overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#2563eb;padding:28px 32px;">
              <a href="${siteUrl}" style="color:#fff;font-size:22px;font-weight:700;text-decoration:none;">${fromName}</a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:36px 32px 24px;">
              <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">Verify your email address</h2>
              <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
                Use the 6-digit code below to complete your registration. This code expires in <strong>10 minutes</strong>.
              </p>
              <!-- Code box -->
              <div style="background:#f0f4ff;border:2px solid #2563eb;border-radius:10px;padding:20px;text-align:center;margin:0 0 24px;">
                <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#2563eb;font-family:monospace;">${code}</span>
              </div>
              <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.6;">
                If you did not request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid #f3f4f6;padding:20px 32px;text-align:center;">
              <p style="margin:0;color:#9ca3af;font-size:12px;">
                © ${new Date().getFullYear()} ${fromName} · <a href="${siteUrl}" style="color:#6b7280;">${siteUrl.replace(/^https?:\/\//, '')}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromAddress}>`,
      to: email,
      subject: `${code} is your ${fromName} verification code`,
      html,
      text: `Your ${fromName} verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.`,
    })
    return true
  } catch (err) {
    console.error('[Email] Failed to send verification email:', err)
    return false
  }
}
