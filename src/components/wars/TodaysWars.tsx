import type { FC } from 'react';
import { motion } from 'framer-motion';
import { getActiveConflicts } from '../../data/conflicts';
import { countries } from '../../data/countries';
import { getConflictTypeColor, getConflictTypeBadge } from '../../utils/colorScales';
import { formatCasualtyRange } from '../../utils/formatters';

interface TodaysWarsProps {
  onClose: () => void;
  onSelectCountry: (id: string) => void;
}

const TodaysWars: FC<TodaysWarsProps> = ({ onClose, onSelectCountry }) => {
  const active = getActiveConflicts().sort((a, b) => {
    const aCas = a.casualties.total?.high ?? 0;
    const bCas = b.casualties.total?.high ?? 0;
    return bCas - aCas;
  });

  const totalCountries = new Set<string>();
  for (const c of active) {
    for (const p of c.parties) totalCountries.add(p.countryId);
  }

  const totalCasualties = active.reduce((sum, c) => sum + (c.casualties.total?.high ?? 0), 0);

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
            <h2 className="text-lg sm:text-2xl font-bold text-white">Today's Wars</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {active.length} active conflicts · {totalCountries.size} countries affected
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
          >
            Back to Map
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <StatBox label="Active Conflicts" value={active.length.toString()} color="text-red-400" />
          <StatBox label="Countries Affected" value={totalCountries.size.toString()} color="text-amber-400" />
          <StatBox label="Estimated Casualties" value={totalCasualties > 0 ? formatCasualtyRange(0, totalCasualties) : 'Unknown'} color="text-red-300" />
          <StatBox label="Longest Running" value={active.length > 0 ? `${2025 - Math.min(...active.map(c => c.startYear))} yrs` : '—'} color="text-blue-400" />
        </div>

        <div className="mb-4 rounded-xl border border-red-900/30 bg-red-950/20 p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-red-300/80 leading-relaxed">
            These are conflicts with no recorded end date in our dataset. Some may have active ceasefires
            or reduced intensity. Data reflects scholarly consensus, not real-time reporting.
          </p>
        </div>

        <div className="space-y-3">
          {active.map((conflict) => {
            const typeColor = getConflictTypeColor(conflict.type);
            return (
              <div
                key={conflict.id}
                className="rounded-xl border border-slate-700 bg-slate-800/30 p-4 hover:bg-slate-800/60 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-white">{conflict.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Since {conflict.startYear} · {2025 - conflict.startYear} years
                    </p>
                  </div>
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{ backgroundColor: `${typeColor}20`, color: typeColor }}
                  >
                    {getConflictTypeBadge(conflict.type)}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">{conflict.summary}</p>

                {conflict.casualties.total && (
                  <p className="text-xs text-red-400/70 mb-2">
                    {formatCasualtyRange(conflict.casualties.total.low, conflict.casualties.total.high)} estimated casualties
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {conflict.parties.map((p, i) => {
                    const country = countries[p.countryId];
                    if (!country) return null;
                    return (
                      <button
                        key={i}
                        onClick={() => onSelectCountry(p.countryId)}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px] hover:bg-slate-600/50 transition-colors"
                      >
                        <span>{country.flagEmoji}</span>
                        <span className="text-slate-300">{country.name}</span>
                        <span className="text-slate-500">· {p.role}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

function StatBox({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3 text-center">
      <p className={`text-lg sm:text-xl font-bold ${color}`}>{value}</p>
      <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">{label}</p>
    </div>
  );
}

export default TodaysWars;
