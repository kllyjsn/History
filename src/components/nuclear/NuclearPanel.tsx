import { type FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  nuclearPrograms,
  formerNuclearStates,
  natoNuclearSharing,
  nuclearUmbrella,
  getNuclearStatus,
  type NuclearProgram,
  type DeliverySystem,
} from '../../data/nuclear';
import { countries } from '../../data/countries';

interface NuclearPanelProps {
  countryId: string;
}

function formatWarheadBar(value: number, max: number): string {
  const pct = Math.min((value / max) * 100, 100);
  return `${pct}%`;
}

const DeliverySystemCard: FC<{ system: DeliverySystem }> = ({ system }) => {
  const typeColors: Record<string, string> = {
    ICBM: 'bg-red-500/20 text-red-400',
    SLBM: 'bg-blue-500/20 text-blue-400',
    bomber: 'bg-amber-500/20 text-amber-400',
    tactical: 'bg-orange-500/20 text-orange-400',
    cruise_missile: 'bg-purple-500/20 text-purple-400',
    artillery: 'bg-slate-500/20 text-slate-400',
  };

  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-800/40 p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-white text-sm">{system.name}</span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${typeColors[system.type] ?? 'bg-slate-600 text-slate-300'}`}>
          {system.type.replace('_', ' ').toUpperCase()}
        </span>
      </div>
      <p className="text-xs text-slate-400 mb-2">{system.details}</p>
      <div className="flex gap-3 text-[10px] text-slate-500">
        {system.range_km > 0 && <span>Range: {system.range_km.toLocaleString()} km</span>}
        {system.warheads > 0 && <span>Warheads: {system.warheads}</span>}
      </div>
    </div>
  );
};

