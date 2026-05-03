import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import Header from './components/layout/Header';
import WorldMap from './components/map/WorldMap';
import CountryPanel from './components/country/CountryPanel';
import SearchPanel from './components/search/SearchPanel';
import TimelineScrubber from './components/timeline/TimelineScrubber';
import ArticleReader from './components/reader/ArticleReader';
import IntroTooltip from './components/onboarding/IntroTooltip';
import { useMapInteraction } from './hooks/useMapInteraction';
import { useConflictData } from './hooks/useConflictData';
import { getActiveConflicts, getConflictsByDateRange } from './data/conflicts';

const TrendsDashboard = lazy(() => import('./components/trends/TrendsDashboard'));
const AboutPage = lazy(() => import('./components/about/AboutPage'));
const ComparePanel = lazy(() => import('./components/compare/ComparePanel'));
const TodaysWars = lazy(() => import('./components/wars/TodaysWars'));
const ConflictGraph = lazy(() => import('./components/graph/ConflictGraph'));
const PeaceStreaks = lazy(() => import('./components/peace/PeaceStreaks'));
const AllianceOverlay = lazy(() => import('./components/alliances/AllianceOverlay'));

type Page = 'map' | 'trends' | 'about' | 'compare' | 'wars' | 'graph' | 'peace' | 'alliances';

function parseHash(): { page: Page; country: string | null } {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const segments = hash.split('/');
  if (segments[0] === 'country' && segments[1]) {
    return { page: 'map', country: segments[1].toUpperCase() };
  }
  const validPages: Page[] = ['trends', 'about', 'compare', 'wars', 'graph', 'peace', 'alliances'];
  if (segments[0] === 'page' && validPages.includes(segments[1] as Page)) {
    return { page: segments[1] as Page, country: null };
  }
  return { page: 'map', country: null };
}

function updateHash(page: Page, country: string | null) {
  let hash = '';
  if (country) hash = `#/country/${country}`;
  else if (page !== 'map') hash = `#/page/${page}`;
  if (hash) window.history.replaceState(null, '', hash);
  else if (window.location.hash) window.history.replaceState(null, '', window.location.pathname);
}

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

  const [page, setPageState] = useState<Page>(() => parseHash().page);
  const [showSearch, setShowSearch] = useState(false);
  const [timelineYear, setTimelineYear] = useState(2025);

  const setPage = useCallback((p: Page) => {
    setPageState(p);
    updateHash(p, p === 'map' ? selectedCountry : null);
  }, [selectedCountry]);
  const [showReader, setShowReader] = useState(false);
  const [readerUrl, setReaderUrl] = useState<string | undefined>(undefined);
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem('pw-intro-dismissed'));

  const timelineConflicts = getConflictsByDateRange(timelineYear, timelineYear);
  const timelineCountries = new Set<string>();
  for (const c of timelineConflicts) {
    for (const p of c.parties) {
      timelineCountries.add(p.countryId);
    }
  }

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
      setPageState('map');
      updateHash('map', id);
    },
    [selectCountry],
  );

  const handleCloseCountry = useCallback(() => {
    selectCountry(null);
    updateHash(page, null);
  }, [selectCountry, page]);

  useEffect(() => {
    const initial = parseHash();
    if (initial.country) {
      selectCountry(initial.country);
    }
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
        else if (selectedCountry) handleCloseCountry();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [showSearch, showReader, handleCloseReader, page, selectedCountry, handleCloseCountry, setPage]);

  const activeCount = getActiveConflicts().length;
  const countryCount = Object.keys(countries).length;

  return (
    <div className="flex h-screen flex-col">
      <Header
        onOpenSearch={() => setShowSearch(true)}
        onToggleTrends={() => setPage(page === 'trends' ? 'map' : 'trends')}
        onToggleAbout={() => setPage(page === 'about' ? 'map' : 'about')}
        onToggleCompare={() => setPage(page === 'compare' ? 'map' : 'compare')}
        onToggleWars={() => setPage(page === 'wars' ? 'map' : 'wars')}
        onToggleGraph={() => setPage(page === 'graph' ? 'map' : 'graph')}
        onTogglePeace={() => setPage(page === 'peace' ? 'map' : 'peace')}
        onToggleAlliances={() => setPage(page === 'alliances' ? 'map' : 'alliances')}
        onOpenReader={() => handleOpenReader()}
        showTrends={page === 'trends'}
        showAbout={page === 'about'}
        showCompare={page === 'compare'}
        showWars={page === 'wars'}
        showGraph={page === 'graph'}
        showPeace={page === 'peace'}
        showAlliances={page === 'alliances'}
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
          timelineYear={timelineYear}
          timelineCountries={timelineCountries}
        />

        <CountryPanel
          countryId={selectedCountry}
          onClose={handleCloseCountry}
          getCountryStats={getCountryStats}
          onOpenArticle={handleOpenReader}
        />

        {page === 'trends' && (
          <Suspense fallback={null}>
            <TrendsDashboard
              conflictsByDecade={conflictsByDecade}
              conflictsByType={conflictsByType}
              deadliestConflicts={deadliestConflicts}
              totalConflicts={conflicts.length}
              activeConflicts={activeCount}
              onClose={() => setPage('map')}
            />
          </Suspense>
        )}

        {page === 'about' && (
          <Suspense fallback={null}>
            <AboutPage
              onClose={() => setPage('map')}
              totalConflicts={conflicts.length}
              totalCountries={countryCount}
            />
          </Suspense>
        )}

        {page === 'wars' && (
          <Suspense fallback={null}>
            <TodaysWars
              onClose={() => setPage('map')}
              onSelectCountry={handleSelectCountry}
            />
          </Suspense>
        )}

        {page === 'graph' && (
          <Suspense fallback={null}>
            <ConflictGraph
              onClose={() => setPage('map')}
              onSelectCountry={handleSelectCountry}
            />
          </Suspense>
        )}

        {page === 'peace' && (
          <Suspense fallback={null}>
            <PeaceStreaks
              onClose={() => setPage('map')}
              onSelectCountry={handleSelectCountry}
            />
          </Suspense>
        )}

        {page === 'alliances' && (
          <Suspense fallback={null}>
            <AllianceOverlay
              onClose={() => setPage('map')}
              onSelectCountry={handleSelectCountry}
            />
          </Suspense>
        )}

        <Suspense fallback={null}>
          <ComparePanel
            isOpen={page === 'compare'}
            onClose={() => setPage('map')}
            getCountryStats={getCountryStats}
          />
        </Suspense>

        <SearchPanel
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onSelectCountry={handleSelectCountry}
        />
      </div>

      <TimelineScrubber
        selectedYear={timelineYear}
        onYearChange={setTimelineYear}
        activeConflictCount={timelineConflicts.length}
      />

      <ArticleReader
        isOpen={showReader}
        initialUrl={readerUrl}
        onClose={handleCloseReader}
      />

      <IntroTooltip visible={showIntro} onDismiss={() => { setShowIntro(false); localStorage.setItem('pw-intro-dismissed', '1'); }} />
    </div>
  );
}

export default App;
