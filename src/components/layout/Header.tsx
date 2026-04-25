import type { FC } from 'react';

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleTrends: () => void;
  onToggleAbout: () => void;
  onToggleCompare: () => void;
  showTrends: boolean;
  showAbout: boolean;
  showCompare: boolean;
}

const Header: FC<HeaderProps> = ({
  onOpenSearch,
  onToggleTrends,
  onToggleAbout,
  onToggleCompare,
  showTrends,
  showAbout,
  showCompare,
}) => {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5 backdrop-blur-sm z-20">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
          <span className="text-lg">🌍</span>
        </div>
        <div>
          <h1 className="text-sm font-bold text-white tracking-wide">SCHOOL OF HISTORY</h1>
          <p className="text-[10px] text-slate-500 -mt-0.5">Geopolitical Atlas · Every Country · Every Conflict</p>
        </div>
      </div>

      <nav className="flex items-center gap-2">
        <NavButton label="Trends" active={showTrends} onClick={onToggleTrends} activeColor="amber" />
        <NavButton label="Compare" active={showCompare} onClick={onToggleCompare} activeColor="purple" />
        <NavButton label="About" active={showAbout} onClick={onToggleAbout} activeColor="blue" />
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-600 hover:text-white transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          Search
          <kbd className="ml-1 rounded bg-slate-700 px-1 py-0.5 text-[10px] text-slate-500">/</kbd>
        </button>
      </nav>
    </header>
  );
};

function NavButton({
  label,
  active,
  onClick,
  activeColor,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  activeColor: 'amber' | 'blue' | 'purple';
}) {
  const colorMap = {
    amber: 'bg-amber-500/20 text-amber-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
        active ? colorMap[activeColor] : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

export default Header;
