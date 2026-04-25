import type { FC } from 'react';
import { countries } from '../../data/countries';
import { getConflictsForCountry } from '../../data/conflicts';

interface MapTooltipProps {
  x: number;
  y: number;
  name: string;
  iso: string;
  conflicts: number;
  isActive: boolean;
}

const MapTooltip: FC<MapTooltipProps> = ({ x, y, name, iso, conflicts, isActive }) => {
  const country = countries[iso];
  const countryConflicts = iso ? getConflictsForCountry(iso) : [];
  const activeCount = countryConflicts.filter((c) => c.endYear === null).length;
  const types = new Set(countryConflicts.map((c) => c.type));

  return (
    <div
      className="tooltip-enter pointer-events-none fixed z-50 rounded-lg px-3 py-2 text-sm shadow-xl border backdrop-blur-sm"
      style={{
        left: x + 12,
        top: y - 10,
        background: 'rgba(30, 41, 59, 0.95)',
        borderColor: isActive ? '#ef4444' : '#334155',
      }}
    >
      <div className="flex items-center gap-2">
        {country && <span className="text-base">{country.flagEmoji}</span>}
        <div>
          <span className="font-semibold text-white">{name}</span>
          {country && (
            <span className="ml-2 text-[10px] text-slate-500">{country.region}</span>
          )}
        </div>
      </div>
      <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
        {conflicts > 0 ? (
          <>
            <span className="font-medium text-amber-400">{conflicts}</span>
            <span>conflicts</span>
            <span className="text-slate-600">·</span>
            <span>{types.size} types</span>
          </>
        ) : (
          <span>No recorded conflicts in dataset</span>
        )}
      </div>
      {activeCount > 0 && (
        <div className="mt-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-red-600/20 px-2 py-0.5 text-[10px] text-red-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
            {activeCount} active conflict{activeCount > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default MapTooltip;
