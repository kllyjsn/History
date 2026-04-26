import { type FC, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { scrapeArticle, type ScrapedArticle } from '../../utils/articleScraper';

interface ArticleReaderProps {
  isOpen: boolean;
  initialUrl?: string;
  onClose: () => void;
}

const ArticleReader: FC<ArticleReaderProps> = ({ isOpen, initialUrl, onClose }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState<ScrapedArticle | null>(null);
  const [history, setHistory] = useState<ScrapedArticle[]>([]);
  const [fontSize, setFontSize] = useState(16);
  const inputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isOpenRef = useRef(isOpen);
  const requestIdRef = useRef(0);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (isOpen && initialUrl) {
      setUrl(initialUrl);
      loadArticle(initialUrl);
    } else if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialUrl]);

  useEffect(() => {
    if (!isOpen) {
      setArticle(null);
      setUrl('');
      setLoading(false);
    }
  }, [isOpen]);

  async function loadArticle(targetUrl: string) {
    if (!targetUrl.trim()) return;
    let normalized = targetUrl.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = 'https://' + normalized;
    }
    const thisRequest = ++requestIdRef.current;
    setLoading(true);
    setArticle(null);
    const result = await scrapeArticle(normalized);
    if (!isOpenRef.current || thisRequest !== requestIdRef.current) return;
    setArticle(result);
    setUrl(normalized);
    if (!result.error) {
      setHistory(prev => {
        const filtered = prev.filter(a => a.url !== result.url);
        return [result, ...filtered].slice(0, 20);
      });
    }
    setLoading(false);
    setTimeout(() => contentRef.current?.scrollTo(0, 0), 50);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadArticle(url);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-stretch justify-center bg-black/70 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full max-w-3xl mx-2 my-2 sm:mx-4 sm:my-4 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden"
          >
            {/* Header / URL bar */}
            <div className="border-b border-slate-800 px-3 py-2 sm:px-4 sm:py-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 shrink-0">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-white tracking-wide">ARTICLE READER</h2>
                <div className="flex-1" />

                {/* Font size controls */}
                <div className="hidden sm:flex items-center gap-1 mr-2">
                  <button
                    onClick={() => setFontSize(s => Math.max(12, s - 2))}
                    className="h-6 w-6 rounded text-slate-500 hover:bg-slate-800 hover:text-white transition-colors text-xs flex items-center justify-center"
                    title="Decrease font size"
                  >
                    A<span className="text-[8px]">-</span>
                  </button>
                  <span className="text-[10px] text-slate-600 w-6 text-center">{fontSize}</span>
                  <button
                    onClick={() => setFontSize(s => Math.min(24, s + 2))}
                    className="h-6 w-6 rounded text-slate-500 hover:bg-slate-800 hover:text-white transition-colors text-xs flex items-center justify-center"
                    title="Increase font size"
                  >
                    A<span className="text-[8px]">+</span>
                  </button>
                </div>

                <button
                  onClick={onClose}
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                  aria-label="Close reader"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste any article URL or Wikipedia link..."
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600/50"
                  />
                  {loading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading || !url.trim()}
                  className="shrink-0 rounded-lg bg-emerald-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Read
                </button>
              </form>
            </div>

            {/* Content area */}
            <div ref={contentRef} className="flex-1 overflow-y-auto custom-scrollbar">
              {loading && (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
                  <p className="text-sm text-slate-400">Fetching article...</p>
                </div>
              )}

              {!loading && article && article.error && (
                <div className="px-4 py-8 sm:px-8">
                  <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-4">
                    <p className="text-sm font-medium text-red-400 mb-1">Unable to load article</p>
                    <p className="text-xs text-red-300/70">{article.error}</p>
                    <div className="mt-3 space-y-2">
                      <p className="text-xs text-slate-400">Try these alternatives:</p>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                        Open original URL in new tab
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {!loading && article && !article.error && (
                <div className="px-4 py-6 sm:px-8 sm:py-8">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                        {article.siteName}
                      </span>
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-white leading-tight">
                      {article.title}
                    </h1>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-slate-500 hover:text-emerald-400 mt-1 inline-flex items-center gap-1 transition-colors"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                      {article.url}
                    </a>
                  </div>

                  <div
                    className="text-slate-300 leading-relaxed whitespace-pre-wrap"
                    style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }}
                  >
                    {article.content}
                  </div>
                </div>
              )}

              {!loading && !article && (
                <div className="px-4 py-6 sm:px-8">
                  {/* Quick links */}
                  <div className="mb-6">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                      Quick Sources
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {quickLinks.map((link) => (
                        <button
                          key={link.url}
                          onClick={() => { setUrl(link.url); loadArticle(link.url); }}
                          className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-800/30 p-3 text-left hover:bg-slate-800/60 hover:border-slate-700 transition-colors"
                        >
                          <span className="text-lg">{link.icon}</span>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate">{link.title}</p>
                            <p className="text-[10px] text-slate-500 truncate">{link.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* History */}
                  {history.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
                        Recently Read
                      </p>
                      <div className="space-y-1.5">
                        {history.map((h) => (
                          <button
                            key={h.url}
                            onClick={() => { setUrl(h.url); loadArticle(h.url); }}
                            className="w-full flex items-center gap-3 rounded-lg bg-slate-800/20 px-3 py-2 text-left hover:bg-slate-800/50 transition-colors"
                          >
                            <span className="rounded bg-slate-700 px-1.5 py-0.5 text-[9px] text-slate-400 shrink-0">
                              {h.siteName}
                            </span>
                            <span className="text-xs text-slate-300 truncate">{h.title}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const quickLinks = [
  {
    title: 'Uppsala Conflict Data Program',
    description: 'Academic conflict database',
    url: 'https://en.wikipedia.org/wiki/Uppsala_Conflict_Data_Program',
    icon: '📊',
  },
  {
    title: 'Correlates of War Project',
    description: 'Quantitative conflict research',
    url: 'https://en.wikipedia.org/wiki/Correlates_of_War',
    icon: '📈',
  },
  {
    title: 'Global Peace Index',
    description: 'Annual peace rankings',
    url: 'https://en.wikipedia.org/wiki/Global_Peace_Index',
    icon: '🕊️',
  },
  {
    title: 'List of Ongoing Conflicts',
    description: 'Current armed conflicts worldwide',
    url: 'https://en.wikipedia.org/wiki/List_of_ongoing_armed_conflicts',
    icon: '🌍',
  },
  {
    title: 'Democratic Peace Theory',
    description: 'How democracy relates to peace',
    url: 'https://en.wikipedia.org/wiki/Democratic_peace_theory',
    icon: '🏛️',
  },
  {
    title: 'Geneva Conventions',
    description: 'International humanitarian law',
    url: 'https://en.wikipedia.org/wiki/Geneva_Conventions',
    icon: '⚖️',
  },
];

export default ArticleReader;
