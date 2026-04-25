import type { FC } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid,
} from 'recharts';
import type { Conflict } from '../../types';
import { getConflictTypeColor, getConflictTypeBadge } from '../../utils/colorScales';
import { formatDateRange, formatCasualtyRange } from '../../utils/formatters';

interface TrendsDashboardProps {
  conflictsByDecade: { decade: number; count: number }[];
  conflictsByType: { type: string; count: number }[];
  deadliestConflicts: Conflict[];
  totalConflicts: number;
  activeConflicts: number;
  onClose: () => void;
}

const TrendsDashboard: FC<TrendsDashboardProps> = ({
  conflictsByDecade,
  conflictsByType,
  deadliestConflicts,
  totalConflicts,
  activeConflicts,
  onClose,
}) => {
  const recentDecades = conflictsByDecade.filter((d) => d.decade >= 1800);

  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-slate-900/98 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-3 py-4 sm:px-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-8 gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-white">Global Trends</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Patterns across {totalConflicts} recorded conflicts · {activeConflicts} ongoing
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
          >
            Back to Map
          </button>
        </div>

        {/* Key insight */}
        <div className="mb-4 sm:mb-8 rounded-xl border border-amber-800/30 bg-amber-950/20 p-3 sm:p-5">
          <h3 className="text-sm font-medium text-amber-400 mb-2">Key Insight: The Paradox of Modern Peace</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            While interstate wars between major powers have declined dramatically since 1945 (the "Long Peace"),
            civil wars, proxy conflicts, and non-state violence have proliferated. The total number of active
            conflicts globally is near its highest point since WWII. Peace between great powers coexists with
            widespread suffering in smaller, often resource-rich nations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Conflicts by Decade */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-3 sm:p-5">
            <h3 className="text-sm font-medium text-white mb-1">Conflicts by Decade</h3>
            <p className="text-xs text-slate-500 mb-3 sm:mb-4">New conflicts starting per decade (1800–present)</p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={recentDecades} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="decade"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(v: number) => `${v}s`}
                  interval={2}
                />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  labelStyle={{ color: '#e2e8f0' }}
                  itemStyle={{ color: '#f59e0b' }}
                  labelFormatter={(v) => `${v}s`}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Conflict Types */}
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-3 sm:p-5">
            <h3 className="text-sm font-medium text-white mb-1">Conflict Types</h3>
            <p className="text-xs text-slate-500 mb-3 sm:mb-4">Distribution across all recorded conflicts</p>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <ResponsiveContainer width="100%" height={180} className="sm:!w-1/2">
                <PieChart>
                  <Pie
                    data={conflictsByType}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    strokeWidth={1}
                    stroke="#0f172a"
                  >
                    {conflictsByType.map((entry) => (
                      <Cell key={entry.type} fill={getConflictTypeColor(entry.type)} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-1 sm:gap-x-0 sm:space-y-1.5">
                {conflictsByType.map((entry) => (
                  <div key={entry.type} className="flex items-center gap-2 text-xs">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: getConflictTypeColor(entry.type) }}
                    />
                    <span className="text-slate-300">{getConflictTypeBadge(entry.type)}</span>
                    <span className="text-slate-500">({entry.count})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deadliest Conflicts */}
        <div className="mt-4 sm:mt-6 rounded-xl border border-slate-700 bg-slate-800/30 p-3 sm:p-5">
          <h3 className="text-sm font-medium text-white mb-1">Deadliest Conflicts</h3>
          <p className="text-xs text-slate-500 mb-3 sm:mb-4">Ranked by highest estimated total casualties</p>
          <div className="space-y-2">
            {deadliestConflicts.map((c, i) => {
              const maxCasualties = deadliestConflicts[0]?.casualties.total?.high ?? 1;
              const thisHigh = c.casualties.total?.high ?? 0;
              const pct = (thisHigh / maxCasualties) * 100;

              return (
                <div key={c.id} className="flex items-center gap-2 sm:gap-3">
                  <span className="w-5 sm:w-6 text-right text-[10px] sm:text-xs text-slate-500 font-mono shrink-0">
                    {i + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm text-white font-medium truncate">
                        {c.name}
                      </span>
                      <span className="text-[9px] sm:text-[10px] text-slate-500 shrink-0 hidden sm:inline">
                        {formatDateRange(c.startYear, c.endYear)}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: getConflictTypeColor(c.type),
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[10px] sm:text-xs text-slate-400 tabular-nums shrink-0">
                    {c.casualties.total
                      ? formatCasualtyRange(c.casualties.total.low, c.casualties.total.high)
                      : '—'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peace Patterns insight */}
        <div className="mt-4 sm:mt-6 rounded-xl border border-slate-700 bg-slate-800/30 p-3 sm:p-5">
          <h3 className="text-sm font-medium text-white mb-3">Conditions That Produce Peace</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <InsightCard
              title="Economic Interdependence"
              description="Nations with strong bilateral trade relationships are significantly less likely to go to war with each other. The EU project is the most successful example."
              source="Oneal & Russett (1999)"
            />
            <InsightCard
              title="Democratic Peace"
              description="Established democracies virtually never go to war with each other. However, transitioning democracies are more conflict-prone than stable autocracies."
              source="Doyle (1983); Mansfield & Snyder (2005)"
            />
            <InsightCard
              title="International Institutions"
              description="Multilateral organizations (UN, regional bodies) reduce conflict through mediation, norms, and collective security — though enforcement remains uneven."
              source="Russett & Oneal (2001)"
            />
          </div>
        </div>

        <div className="mt-6 sm:mt-8 text-center text-xs text-slate-600 pb-6 sm:pb-8">
          <p>
            Data curated from the Correlates of War Project, Uppsala Conflict Data Program (UCDP),
            Global Peace Index, and peer-reviewed academic sources. All conflict data is presented
            with multiple perspectives and source attribution.
          </p>
        </div>
      </div>
    </div>
  );
};

function InsightCard({
  title,
  description,
  source,
}: {
  title: string;
  description: string;
  source: string;
}) {
  return (
    <div className="rounded-lg border border-green-900/30 bg-green-950/20 p-4">
      <h4 className="text-xs font-semibold text-green-400 mb-1">{title}</h4>
      <p className="text-xs text-slate-300 leading-relaxed">{description}</p>
      <p className="text-[10px] text-slate-600 mt-2">{source}</p>
    </div>
  );
}

export default TrendsDashboard;
