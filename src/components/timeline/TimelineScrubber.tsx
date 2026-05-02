import { type FC, useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { conflicts, getConflictsByDateRange } from '../../data/conflicts';

interface TimelineScrubberProps {
  onYearChange: (year: number) => void;
  selectedYear: number;
  minYear?: number;
  maxYear?: number;
  activeConflictCount?: number;
}

const TimelineScrubber: FC<TimelineScrubberProps> = ({
  onYearChange,
  selectedYear,
  minYear = 1500,
  maxYear = 2025,
  activeConflictCount,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const playRef = useRef<ReturnType<typeof setInterval>>(undefined);
  const yearRef = useRef(selectedYear);

  const fallbackConflicts = getConflictsByDateRange(selectedYear, selectedYear);
  const activeConflictDisplay = activeConflictCount ?? fallbackConflicts.length;
  const totalRange = maxYear - minYear;
  const pct = ((selectedYear - minYear) / totalRange) * 100;

  const conflictDensity = useMemo(() => {
    const step = 10;
    const density: { year: number; count: number; pct: number }[] = [];
    let maxCount = 0;
    for (let y = minYear; y <= maxYear; y += step) {
      const count = conflicts.filter(
        (c) => c.startYear <= y + step && (c.endYear === null || c.endYear >= y),
      ).length;
      if (count > maxCount) maxCount = count;
      density.push({ year: y, count, pct: 0 });
    }
    for (const d of density) {
      d.pct = maxCount > 0 ? d.count / maxCount : 0;
    }
    return density;
  }, [minYear, maxYear]);

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

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      setIsDragging(true);
      const touch = e.touches[0];
      if (touch) updateYear(touch.clientX);
    },
    [updateYear],
  );

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => updateYear(e.clientX);
    const handleMouseUp = () => setIsDragging(false);
    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) updateYear(touch.clientX);
    };
    const handleTouchEnd = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, updateYear]);

  useEffect(() => {
    yearRef.current = selectedYear;
  }, [selectedYear]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      clearInterval(playRef.current);
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playRef.current = setInterval(() => {
        yearRef.current += 5;
        if (yearRef.current > maxYear) {
          yearRef.current = minYear;
        }
        onYearChange(yearRef.current);
      }, 200);
    }
  }, [isPlaying, maxYear, minYear, onYearChange]);

  useEffect(() => {
    return () => clearInterval(playRef.current);
  }, []);

  const ticks = [];
  for (let y = Math.ceil(minYear / 100) * 100; y <= maxYear; y += 100) {
    ticks.push(y);
  }

  return (
    <div className="border-t border-slate-800 bg-slate-900/90 px-2 py-1.5 sm:px-4 sm:py-2 backdrop-blur-sm">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={togglePlay}
          className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full transition-all shrink-0 ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/40'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {isPlaying ? (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="sm:w-3 sm:h-3">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="sm:w-3 sm:h-3">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <div className="text-center min-w-[3.5rem] sm:min-w-[4.5rem] shrink-0">
          <span className="text-xs sm:text-sm font-bold text-amber-400 tabular-nums">
            {selectedYear}
          </span>
          <div className="text-[8px] sm:text-[9px] text-slate-500 -mt-0.5">
            {activeConflictDisplay} active
          </div>
        </div>

        <div className="flex-1 relative touch-none">
          <div
            ref={trackRef}
            className="relative h-8 sm:h-10 cursor-pointer"
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
          >
            {/* Conflict density heatmap */}
            <div className="absolute bottom-3.5 sm:bottom-4 left-0 right-0 h-2 sm:h-3 flex">
              {conflictDensity.map((d) => {
                const x = ((d.year - minYear) / totalRange) * 100;
                const w = (10 / totalRange) * 100;
                const opacity = 0.1 + d.pct * 0.6;
                return (
                  <div
                    key={d.year}
                    className="absolute h-full"
                    style={{
                      left: `${x}%`,
                      width: `${w}%`,
                      backgroundColor: `rgba(239, 68, 68, ${opacity})`,
                    }}
                    title={`${d.year}s: ${d.count} conflicts`}
                  />
                );
              })}
            </div>

            {/* Track line */}
            <div className="absolute bottom-2.5 sm:bottom-3 h-1 w-full rounded-full bg-slate-700/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500/60 to-amber-400/80 transition-[width] duration-75"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Tick marks - fewer on mobile */}
            {ticks.map((y) => {
              const tickPct = ((y - minYear) / totalRange) * 100;
              const isEvenCentury = y % 200 === 0;
              return (
                <div
                  key={y}
                  className={`absolute bottom-0 flex flex-col items-center ${!isEvenCentury ? 'hidden sm:flex' : ''}`}
                  style={{ left: `${tickPct}%` }}
                >
                  <div className="h-1.5 sm:h-2 w-px bg-slate-600" />
                  <span className="text-[7px] sm:text-[9px] text-slate-600 select-none">{y}</span>
                </div>
              );
            })}

            {/* Thumb */}
            <div
              className="absolute bottom-1.5 sm:bottom-2 -translate-x-1/2 h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 border-amber-400 bg-slate-900 shadow-lg shadow-amber-500/20 transition-[left] duration-75"
              style={{ left: `${pct}%` }}
            >
              <div className="absolute inset-0.5 sm:inset-1 rounded-full bg-amber-400/30" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineScrubber;
