// Append UTM tracking params to outbound links so partner sites can see
// traffic coming from this directory in their analytics.
//
// Convention:
//   utm_source   = bengaluru-events.sagarjethi.com  (host)
//   utm_medium   = referral
//   utm_campaign = <context>           e.g. event-card, event-detail, social-buzz
//   utm_content  = <slug or label>     optional, narrows attribution further
//
// Behaviour:
//   - Internal URLs (relative or our own host) are returned untouched
//   - External URLs preserve existing query params
//   - If the URL already has utm_source, we DO NOT overwrite — caller may have
//     a paid campaign tag we shouldn't clobber
//   - Anchor / mailto / tel / javascript: schemes are returned untouched

const SELF_HOSTS = new Set([
  'bengaluru-events.sagarjethi.com',
  'sagarjethi.com',
  'www.sagarjethi.com',
]);

const SOURCE = 'bengaluru-events.sagarjethi.com';

export function addUtm(url, campaign, content) {
  if (!url || typeof url !== 'string') return url;
  // Skip non-http(s) schemes and same-page anchors
  if (/^(mailto:|tel:|javascript:|#|\/|\.)/i.test(url)) return url;

  let u;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  if (!/^https?:$/.test(u.protocol)) return url;
  if (SELF_HOSTS.has(u.host)) return url;
  if (u.searchParams.has('utm_source')) return url; // don't clobber existing

  u.searchParams.set('utm_source', SOURCE);
  u.searchParams.set('utm_medium', 'referral');
  if (campaign) u.searchParams.set('utm_campaign', campaign);
  if (content) u.searchParams.set('utm_content', content);
  return u.toString();
}

// Convenience: build a campaign string from a route + element name
export function utm(url, ctx) {
  if (!ctx) return addUtm(url);
  const campaign = ctx.campaign || ctx;
  const content = ctx.content;
  return addUtm(url, campaign, content);
}
