import type { FC } from 'react';
import type { ColorMode } from '../../types';

interface MapControlsProps {
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
}

const modes: { value: ColorMode; label: string; shortLabel: string; icon: string }[] = [
  { value: 'conflict_frequency', label: 'Conflict Frequency', shortLabel: 'Frequency', icon: '🔥' },
  { value: 'active_conflicts', label: 'Active Conflicts', shortLabel: 'Active', icon: '⚠' },
  { value: 'peace_duration', label: 'Peace Duration', shortLabel: 'Peace', icon: '🕊' },
  { value: 'nuclear', label: 'Nuclear Arsenal', shortLabel: 'Nuclear', icon: '☢' },
  { value: 'region', label: 'By Region', shortLabel: 'Region', icon: '🌍' },
];

const MapControls: FC<MapControlsProps> = ({ colorMode, onColorModeChange }) => {
  return (
    <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex flex-col gap-0.5 sm:gap-1 rounded-lg border border-slate-700 bg-slate-900/90 p-1.5 sm:p-2 backdrop-blur-sm">
      <div className="hidden sm:block px-2 py-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
        Color by
      </div>
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onColorModeChange(m.value)}
          className={`flex items-center gap-1.5 sm:gap-2 rounded-md px-2 py-1 sm:px-3 sm:py-1.5 text-[10px] sm:text-xs transition-colors ${
            colorMode === m.value
              ? 'bg-amber-500/20 text-amber-400'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
          title={m.label}
        >
          <span>{m.icon}</span>
          <span className="hidden sm:inline">{m.label}</span>
          <span className="sm:hidden">{m.shortLabel}</span>
        </button>
      ))}
    </div>
  );
};

export default MapControls;
