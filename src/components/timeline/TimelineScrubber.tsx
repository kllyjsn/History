import { type FC, useState, useRef, useCallback, useEffect } from 'react';
import { getConflictsByDateRange } from '../../data/conflicts';

interface TimelineScrubberProps {
  onYearChange: (year: number) => void;
  selectedYear: number;
  minYear?: number;
  maxYear?: number;
}

const TimelineScrubber: FC<TimelineScrubberProps> = ({
  onYearChange,
  selectedYear,
  minYear = 1500,
  maxYear = 2025,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const activeConflicts = getConflictsByDateRange(selectedYear, selectedYear);
  const totalRange = maxYear - minYear;
  const pct = ((selectedYear - minYear) / totalRange) * 100;

  const updateYear = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const year = Math.round(minYear + ratio * totalRange);
      onYearChange(year);
    },
    [minYear, totalRange, onYearChange],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsDragging(true);
      updateYear(e.clientX);
    },
    [updateYear],
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMove = (e: MouseEvent) => updateYear(e.clientX);
    const handleUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, updateYear]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      clearInterval(playRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      let y = selectedYear;
      playRef.current = setInterval(() => {
        y += 5;
        if (y > maxYear) {
          y = minYear;
        }
        onYearChange(y);
      }, 200);
    }
  }, [isPlaying, selectedYear, maxYear, minYear, onYearChange]);

  useEffect(() => {
    return () => clearInterval(playRef.current);
  }, []);

  const ticks = [];
  for (let y = 1500; y <= 2025; y += 100) {
    ticks.push(y);
  }

  return (
    <div className="border-t border-slate-800 bg-slate-900/90 px-4 py-2 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
        >
          {isPlaying ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <span className="w-12 text-center text-sm font-bold text-amber-400 tabular-nums">
          {selectedYear}
        </span>

        <div className="flex-1 relative">
          <div
            ref={trackRef}
            className="relative h-6 cursor-pointer"
            onMouseDown={handleMouseDown}
          >
            {/* Track */}
            <div className="absolute top-1/2 -translate-y-1/2 h-1 w-full rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-amber-500/40"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Tick marks */}
            {ticks.map((y) => {
              const tickPct = ((y - minYear) / totalRange) * 100;
              return (
                <div
                  key={y}
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: `${tickPct}%` }}
                >
                  <div className="h-2 w-px bg-slate-600 mt-1" />
                  <span className="text-[9px] text-slate-600 mt-0.5 select-none">{y}</span>
                </div>
              );
            })}

            {/* Thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-amber-400 bg-slate-900 shadow-lg"
              style={{ left: `${pct}%` }}
            />
          </div>
        </div>

        <span className="text-xs text-slate-500 whitespace-nowrap">
          {activeConflicts.length} active
        </span>
      </div>
    </div>
  );
};

export default TimelineScrubber;
