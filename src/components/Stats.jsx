import { events, CATEGORIES } from '../data/events';

const INR_PER_USD = 85;

function parsePrize(prize) {
  if (!prize) return { usd: 0, inr: 0 };
  const match = prize.match(/([$₹])([\d,]+)/);
  if (!match) return { usd: 0, inr: 0 };
  const amount = parseInt(match[2].replace(/,/g, ''), 10);
  return match[1] === '$' ? { usd: amount, inr: 0 } : { usd: 0, inr: amount };
}

function formatUsdCompact(n) {
  if (n >= 1000) return `$${Math.round(n / 1000)}K+`;
  return `$${n}+`;
}

export default function Stats() {
  const freeEvents = events.filter(e => e.cost === 'Free' || e.cost.toLowerCase().includes('free')).length;
  const hackathons = events.filter(e => e.category === 'hackathon').length;
  const conferences = events.filter(e => e.category === 'conference').length;

  const prizeTotals = events.reduce(
    (acc, e) => {
      const { usd, inr } = parsePrize(e.prize);
      acc.usd += usd;
      acc.inr += inr;
      if (e.prize) acc.count += 1;
      return acc;
    },
    { usd: 0, inr: 0, count: 0 }
  );

  const totalUsdEquivalent = prizeTotals.usd + Math.round(prizeTotals.inr / INR_PER_USD);
  const totalPrize = formatUsdCompact(totalUsdEquivalent);

  const stats = [
    { value: events.length + '+', label: 'Events', color: 'from-primary-500 to-primary-600' },
    { value: freeEvents, label: 'Free Events', color: 'from-emerald-500 to-emerald-600' },
    { value: hackathons, label: 'Hackathons', color: 'from-violet-500 to-violet-600' },
    { value: totalPrize, label: 'Total Prizes', color: 'from-amber-500 to-amber-600' },
  ];

  const inrLakhs = prizeTotals.inr >= 100000
    ? `₹${(prizeTotals.inr / 100000).toFixed(prizeTotals.inr % 100000 === 0 ? 0 : 2)}L`
    : prizeTotals.inr > 0
      ? `₹${prizeTotals.inr.toLocaleString('en-IN')}`
      : null;
  const usdCompact = prizeTotals.usd >= 1000
    ? `$${Math.round(prizeTotals.usd / 1000)}K`
    : prizeTotals.usd > 0
      ? `$${prizeTotals.usd}`
      : null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 text-center shadow-sm">
            <div className={`text-3xl font-bold bg-gradient-to-r ${stat.color} text-transparent bg-clip-text`}>
              {stat.value}
            </div>
            <div className="text-sm text-slate-500 mt-1 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
      {prizeTotals.count > 0 && (
        <div className="mt-4 text-center text-xs sm:text-sm text-slate-500">
          Across <span className="font-semibold text-slate-700">{prizeTotals.count} hackathons</span> with prize pools
          {usdCompact && inrLakhs
            ? <> — <span className="font-semibold text-slate-700">{usdCompact} cash/credits + {inrLakhs} INR</span></>
            : usdCompact
              ? <> — <span className="font-semibold text-slate-700">{usdCompact} cash/credits</span></>
              : inrLakhs
                ? <> — <span className="font-semibold text-slate-700">{inrLakhs} INR</span></>
                : null}
        </div>
      )}
    </section>
  );
}
