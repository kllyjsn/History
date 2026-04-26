import type { FC } from 'react';
import { nuclearPrograms } from '../../data/nuclear';

const legendItems = [
  { color: '#fca5a5', label: '5,000+ warheads' },
  { color: '#ef4444', label: '200–500 warheads' },
  { color: '#dc2626', label: '50–200 warheads' },
  { color: '#92400e', label: '<50 warheads' },
  { color: '#f97316', label: 'Undeclared' },
  { color: '#3b82f6', label: 'NATO sharing' },
  { color: '#8b5cf6', label: 'Former nuclear' },
  { color: '#22c55e', label: 'Voluntarily disarmed' },
];

const totalGlobalWarheads = Object.values(nuclearPrograms).reduce(
  (sum, p) => sum + p.totalWarheads, 0,
);

const NuclearLegend: FC = () => {
  return (
    <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 z-10 rounded-lg border border-slate-700 bg-slate-900/90 p-2 sm:p-3 backdrop-blur-sm max-w-[180px] sm:max-w-[220px]">
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-xs sm:text-sm">☢</span>
        <span className="text-[10px] sm:text-xs font-semibold text-white">Nuclear Arsenals</span>
      </div>
      <div className="text-[10px] text-slate-400 mb-2">
        <span className="font-medium text-red-400">{totalGlobalWarheads.toLocaleString()}</span> total warheads globally
      </div>
      <div className="space-y-1">
        {legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-sm flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[9px] sm:text-[10px] text-slate-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NuclearLegend;
