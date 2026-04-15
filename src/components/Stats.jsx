import {
  EVENT_COUNT,
  FREE_COUNT,
  HACKATHON_COUNT,
  TOTAL_PRIZE_LABEL,
  PRIZE_TOTALS,
  PRIZE_USD_COMPACT,
  PRIZE_INR_COMPACT,
} from '../utils/stats';

export default function Stats() {
  const stats = [
    { value: `${EVENT_COUNT}+`, label: 'Events', color: 'from-primary-500 to-primary-600' },
    { value: FREE_COUNT, label: 'Free Events', color: 'from-emerald-500 to-emerald-600' },
    { value: HACKATHON_COUNT, label: 'Hackathons', color: 'from-violet-500 to-violet-600' },
    { value: TOTAL_PRIZE_LABEL, label: 'Total Prizes', color: 'from-amber-500 to-amber-600' },
  ];

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
      {PRIZE_TOTALS.count > 0 && (
        <div className="mt-4 text-center text-xs sm:text-sm text-slate-500">
          Across <span className="font-semibold text-slate-700">{PRIZE_TOTALS.count} hackathons</span> with prize pools
          {PRIZE_USD_COMPACT && PRIZE_INR_COMPACT
            ? <> — <span className="font-semibold text-slate-700">{PRIZE_USD_COMPACT} cash/credits + {PRIZE_INR_COMPACT} INR</span></>
            : PRIZE_USD_COMPACT
              ? <> — <span className="font-semibold text-slate-700">{PRIZE_USD_COMPACT} cash/credits</span></>
              : PRIZE_INR_COMPACT
                ? <> — <span className="font-semibold text-slate-700">{PRIZE_INR_COMPACT} INR</span></>
                : null}
        </div>
      )}
    </section>
  );
}
