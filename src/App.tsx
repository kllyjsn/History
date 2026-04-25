import { useState, useCallback, useEffect } from 'react';
import Header from './components/layout/Header';
import WorldMap from './components/map/WorldMap';
import CountryPanel from './components/country/CountryPanel';
import TrendsDashboard from './components/trends/TrendsDashboard';
import SearchPanel from './components/search/SearchPanel';
import TimelineScrubber from './components/timeline/TimelineScrubber';
import { useMapInteraction } from './hooks/useMapInteraction';
import { useConflictData } from './hooks/useConflictData';
import { getActiveConflicts } from './data/conflicts';

function App() {
  const {
    selectedCountry,
    colorMode,
    selectCountry,
    setColorMode,
  } = useMapInteraction();

  const {
    conflicts,
    countryConflictCounts,
    activeConflictCountries,
    peaceYears,
    getCountryStats,
    conflictsByDecade,
    conflictsByType,
    deadliestConflicts,
  } = useConflictData();

  const [showTrends, setShowTrends] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [timelineYear, setTimelineYear] = useState(2025);

  const handleSelectCountry = useCallback(
    (id: string) => {
      selectCountry(id);
      setShowTrends(false);
    },
    [selectCountry],
  );

  const handleCloseCountry = useCallback(() => {
    selectCountry(null);
  }, [selectCountry]);

  // Keyboard shortcut for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !showSearch) {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        if (showSearch) setShowSearch(false);
        else if (showTrends) setShowTrends(false);
        else if (selectedCountry) selectCountry(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showSearch, showTrends, selectedCountry, selectCountry]);

  const activeCount = getActiveConflicts().length;

  return (
    <div className="flex h-screen flex-col">
      <Header
        onOpenSearch={() => setShowSearch(true)}
        onOpenTrends={() => setShowTrends(!showTrends)}
        showTrends={showTrends}
      />

      <div className="relative flex-1 overflow-hidden">
        <WorldMap
          colorMode={colorMode}
          onColorModeChange={setColorMode}
          conflictCounts={countryConflictCounts}
          activeCountries={activeConflictCountries}
          peaceYears={peaceYears}
          onSelectCountry={handleSelectCountry}
          selectedCountry={selectedCountry}
        />

        <CountryPanel
          countryId={selectedCountry}
          onClose={handleCloseCountry}
          getCountryStats={getCountryStats}
        />

        {showTrends && (
          <TrendsDashboard
            conflictsByDecade={conflictsByDecade}
            conflictsByType={conflictsByType}
            deadliestConflicts={deadliestConflicts}
            totalConflicts={conflicts.length}
            activeConflicts={activeCount}
            onClose={() => setShowTrends(false)}
          />
        )}

        <SearchPanel
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onSelectCountry={handleSelectCountry}
        />
      </div>

      <TimelineScrubber
        selectedYear={timelineYear}
        onYearChange={setTimelineYear}
      />
    </div>
  );
}

export default App;
