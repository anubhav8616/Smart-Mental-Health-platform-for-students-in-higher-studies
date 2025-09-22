// Vercel Serverless Function to send transactional emails via Resend API
// Requires environment variable RESEND_API_KEY

import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { to, subject, html } = req.body || {}

  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'Missing to/subject/html' })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY' })
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'MindSupport <noreply@resend.dev>',
        to: Array.isArray(to) ? to : [to],
        subject,
        html
      })
    })

    if (!response.ok) {
      const text = await response.text()
      return res.status(502).json({ error: 'Failed to send email', details: text })
    }

    const data = await response.json()
    return res.status(200).json({ ok: true, id: data?.id })
  } catch (err: any) {
    return res.status(500).json({ error: 'Unexpected error', details: err?.message || String(err) })
  }
}


