import type { FC } from 'react';
import type { ColorMode } from '../../types';

interface MapControlsProps {
  colorMode: ColorMode;
  onColorModeChange: (mode: ColorMode) => void;
}

const modes: { value: ColorMode; label: string; icon: string }[] = [
  { value: 'conflict_frequency', label: 'Conflict Frequency', icon: '🔥' },
  { value: 'active_conflicts', label: 'Active Conflicts', icon: '⚠' },
  { value: 'peace_duration', label: 'Peace Duration', icon: '🕊' },
  { value: 'region', label: 'By Region', icon: '🌍' },
];

const MapControls: FC<MapControlsProps> = ({ colorMode, onColorModeChange }) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 rounded-lg border border-slate-700 bg-slate-900/90 p-2 backdrop-blur-sm">
      <div className="px-2 py-1 text-xs font-medium text-slate-400 uppercase tracking-wider">
        Color by
      </div>
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onColorModeChange(m.value)}
          className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs transition-colors ${
            colorMode === m.value
              ? 'bg-amber-500/20 text-amber-400'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          <span>{m.icon}</span>
          <span>{m.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MapControls;
