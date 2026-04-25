import type { FC } from 'react';
import type { Country, CountryStats } from '../../types';
import { formatNumber, formatDateRange } from '../../utils/formatters';

interface CountryHeaderProps {
  country: Country;
  stats: CountryStats;
}

const CountryHeader: FC<CountryHeaderProps> = ({ country, stats }) => {
  const warPct = stats.totalConflicts > 0
    ? Math.round((stats.yearsAtWar / (stats.yearsAtWar + stats.yearsAtPeace)) * 100)
    : 0;

  return (
    <div>
      <div className="flex items-center gap-3">
        <span className="text-4xl">{country.flagEmoji}</span>
        <div>
          <h3 className="text-xl font-bold text-white">{country.name}</h3>
          <p className="text-sm text-slate-400">{country.region} · {country.subregion}</p>
        </div>
      </div>

      {country.historicalNames.length > 0 && (
        <div className="mt-3">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Historical Names</p>
          <div className="flex flex-wrap gap-1.5">
            {country.historicalNames.map((hn, i) => (
              <span
                key={i}
                className="inline-block rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-300"
              >
                {hn.name}
                <span className="ml-1 text-slate-500">
                  ({formatDateRange(hn.startYear, hn.endYear)})
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard
          label="Total Conflicts"
          value={stats.totalConflicts.toString()}
          accent
        />
        <StatCard
          label="Years at War"
          value={`${stats.yearsAtWar} (${warPct}%)`}
        />
        <StatCard
          label="Longest Peace"
          value={`${stats.longestPeacePeriod} yrs`}
        />
        <StatCard
          label="Active Conflicts"
          value={stats.activeConflicts.length.toString()}
          warning={stats.activeConflicts.length > 0}
        />
      </div>

      {stats.deadliestConflict && (
        <div className="mt-3 rounded-lg border border-red-900/50 bg-red-950/30 p-3">
          <p className="text-xs font-medium text-red-400 uppercase tracking-wider mb-1">
            Deadliest Conflict
          </p>
          <p className="text-sm font-semibold text-white">{stats.deadliestConflict.name}</p>
          <p className="text-xs text-red-300/70">
            {stats.deadliestConflict.casualties.total
              ? `${formatNumber(stats.deadliestConflict.casualties.total.low)}–${formatNumber(stats.deadliestConflict.casualties.total.high)} total casualties`
              : 'Casualty figures disputed'}
          </p>
        </div>
      )}
    </div>
  );
};

function StatCard({
  label,
  value,
  accent,
  warning,
}: {
  label: string;
  value: string;
  accent?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p
        className={`text-lg font-bold ${
          warning ? 'text-red-400' : accent ? 'text-amber-400' : 'text-white'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default CountryHeader;