const NuclearPanelContent: FC<{ program: NuclearProgram }> = ({ program }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');
  const maxWarheads = 5580; // Russia

  const toggle = (section: string) =>
    setExpandedSection((prev) => (prev === section ? null : section));

  return (
    <div className="space-y-3">
      {/* Warhead Overview */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">☢</span>
          <h3 className="text-sm font-semibold text-white">Nuclear Arsenal</h3>
        </div>

        <div className="text-3xl font-bold text-red-400 mb-1">
          {program.totalWarheads.toLocaleString()}
          <span className="text-sm font-normal text-slate-400 ml-2">total warheads</span>
        </div>

        {/* Warhead bar relative to largest arsenal */}
        <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: formatWarheadBar(program.totalWarheads, maxWarheads) }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-red-500/10 p-2">
            <div className="text-lg font-bold text-red-400">{program.deployedWarheads.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">Deployed</div>
          </div>
          <div className="rounded-lg bg-amber-500/10 p-2">
            <div className="text-lg font-bold text-amber-400">{program.reserveWarheads.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">Reserve</div>
          </div>
          <div className="rounded-lg bg-slate-500/10 p-2">
            <div className="text-lg font-bold text-slate-400">{program.retiredAwaitingDismantlement.toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">Retired</div>
          </div>
        </div>
      </div>

      {/* Doctrine */}
      <button onClick={() => toggle('doctrine')} className="w-full text-left rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">🎯</span>
            <h3 className="text-sm font-semibold text-white">Doctrine: {program.doctrine}</h3>
          </div>
          <span className="text-slate-400 text-xs">{expandedSection === 'doctrine' ? '▼' : '▶'}</span>
        </div>
        <AnimatePresence>
          {expandedSection === 'doctrine' && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="text-xs text-slate-300 mt-2 leading-relaxed overflow-hidden"
            >
              {program.doctrineDetails}
            </motion.p>
          )}
        </AnimatePresence>
      </button>

      {/* First & Largest Tests */}
      <div className="grid grid-cols-2 gap-2">
        {program.firstTest && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">First Test</div>
            <div className="text-sm font-medium text-white">{program.firstTest.name}</div>
            <div className="text-xs text-slate-400">{program.firstTest.year}</div>
            <div className="text-xs text-amber-400">{program.firstTest.yield_kt >= 1000 ? `${(program.firstTest.yield_kt / 1000).toFixed(1)} Mt` : `${program.firstTest.yield_kt} kt`}</div>
            <div className="text-[10px] text-slate-500 mt-1">{program.firstTest.location}</div>
          </div>
        )}
        {program.largestTest && (
          <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-3">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Largest Test</div>
            <div className="text-sm font-medium text-white">{program.largestTest.name}</div>
            <div className="text-xs text-slate-400">{program.largestTest.year}</div>
            <div className="text-xs text-red-400 font-medium">{program.largestTest.yield_kt >= 1000 ? `${(program.largestTest.yield_kt / 1000).toFixed(1)} Mt` : `${program.largestTest.yield_kt} kt`}</div>
            <div className="text-[10px] text-slate-500 mt-1">{program.largestTest.location}</div>
          </div>
        )}
      </div>

      {/* Delivery Systems */}
      <button onClick={() => toggle('delivery')} className="w-full text-left rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">🚀</span>
            <h3 className="text-sm font-semibold text-white">Delivery Systems ({program.deliverySystems.length})</h3>
          </div>
          <span className="text-slate-400 text-xs">{expandedSection === 'delivery' ? '▼' : '▶'}</span>
        </div>
        <AnimatePresence>
          {expandedSection === 'delivery' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 mt-3 overflow-hidden"
            >
              {program.deliverySystems.map((sys) => (
                <DeliverySystemCard key={sys.name} system={sys} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Treaties */}
      {program.treaties.length > 0 && (
        <button onClick={() => toggle('treaties')} className="w-full text-left rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm">📜</span>
              <h3 className="text-sm font-semibold text-white">Treaties ({program.treaties.length})</h3>
            </div>
            <span className="text-slate-400 text-xs">{expandedSection === 'treaties' ? '▼' : '▶'}</span>
          </div>
          <AnimatePresence>
            {expandedSection === 'treaties' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 mt-3 overflow-hidden"
              >
                {program.treaties.map((t) => (
                  <div key={t.name} className="flex items-start gap-2 rounded-lg border border-slate-700/50 bg-slate-800/40 p-2">
                    <span className={`mt-0.5 inline-block h-2 w-2 rounded-full flex-shrink-0 ${
                      t.status === 'active' ? 'bg-green-400' :
                      t.status === 'expired' ? 'bg-red-400' :
                      t.status === 'withdrawn' ? 'bg-orange-400' :
                      'bg-yellow-400'
                    }`} />
                    <div>
                      <div className="text-xs font-medium text-white">{t.name} ({t.year})</div>
                      <div className="text-[10px] text-slate-400">{t.description}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      )}

      {/* Program Timeline */}
      <button onClick={() => toggle('timeline')} className="w-full text-left rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 hover:bg-slate-800/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">📅</span>
            <h3 className="text-sm font-semibold text-white">Program Timeline ({program.timeline.length})</h3>
          </div>
          <span className="text-slate-400 text-xs">{expandedSection === 'timeline' ? '▼' : '▶'}</span>
        </div>
        <AnimatePresence>
          {expandedSection === 'timeline' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-0 mt-3 overflow-hidden"
            >
              {program.timeline.map((event, i) => (
                <div key={`${event.year}-${i}`} className="flex gap-3 pb-3 relative">
                  <div className="flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-red-400 flex-shrink-0 mt-1" />
                    {i < program.timeline.length - 1 && <div className="w-px flex-1 bg-slate-700" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-red-400">{event.year}</span>
                    <p className="text-xs text-slate-300">{event.event}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Notes */}
      {program.notes && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs">⚠</span>
            <span className="text-[10px] text-amber-400 font-medium uppercase tracking-wider">Key Notes</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{program.notes}</p>
        </div>
      )}
    </div>
  );
};

const NuclearPanel: FC<NuclearPanelProps> = ({ countryId }) => {
  const program = nuclearPrograms[countryId];
  const formerState = formerNuclearStates[countryId];
  const isNatoSharing = natoNuclearSharing.includes(countryId);
  const status = getNuclearStatus(countryId);

  // Find which nuclear umbrella this country is under
  const umbrellaProvider = Object.entries(nuclearUmbrella).find(([, covered]) =>
    covered.includes(countryId),
  );

  if (status === 'none' && !umbrellaProvider) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">☢</span>
        <h3 className="text-base font-bold text-white">Nuclear Status</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
          status === 'declared' ? 'bg-red-500/20 text-red-400' :
          status === 'undeclared' ? 'bg-orange-500/20 text-orange-400' :
          status === 'nato_sharing' ? 'bg-blue-500/20 text-blue-400' :
          status === 'former' ? 'bg-purple-500/20 text-purple-400' :
          status === 'abandoned' ? 'bg-green-500/20 text-green-400' :
          'bg-slate-500/20 text-slate-400'
        }`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      {program && <NuclearPanelContent program={program} />}

      {formerState && (
        <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
          <div className="text-sm font-medium text-purple-400 mb-1">Former Nuclear State ({formerState.years})</div>
          <p className="text-xs text-slate-300">{formerState.details}</p>
        </div>
      )}

      {isNatoSharing && !program && (
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="text-sm font-medium text-blue-400 mb-1">NATO Nuclear Sharing</div>
          <p className="text-xs text-slate-300">
            Hosts US B61 tactical nuclear bombs under NATO nuclear sharing arrangements.
            In wartime, these weapons would be delivered by {countries[countryId]?.name}'s own aircraft under dual-key authorization.
          </p>
        </div>
      )}

      {umbrellaProvider && (
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/30 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-xs">🛡</span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Nuclear Umbrella</span>
          </div>
          <p className="text-xs text-slate-300">
            Protected under {countries[umbrellaProvider[0]]?.name}'s ({countries[umbrellaProvider[0]]?.flagEmoji}) nuclear deterrence umbrella through alliance commitments.
          </p>
        </div>
      )}
    </div>
  );
};

export default NuclearPanel;
