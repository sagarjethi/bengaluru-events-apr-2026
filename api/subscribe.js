// Vercel serverless function — proxies email subscriptions to Beehiiv.
//
// Required environment variables (set in Vercel dashboard):
//   BEEHIIV_API_KEY        — your Beehiiv API key
//   BEEHIIV_PUBLICATION_ID — your publication ID (starts with "pub_")
//
// If env vars are not set, it logs the email and returns success
// (prevents UX from breaking during initial setup).

export default async function handler(req, res) {
  // CORS + method guards
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, source = 'unknown', tag } = req.body || {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId = process.env.BEEHIIV_PUBLICATION_ID;

  // Graceful fallback if Beehiiv not configured yet
  if (!apiKey || !pubId) {
    console.log('[subscribe] Beehiiv not configured. Email captured:', { email, source, tag });
    return res.status(200).json({
      ok: true,
      message: 'Subscribed (dev mode)',
      dev: true,
    });
  }

  try {
    const beehiivRes = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          reactivate_existing: true,
          send_welcome_email: true,
          utm_source: source,
          utm_medium: 'website',
          utm_campaign: 'bengaluru-events-apr-2026',
          ...(tag ? { custom_fields: [{ name: 'interest', value: tag }] } : {}),
        }),
      }
    );

    const data = await beehiivRes.json();

    if (!beehiivRes.ok) {
      console.error('[subscribe] Beehiiv error:', data);
      return res.status(502).json({
        error: data.errors?.[0]?.message || 'Failed to subscribe',
      });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[subscribe] Unexpected error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
}
