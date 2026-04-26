import { type FC, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { countries } from '../../data/countries';
import { getConflictsForCountry } from '../../data/conflicts';
import type { CountryStats } from '../../types';
import CountryHeader from './CountryHeader';
import ConflictTimeline from './ConflictTimeline';
import NuclearPanel from '../nuclear/NuclearPanel';

interface CountryPanelProps {
  countryId: string | null;
  onClose: () => void;
  getCountryStats: (id: string) => CountryStats;
  onOpenArticle: (url?: string) => void;
}

const CountryPanel: FC<CountryPanelProps> = ({ countryId, onClose, getCountryStats, onOpenArticle }) => {
  const country = countryId ? countries[countryId] : null;
  const countryConflicts = useMemo(
    () => (countryId ? getConflictsForCountry(countryId) : []),
    [countryId],
  );
  const stats = useMemo(
    () => (countryId ? getCountryStats(countryId) : null),
    [countryId, getCountryStats],
  );

  return (
    <AnimatePresence>
      {country && stats && (
        <motion.div
          key={country.id}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute inset-0 sm:left-auto sm:right-0 sm:top-0 z-30 h-full w-full sm:max-w-md overflow-y-auto sm:border-l border-slate-700 bg-slate-900/95 backdrop-blur-md"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-700 bg-slate-900/95 px-4 py-3 backdrop-blur-md">
            <h2 className="text-lg font-bold text-white">Country Profile</h2>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-6">
            <CountryHeader country={country} stats={stats} />
            <NuclearPanel countryId={country.id} />
            <ConflictTimeline conflicts={countryConflicts} countryId={country.id} onOpenArticle={onOpenArticle} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CountryPanel;
