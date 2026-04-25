import { useState, useCallback, useEffect } from 'react';
import Header from './components/layout/Header';
import WorldMap from './components/map/WorldMap';
import CountryPanel from './components/country/CountryPanel';
import TrendsDashboard from './components/trends/TrendsDashboard';
import SearchPanel from './components/search/SearchPanel';
import TimelineScrubber from './components/timeline/TimelineScrubber';
import AboutPage from './components/about/AboutPage';
import ComparePanel from './components/compare/ComparePanel';
import ArticleReader from './components/reader/ArticleReader';
import { useMapInteraction } from './hooks/useMapInteraction';
import { useConflictData } from './hooks/useConflictData';
import { getActiveConflicts } from './data/conflicts';

type Page = 'map' | 'trends' | 'about' | 'compare';

function App() {
  const {
    selectedCountry,
    colorMode,
    selectCountry,
    setColorMode,
  } = useMapInteraction();

  const {
    conflicts,
    countries,
    countryConflictCounts,
    activeConflictCountries,
    peaceYears,
    getCountryStats,
    conflictsByDecade,
    conflictsByType,
    deadliestConflicts,
  } = useConflictData();

  const [page, setPage] = useState<Page>('map');
  const [showSearch, setShowSearch] = useState(false);
  const [timelineYear, setTimelineYear] = useState(2025);
  const [showReader, setShowReader] = useState(false);
  const [readerUrl, setReaderUrl] = useState<string | undefined>(undefined);

  const handleOpenReader = useCallback((url?: string) => {
    setReaderUrl(url);
    setShowReader(true);
  }, []);

  const handleCloseReader = useCallback(() => {
    setShowReader(false);
    setReaderUrl(undefined);
  }, []);

  const handleSelectCountry = useCallback(
    (id: string) => {
      selectCountry(id);
      setPage('map');
    },
    [selectCountry],
  );

  const handleCloseCountry = useCallback(() => {
    selectCountry(null);
  }, [selectCountry]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' && !showSearch && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        if (showReader) handleCloseReader();
        else if (showSearch) setShowSearch(false);
        else if (page !== 'map') setPage('map');
        else if (selectedCountry) selectCountry(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showSearch, showReader, handleCloseReader, page, selectedCountry, selectCountry]);

  const activeCount = getActiveConflicts().length;
  const countryCount = Object.keys(countries).length;

  return (
    <div className="flex h-screen flex-col">
      <Header
        onOpenSearch={() => setShowSearch(true)}
        onToggleTrends={() => setPage(page === 'trends' ? 'map' : 'trends')}
        onToggleAbout={() => setPage(page === 'about' ? 'map' : 'about')}
        onToggleCompare={() => setPage(page === 'compare' ? 'map' : 'compare')}
        onOpenReader={() => handleOpenReader()}
        showTrends={page === 'trends'}
        showAbout={page === 'about'}
        showCompare={page === 'compare'}
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
          onOpenArticle={handleOpenReader}
        />

        {page === 'trends' && (
          <TrendsDashboard
            conflictsByDecade={conflictsByDecade}
            conflictsByType={conflictsByType}
            deadliestConflicts={deadliestConflicts}
            totalConflicts={conflicts.length}
            activeConflicts={activeCount}
            onClose={() => setPage('map')}
          />
        )}

        {page === 'about' && (
          <AboutPage
            onClose={() => setPage('map')}
            totalConflicts={conflicts.length}
            totalCountries={countryCount}
          />
        )}

        <ComparePanel
          isOpen={page === 'compare'}
          onClose={() => setPage('map')}
          getCountryStats={getCountryStats}
        />

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

      <ArticleReader
        isOpen={showReader}
        initialUrl={readerUrl}
        onClose={handleCloseReader}
      />
    </div>
  );
}

export default App;
