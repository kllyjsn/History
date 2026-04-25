import type { FC } from 'react';
import { countries } from '../../data/countries';

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
  return (
    <div
      className="tooltip-enter pointer-events-none fixed z-50 rounded-lg px-3 py-2 text-sm shadow-xl border"
      style={{
        left: x + 12,
        top: y - 10,
        background: '#1e293b',
        borderColor: '#334155',
      }}
    >
      <div className="flex items-center gap-2">
        {country && <span className="text-base">{country.flagEmoji}</span>}
        <span className="font-semibold text-white">{name}</span>
      </div>
      <div className="mt-1 text-xs text-slate-400">
        {conflicts > 0 ? (
          <span>{conflicts} recorded conflicts</span>
        ) : (
          <span>No recorded conflicts in dataset</span>
        )}
        {isActive && (
          <span className="ml-2 inline-block rounded-full bg-red-600/20 px-1.5 py-0.5 text-red-400">
            Active conflict
          </span>
        )}
      </div>
    </div>
  );
};

export default MapTooltip;
