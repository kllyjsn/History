import { type FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface IntroTooltipProps {
  onDismiss: () => void;
}

const tips = [
  { icon: '🗺️', title: 'Explore the Map', text: 'Click any country to see its conflict history, peace index, and key figures.' },
  { icon: '⏳', title: 'Timeline Scrubber', text: 'Drag the timeline at the bottom to see which countries were at war in any year from 1500 to today.' },
  { icon: '🔍', title: 'Search', text: 'Press "/" to search for any country, conflict, or conflict type.' },
  { icon: '📊', title: 'Trends & Compare', text: 'Use the nav bar to view global trends, compare countries, or see active wars.' },
];

const IntroTooltip: FC<IntroTooltipProps> = ({ onDismiss }) => {
  const [step, setStep] = useState(0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onDismiss}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="mx-4 max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 text-center">
            <h2 className="text-xl font-bold text-white mb-1">Welcome to Peace and War</h2>
            <p className="text-sm text-slate-400">Interactive Geopolitical Atlas</p>
          </div>

          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 mb-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tips[step].icon}</span>
              <div>
                <p className="text-sm font-semibold text-white">{tips[step].title}</p>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">{tips[step].text}</p>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1.5">
              {tips.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${i === step ? 'w-4 bg-amber-400' : 'w-1.5 bg-slate-600'}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={onDismiss}
                className="rounded-lg px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                Skip
              </button>
              {step < tips.length - 1 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="rounded-lg bg-amber-500/20 px-4 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/30 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={onDismiss}
                  className="rounded-lg bg-amber-500/20 px-4 py-1.5 text-xs font-medium text-amber-400 hover:bg-amber-500/30 transition-colors"
                >
                  Start Exploring
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default IntroTooltip;
