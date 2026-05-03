import { type FC, useState } from 'react';

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleTrends: () => void;
  onToggleAbout: () => void;
  onToggleCompare: () => void;
  onToggleWars: () => void;
  onToggleGraph: () => void;
  onTogglePeace: () => void;
  onToggleAlliances: () => void;
  onOpenReader: () => void;
  showTrends: boolean;
  showAbout: boolean;
  showCompare: boolean;
  showWars: boolean;
  showGraph: boolean;
  showPeace: boolean;
  showAlliances: boolean;
}

const Header: FC<HeaderProps> = ({
  onOpenSearch,
  onToggleTrends,
  onToggleAbout,
  onToggleCompare,
  onToggleWars,
  onToggleGraph,
  onTogglePeace,
  onToggleAlliances,
  onOpenReader,
  showTrends,
  showAbout,
  showCompare,
  showWars,
  showGraph,
  showPeace,
  showAlliances,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm z-20">
      <div className="flex items-center justify-between px-3 py-2 sm:px-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-amber-500/10 shrink-0">
            <span className="text-base sm:text-lg">🌍</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">PEACE AND WAR</h1>
            <p className="text-[9px] sm:text-[10px] text-slate-500 -mt-0.5 hidden sm:block">Geopolitical Atlas · Every Country · Every Conflict</p>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-2">
          <NavButton label="Wars" active={showWars} onClick={onToggleWars} activeColor="red" />
          <NavButton label="Trends" active={showTrends} onClick={onToggleTrends} activeColor="amber" />
          <NavButton label="Graph" active={showGraph} onClick={onToggleGraph} activeColor="emerald" />
          <NavButton label="Peace" active={showPeace} onClick={onTogglePeace} activeColor="emerald" />
          <NavButton label="Alliances" active={showAlliances} onClick={onToggleAlliances} activeColor="blue" />
          <NavButton label="Compare" active={showCompare} onClick={onToggleCompare} activeColor="purple" />
          <NavButton label="Read" active={false} onClick={onOpenReader} activeColor="emerald" />
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

        {/* Mobile nav buttons */}
        <div className="flex sm:hidden items-center gap-1">
          <button
            onClick={onOpenSearch}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-800 px-3 py-2 flex gap-2">
          <NavButton label="Wars" active={showWars} onClick={() => { onToggleWars(); setMobileMenuOpen(false); }} activeColor="red" />
          <NavButton label="Trends" active={showTrends} onClick={() => { onToggleTrends(); setMobileMenuOpen(false); }} activeColor="amber" />
          <NavButton label="Graph" active={showGraph} onClick={() => { onToggleGraph(); setMobileMenuOpen(false); }} activeColor="emerald" />
          <NavButton label="Peace" active={showPeace} onClick={() => { onTogglePeace(); setMobileMenuOpen(false); }} activeColor="emerald" />
          <NavButton label="Alliances" active={showAlliances} onClick={() => { onToggleAlliances(); setMobileMenuOpen(false); }} activeColor="blue" />
          <NavButton label="Compare" active={showCompare} onClick={() => { onToggleCompare(); setMobileMenuOpen(false); }} activeColor="purple" />
          <NavButton label="Read" active={false} onClick={() => { onOpenReader(); setMobileMenuOpen(false); }} activeColor="emerald" />
          <NavButton label="About" active={showAbout} onClick={() => { onToggleAbout(); setMobileMenuOpen(false); }} activeColor="blue" />
        </div>
      )}
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
  activeColor: 'amber' | 'blue' | 'purple' | 'emerald' | 'red';
}) {
  const colorMap = {
    amber: 'bg-amber-500/20 text-amber-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    red: 'bg-red-500/20 text-red-400',
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
