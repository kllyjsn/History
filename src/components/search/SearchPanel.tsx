import { type FC, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { conflicts } from '../../data/conflicts';
import { countries } from '../../data/countries';
import { getConflictTypeBadge, getConflictTypeColor } from '../../utils/colorScales';
import { formatDateRange } from '../../utils/formatters';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCountry: (id: string) => void;
}

const SearchPanel: FC<SearchPanelProps> = ({ isOpen, onClose, onSelectCountry }) => {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim()) return { matchedCountries: [], matchedConflicts: [] };
    const q = query.toLowerCase();

    const matchedCountries = Object.values(countries).filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.historicalNames.some((hn) => hn.name.toLowerCase().includes(q)) ||
        c.id.toLowerCase().includes(q),
    );

    const matchedConflicts = conflicts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.alternateNames.some((an) => an.name.toLowerCase().includes(q)) ||
        c.tags.some((t) => t.includes(q)) ||
        c.type.toLowerCase().includes(q),
    );

    return { matchedCountries: matchedCountries.slice(0, 10), matchedConflicts: matchedConflicts.slice(0, 15) };
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute inset-x-0 top-0 z-50 mx-auto max-w-2xl p-4"
        >
          <div className="rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3 border-b border-slate-700 px-4 py-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                autoFocus
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search countries, conflicts, time periods..."
                className="flex-1 bg-transparent text-white placeholder-slate-500 outline-none text-sm"
              />
              <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">
                ESC
              </button>
            </div>

            {query.trim() && (
              <div className="max-h-96 overflow-y-auto p-2">
                {results.matchedCountries.length > 0 && (
                  <div className="mb-3">
                    <p className="px-2 py-1 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      Countries ({results.matchedCountries.length})
                    </p>
                    {results.matchedCountries.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          onSelectCountry(c.id);
                          onClose();
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 transition-colors"
                      >
                        <span>{c.flagEmoji}</span>
                        <span className="font-medium text-white">{c.name}</span>
                        <span className="text-xs text-slate-500">{c.region}</span>
                      </button>
                    ))}
                  </div>
                )}

                {results.matchedConflicts.length > 0 && (
                  <div>
                    <p className="px-2 py-1 text-[10px] font-medium text-slate-500 uppercase tracking-wider">
                      Conflicts ({results.matchedConflicts.length})
                    </p>
                    {results.matchedConflicts.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          const firstParty = c.parties[0];
                          if (firstParty && countries[firstParty.countryId]) {
                            onSelectCountry(firstParty.countryId);
                          }
                          onClose();
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{c.name}</p>
                          <p className="text-xs text-slate-500">
                            {formatDateRange(c.startYear, c.endYear)}
                          </p>
                        </div>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px]"
                          style={{
                            backgroundColor: `${getConflictTypeColor(c.type)}20`,
                            color: getConflictTypeColor(c.type),
                          }}
                        >
                          {getConflictTypeBadge(c.type)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {results.matchedCountries.length === 0 && results.matchedConflicts.length === 0 && (
                  <p className="p-4 text-center text-sm text-slate-500">No results found</p>
                )}
              </div>
            )}

            {!query.trim() && (
              <div className="p-4 text-center text-xs text-slate-500">
                Search by country name, conflict name, type, or tag
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchPanel;
