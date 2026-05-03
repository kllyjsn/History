import { type FC, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { alliances, type Alliance } from '../../data/alliances';
import { countries } from '../../data/countries';

interface AllianceOverlayProps {
  onClose: () => void;
  onSelectCountry: (id: string) => void;
}

const AllianceOverlay: FC<AllianceOverlayProps> = ({ onClose, onSelectCountry }) => {
  const [selectedAlliance, setSelectedAlliance] = useState<string>('nato');

  const current = useMemo(
    () => alliances.find((a) => a.id === selectedAlliance) ?? alliances[0],
    [selectedAlliance],
  );

  const memberCountries = useMemo(
    () => current.members.filter((id) => countries[id]).map((id) => countries[id]),
    [current],
  );

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
            <h2 className="text-lg sm:text-2xl font-bold text-white">Alliances & Blocs</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Major geopolitical alliances and their member states
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
          >
            Back to Map
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {alliances.map((a) => (
            <AllianceTab
              key={a.id}
              alliance={a}
              isSelected={selectedAlliance === a.id}
              onSelect={() => setSelectedAlliance(a.id)}
            />
          ))}
        </div>

        <div className="rounded-xl border border-slate-700 bg-slate-800/30 p-4 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: current.color }}
            />
            <h3 className="text-base font-semibold text-white">{current.name}</h3>
            <span className="text-xs text-slate-400">
              Founded {current.founded}{current.dissolved ? ` · Dissolved ${current.dissolved}` : ''}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{current.description}</p>
          <p className="text-xs text-slate-400 mt-2">{memberCountries.length} member states</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {memberCountries.map((country) => (
            <button
              key={country.id}
              onClick={() => onSelectCountry(country.id)}
              className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/20 p-2 text-left hover:bg-slate-700/40 transition-colors"
            >
              <span className="text-base">{country.flagEmoji}</span>
              <span className="text-xs text-white truncate">{country.name}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const AllianceTab: FC<{
  alliance: Alliance;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ alliance, isSelected, onSelect }) => (
  <button
    onClick={onSelect}
    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
      isSelected
        ? 'text-white'
        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
    }`}
    style={isSelected ? { backgroundColor: `${alliance.color}30`, color: alliance.color } : undefined}
  >
    <span
      className="inline-block h-2 w-2 rounded-full mr-1.5"
      style={{ backgroundColor: alliance.color }}
    />
    {alliance.name}
  </button>
);

export default AllianceOverlay;
