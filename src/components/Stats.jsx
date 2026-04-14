import { events, CATEGORIES } from '../data/events';

export default function Stats() {
  const freeEvents = events.filter(e => e.cost === 'Free' || e.cost.toLowerCase().includes('free')).length;
  const hackathons = events.filter(e => e.category === 'hackathon').length;
  const conferences = events.filter(e => e.category === 'conference').length;
  const totalPrize = '$145K+';

  const stats = [
    { value: events.length + '+', label: 'Events', color: 'from-primary-500 to-primary-600' },
    { value: freeEvents, label: 'Free Events', color: 'from-emerald-500 to-emerald-600' },
    { value: hackathons, label: 'Hackathons', color: 'from-violet-500 to-violet-600' },
    { value: totalPrize, label: 'Total Prizes', color: 'from-amber-500 to-amber-600' },
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
    </section>
  );
}
