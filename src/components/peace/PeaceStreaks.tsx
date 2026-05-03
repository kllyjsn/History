import { type FC, useMemo } from 'react';
import { motion } from 'framer-motion';
import { countries } from '../../data/countries';
import { getConflictsForCountry, getActiveConflicts } from '../../data/conflicts';
import type { Country } from '../../types';

interface PeaceStreaksProps {
  onClose: () => void;
  onSelectCountry: (id: string) => void;
}

function getEffectiveStartYear(country: Country): number {
  const candidates: number[] = [];
  if (country.independence) candidates.push(country.independence);
  for (const hn of country.historicalNames) {
    candidates.push(hn.startYear);
  }
  return candidates.length > 0 ? Math.min(...candidates) : 1500;
}

function getCurrentPeaceYears(countryId: string): number {
  const conflicts = getConflictsForCountry(countryId);
  const active = conflicts.filter((c) => c.endYear === null);
  if (active.length > 0) return 0;
  if (conflicts.length === 0) {
    const country = countries[countryId];
    return country ? 2025 - getEffectiveStartYear(country) : 0;
  }
  const lastEnd = Math.max(...conflicts.map((c) => c.endYear ?? 2025));
  return 2025 - lastEnd;
}

function getLongestPeaceStreak(countryId: string): { years: number; from: number; to: number } {
  const conflicts = getConflictsForCountry(countryId);
  const country = countries[countryId];
  const startYear = country ? getEffectiveStartYear(country) : 1500;

  if (conflicts.length === 0) {
    return { years: 2025 - startYear, from: startYear, to: 2025 };
  }

  const warYears = new Set<number>();
  for (const c of conflicts) {
    const end = c.endYear ?? 2025;
    for (let y = c.startYear; y <= end; y++) warYears.add(y);
  }

  let maxYears = 0;
  let maxFrom = startYear;
  let currentFrom = startYear;
  let currentLen = 0;

  for (let y = startYear; y <= 2025; y++) {
    if (warYears.has(y)) {
      if (currentLen > maxYears) {
        maxYears = currentLen;
        maxFrom = currentFrom;
      }
      currentLen = 0;
      currentFrom = y + 1;
    } else {
      currentLen++;
    }
  }
  if (currentLen > maxYears) {
    maxYears = currentLen;
    maxFrom = currentFrom;
  }

  return { years: maxYears, from: maxFrom, to: maxFrom + maxYears - 1 };
}

const PeaceStreaks: FC<PeaceStreaksProps> = ({ onClose, onSelectCountry }) => {
  const activeSet = useMemo(() => {
    const active = getActiveConflicts();
    const s = new Set<string>();
    for (const c of active) {
      for (const p of c.parties) s.add(p.countryId);
    }
    return s;
  }, []);

  const peaceData = useMemo(() => {
    return Object.keys(countries).map((id) => ({
      id,
      country: countries[id],
      currentStreak: getCurrentPeaceYears(id),
      longestStreak: getLongestPeaceStreak(id),
      isAtPeace: !activeSet.has(id),
    }));
  }, [activeSet]);

  const longestCurrent = useMemo(
    () => [...peaceData].filter((d) => d.isAtPeace).sort((a, b) => b.currentStreak - a.currentStreak).slice(0, 20),
    [peaceData],
  );

  const longestEver = useMemo(
    () => [...peaceData].sort((a, b) => b.longestStreak.years - a.longestStreak.years).slice(0, 20),
    [peaceData],
  );

  const atPeaceCount = peaceData.filter((d) => d.isAtPeace).length;
  const atWarCount = peaceData.length - atPeaceCount;
  const maxBarCurrent = longestCurrent[0]?.currentStreak ?? 1;
  const maxBarEver = longestEver[0]?.longestStreak.years ?? 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 overflow-y-auto bg-slate-900/98 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-4xl px-3 py-4 sm:px-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-white">Peace Streaks</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {atPeaceCount} countries at peace · {atWarCount} in active conflict
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
          >
            Back to Map
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-emerald-400 mb-3">Current Peace Streaks</h3>
            <div className="space-y-1.5">
              {longestCurrent.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => onSelectCountry(d.id)}
                  className="flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-slate-800/60 transition-colors group"
                >
                  <span className="w-5 text-right text-[10px] text-slate-500 font-mono">{i + 1}</span>
                  <span className="text-sm">{d.country.flagEmoji}</span>
                  <span className="flex-1 min-w-0">
                    <span className="text-xs text-white group-hover:text-emerald-300 transition-colors truncate block">
                      {d.country.name}
                    </span>
                    <span className="block h-1.5 rounded-full bg-slate-700 mt-1 overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-emerald-500/60"
                        style={{ width: `${(d.currentStreak / maxBarCurrent) * 100}%` }}
                      />
                    </span>
                  </span>
                  <span className="text-xs font-mono text-emerald-400 shrink-0">{d.currentStreak}y</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-blue-400 mb-3">Longest Peace Periods (All Time)</h3>
            <div className="space-y-1.5">
              {longestEver.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => onSelectCountry(d.id)}
                  className="flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-slate-800/60 transition-colors group"
                >
                  <span className="w-5 text-right text-[10px] text-slate-500 font-mono">{i + 1}</span>
                  <span className="text-sm">{d.country.flagEmoji}</span>
                  <span className="flex-1 min-w-0">
                    <span className="text-xs text-white group-hover:text-blue-300 transition-colors truncate block">
                      {d.country.name}
                    </span>
                    <span className="block h-1.5 rounded-full bg-slate-700 mt-1 overflow-hidden">
                      <span
                        className="block h-full rounded-full bg-blue-500/60"
                        style={{ width: `${(d.longestStreak.years / maxBarEver) * 100}%` }}
                      />
                    </span>
                  </span>
                  <span className="text-xs text-slate-400 shrink-0">
                    <span className="font-mono text-blue-400">{d.longestStreak.years}y</span>
                    <span className="text-[10px] text-slate-500 ml-1">
                      {d.longestStreak.from}–{d.longestStreak.to}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PeaceStreaks;
