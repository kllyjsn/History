import { type FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Conflict } from '../../types';
import { getConflictTypeColor, getConflictTypeBadge } from '../../utils/colorScales';
import { formatDateRange, formatCasualtyRange } from '../../utils/formatters';
import { countries } from '../../data/countries';

interface ConflictTimelineProps {
  conflicts: Conflict[];
  countryId: string;
}

const ConflictTimeline: FC<ConflictTimelineProps> = ({ conflicts, countryId }) => {
  const sorted = [...conflicts].sort((a, b) => b.startYear - a.startYear);

  return (
    <div>
      <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
        Conflict Timeline ({conflicts.length})
      </h4>
      <div className="relative space-y-0">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-slate-700" />
        {sorted.map((conflict) => (
          <ConflictCard
            key={conflict.id}
            conflict={conflict}
            countryId={countryId}
          />
        ))}
      </div>
    </div>
  );
};

function ConflictCard({ conflict, countryId }: { conflict: Conflict; countryId: string }) {
  const [expanded, setExpanded] = useState(false);
  const typeColor = getConflictTypeColor(conflict.type);
  const isOngoing = conflict.endYear === null;
  const party = conflict.parties.find((p) => p.countryId === countryId);

  return (
    <div className="relative pl-8 pb-4">
      <div
        className="absolute left-1.5 top-2 h-3 w-3 rounded-full border-2"
        style={{ borderColor: typeColor, backgroundColor: isOngoing ? typeColor : 'transparent' }}
      />

      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 hover:bg-slate-800/60 transition-colors"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{conflict.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatDateRange(conflict.startYear, conflict.endYear)}
              {party?.role && (
                <span className="ml-1 text-slate-500">· {party.role}</span>
              )}
            </p>
          </div>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{ backgroundColor: `${typeColor}20`, color: typeColor }}
          >
            {getConflictTypeBadge(conflict.type)}
          </span>
        </div>

        {conflict.casualties.total && (
          <p className="text-xs text-slate-500 mt-1">
            {formatCasualtyRange(conflict.casualties.total.low, conflict.casualties.total.high)} casualties
          </p>
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-lg border border-slate-700 bg-slate-800/50 p-3 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed">{conflict.summary}</p>

              {conflict.alternateNames.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Also Known As
                  </p>
                  {conflict.alternateNames.map((an, i) => (
                    <p key={i} className="text-xs text-slate-400">
                      <span className="text-slate-300">"{an.name}"</span>
                      <span className="text-slate-500 ml-1">— {an.perspective}</span>
                    </p>
                  ))}
                </div>
              )}

              <div>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Parties
                </p>
                <div className="flex flex-wrap gap-1">
                  {conflict.parties.map((p, i) => {
                    const c = countries[p.countryId];
                    return (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-700/50 px-2 py-0.5 text-[10px]"
                        title={p.perspectiveNote}
                      >
                        {c ? (
                          <>
                            <span>{c.flagEmoji}</span>
                            <span className="text-slate-300">{c.name}</span>
                          </>
                        ) : (
                          <span className="text-slate-400">{p.countryId}</span>
                        )}
                        <span className="text-slate-500">({p.role})</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {conflict.casualties.total && (
                <div>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Casualties
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {conflict.casualties.military && (
                      <div>
                        <p className="text-slate-500">Military</p>
                        <p className="text-slate-300">
                          {formatCasualtyRange(
                            conflict.casualties.military.low,
                            conflict.casualties.military.high,
                          )}
                        </p>
                      </div>
                    )}
                    {conflict.casualties.civilian && (
                      <div>
                        <p className="text-slate-500">Civilian</p>
                        <p className="text-slate-300">
                          {formatCasualtyRange(
                            conflict.casualties.civilian.low,
                            conflict.casualties.civilian.high,
                          )}
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-slate-500">Total</p>
                      <p className="text-white font-medium">
                        {formatCasualtyRange(
                          conflict.casualties.total.low,
                          conflict.casualties.total.high,
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-600 mt-1">
                    Source: {conflict.casualties.source}
                  </p>
                </div>
              )}

              {conflict.territorialChanges && (
                <div>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Territorial Changes
                  </p>
                  <p className="text-xs text-slate-300">{conflict.territorialChanges}</p>
                </div>
              )}

              <div>
                <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                  Outcome
                </p>
                <p className="text-xs text-slate-300">{conflict.outcome}</p>
              </div>

              {conflict.perspectives.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-amber-500 uppercase tracking-wider mb-2">
                    Multiple Perspectives
                  </p>
                  <div className="space-y-2">
                    {conflict.perspectives.map((p, i) => (
                      <div
                        key={i}
                        className="rounded-md border-l-2 border-amber-600/50 bg-slate-900/50 pl-3 py-2 pr-2"
                      >
                        <p className="text-[10px] font-semibold text-amber-400">{p.viewpoint}</p>
                        <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                          {p.description}
                        </p>
                        <p className="text-[10px] text-slate-600 mt-1">{p.source}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {conflict.sources.length > 0 && (
                <div>
                  <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-1">
                    Sources
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {conflict.sources.join(' · ')}
                  </p>
                </div>
              )}

              {conflict.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {conflict.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-700/30 px-2 py-0.5 text-[10px] text-slate-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ConflictTimeline;
