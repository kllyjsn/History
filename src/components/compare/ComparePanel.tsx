import { type FC, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { countries } from '../../data/countries';
import { getConflictsForCountry } from '../../data/conflicts';
import type { CountryStats } from '../../types';
import { formatNumber } from '../../utils/formatters';

interface ComparePanelProps {
  isOpen: boolean;
  onClose: () => void;
  getCountryStats: (id: string) => CountryStats;
}

function getPeaceColor(index: number): string {
  if (index >= 75) return '#22c55e';
  if (index >= 50) return '#f59e0b';
  if (index >= 25) return '#f97316';
  return '#ef4444';
}

const countryList = Object.values(countries).sort((a, b) => a.name.localeCompare(b.name));

const ComparePanel: FC<ComparePanelProps> = ({ isOpen, onClose, getCountryStats }) => {
  const [countryA, setCountryA] = useState<string>('USA');
  const [countryB, setCountryB] = useState<string>('RUS');

  const statsA = useMemo(() => getCountryStats(countryA), [countryA, getCountryStats]);
  const statsB = useMemo(() => getCountryStats(countryB), [countryB, getCountryStats]);
  const conflictsA = useMemo(() => getConflictsForCountry(countryA), [countryA]);
  const conflictsB = useMemo(() => getConflictsForCountry(countryB), [countryB]);

  const sharedConflicts = useMemo(() => {
    const idsA = new Set(conflictsA.map((c) => c.id));
    return conflictsB.filter((c) => idsA.has(c.id));
  }, [conflictsA, conflictsB]);

  const cA = countries[countryA];
  const cB = countries[countryB];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-40 overflow-y-auto bg-slate-900/98 backdrop-blur-sm"
        >
          <div className="mx-auto max-w-4xl px-6 py-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Country Comparison</h2>
              <button
                onClick={onClose}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <CountrySelector
                value={countryA}
                onChange={setCountryA}
                label="Country A"
                country={cA}
              />
              <CountrySelector
                value={countryB}
                onChange={setCountryB}
                label="Country B"
                country={cB}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <CompareCard stats={statsA} country={cA} conflicts={conflictsA} />
              <CompareCard stats={statsB} country={cB} conflicts={conflictsB} />
            </div>

            <div className="mt-6 grid grid-cols-5 gap-3">
              <MetricBar
                label="Peace Index"
                valueA={statsA.peaceIndex}
                valueB={statsB.peaceIndex}
                max={100}
                unit=""
                colorFn={getPeaceColor}
              />
              <MetricBar
                label="Total Conflicts"
                valueA={statsA.totalConflicts}
                valueB={statsB.totalConflicts}
                max={Math.max(statsA.totalConflicts, statsB.totalConflicts, 1)}
              />
              <MetricBar
                label="Years at War"
                valueA={statsA.yearsAtWar}
                valueB={statsB.yearsAtWar}
                max={Math.max(statsA.yearsAtWar, statsB.yearsAtWar, 1)}
              />
              <MetricBar
                label="Longest Peace"
                valueA={statsA.longestPeacePeriod}
                valueB={statsB.longestPeacePeriod}
                max={Math.max(statsA.longestPeacePeriod, statsB.longestPeacePeriod, 1)}
                unit=" yrs"
              />
              <MetricBar
                label="Active Conflicts"
                valueA={statsA.activeConflicts.length}
                valueB={statsB.activeConflicts.length}
                max={Math.max(statsA.activeConflicts.length, statsB.activeConflicts.length, 1)}
              />
            </div>

            {sharedConflicts.length > 0 && (
              <div className="mt-8 rounded-xl border border-amber-900/30 bg-amber-950/20 p-5">
                <h3 className="text-sm font-medium text-amber-400 mb-3">
                  Shared Conflicts ({sharedConflicts.length})
                </h3>
                <div className="space-y-2">
                  {sharedConflicts.map((c) => (
                    <div key={c.id} className="flex items-center gap-3 rounded-lg bg-slate-800/30 px-3 py-2">
                      <span className="text-xs text-slate-500 tabular-nums w-20">
                        {c.startYear}–{c.endYear ?? 'present'}
                      </span>
                      <span className="text-sm text-white">{c.name}</span>
                      {c.casualties.total && (
                        <span className="ml-auto text-xs text-red-400">
                          {formatNumber(c.casualties.total.low)}–{formatNumber(c.casualties.total.high)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function CountrySelector({
  value,
  onChange,
  label,
  country,
}: {
  value: string;
  onChange: (id: string) => void;
  label: string;
  country: (typeof countries)[string];
}) {
  return (
    <div>
      <label className="block text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</label>
      <div className="flex items-center gap-2">
        {country && <span className="text-2xl">{country.flagEmoji}</span>}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-amber-500"
        >
          {countryList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.flagEmoji} {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function CompareCard({
  stats,
  country,
  conflicts,
}: {
  stats: CountryStats;
  country: (typeof countries)[string];
  conflicts: ReturnType<typeof getConflictsForCountry>;
}) {
  const types = new Set(conflicts.map((c) => c.type));
  const peaceColor = getPeaceColor(stats.peaceIndex);
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{country.flagEmoji}</span>
        <div>
          <h3 className="text-base font-bold text-white">{country.name}</h3>
          <p className="text-[10px] text-slate-500">{country.region} · {country.subregion}</p>
        </div>
        <div className="ml-auto text-right">
          <span className="text-xl font-bold" style={{ color: peaceColor }}>{stats.peaceIndex}</span>
          <span className="text-xs text-slate-500">/100</span>
        </div>
      </div>
      <div className="text-xs text-slate-400 space-y-1">
        <p>{stats.totalConflicts} conflicts · {types.size} types</p>
        <p>{stats.yearsAtWar} years at war · {stats.yearsAtPeace} years at peace</p>
        {stats.deadliestConflict && (
          <p className="text-red-400">
            Deadliest: {stats.deadliestConflict.name}
          </p>
        )}
      </div>
    </div>
  );
}

function MetricBar({
  label,
  valueA,
  valueB,
  max,
  unit = '',
  colorFn,
}: {
  label: string;
  valueA: number;
  valueB: number;
  max: number;
  unit?: string;
  colorFn?: (v: number) => string;
}) {
  const pctA = max > 0 ? (valueA / max) * 100 : 0;
  const pctB = max > 0 ? (valueB / max) * 100 : 0;
  const colorA = colorFn ? colorFn(valueA) : '#3b82f6';
  const colorB = colorFn ? colorFn(valueB) : '#a855f7';

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-3">
      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="space-y-1.5">
        <div>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-blue-400">A</span>
            <span className="text-slate-300">{valueA}{unit}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pctA}%`, backgroundColor: colorA }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-purple-400">B</span>
            <span className="text-slate-300">{valueB}{unit}</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${pctB}%`, backgroundColor: colorB }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparePanel;
