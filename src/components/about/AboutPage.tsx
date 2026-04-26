import type { FC } from 'react';

interface AboutPageProps {
  onClose: () => void;
  totalConflicts: number;
  totalCountries: number;
}

const AboutPage: FC<AboutPageProps> = ({ onClose, totalConflicts, totalCountries }) => {
  return (
    <div className="absolute inset-0 z-40 overflow-y-auto bg-slate-900/98 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-3 py-4 sm:px-6 sm:py-8">
        <div className="flex items-center justify-between mb-4 sm:mb-8 gap-3">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-2xl font-bold text-white">About School of History</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Methodology, philosophy, and sources</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm text-slate-300 hover:bg-slate-800 transition-colors shrink-0"
          >
            Back to Map
          </button>
        </div>

        <div className="space-y-6">
          <Section title="Mission">
            <p>
              School of History exists to provide an accessible, bias-aware reference for the
              geopolitical history of armed conflicts worldwide. Our goal is to illuminate patterns
              that could contribute to lasting peace — by understanding how conflicts start, escalate,
              and end across different contexts and eras.
            </p>
          </Section>

          <Section title="Philosophy: Multiperspectivity">
            <p>
              History is written by the victors — and by their opponents, their allies, their descendants,
              and their scholars. Every conflict is experienced differently by each party involved. School
              of History presents <strong>2-4 perspectives</strong> for each conflict, drawn from academic
              sources representing different national, ideological, and analytical viewpoints.
            </p>
            <p className="mt-2">
              This is not false equivalence. We do not suggest all perspectives are equally valid — some
              conflicts have clear aggressors. But understanding <em>how each side frames events</em> is
              essential to understanding why conflicts persist and how they might be resolved.
            </p>
          </Section>

          <Section title="Bias Mitigation">
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Neutral language</strong>: We avoid terms like "terrorist" or "freedom fighter" in editorial text, using precise descriptors instead</li>
              <li><strong>Source attribution</strong>: Every perspective cites academic sources</li>
              <li><strong>Casualty ranges</strong>: We present low–high estimates rather than single figures</li>
              <li><strong>Multiple names</strong>: Conflicts are listed by all their commonly used names across perspectives</li>
              <li><strong>Natural Earth projection</strong>: Our map uses the Natural Earth projection to avoid the Eurocentric distortion of Mercator</li>
              <li><strong>Global coverage</strong>: We include colonial wars, indigenous resistance, and conflicts often excluded from Western-centric histories</li>
            </ul>
          </Section>

          <Section title="Peace Index">
            <p>
              Each country receives a Peace Index score (0–100) based on three weighted factors:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Peace percentage (40%)</strong>: Ratio of years at peace to total years in dataset</li>
              <li><strong>Active conflict penalty (30%)</strong>: Countries with ongoing conflicts receive a 30% penalty</li>
              <li><strong>Conflict density (30%)</strong>: Total number of conflicts relative to a baseline of 50</li>
            </ul>
            <p className="mt-2 text-slate-500 text-sm">
              This is a simplified heuristic for visualization purposes, not a comprehensive peace index.
              For rigorous peace measurement, see the Global Peace Index (IEP) or UCDP datasets.
            </p>
          </Section>

          <Section title="Nuclear Deterrence Data">
            <p>
              The nuclear overlay displays arsenals and deterrence postures for all 9 nuclear-armed states,
              plus former nuclear states, NATO nuclear-sharing countries, and nuclear umbrella coverage.
              Data includes warhead counts (deployed/reserve/retired), delivery systems, doctrine, treaty
              status, and program timelines.
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Warhead counts</strong>: From the Federation of American Scientists (FAS) Nuclear Notebook, the most widely cited open-source estimate</li>
              <li><strong>Delivery systems</strong>: Based on open-source intelligence, IISS Military Balance, and government publications</li>
              <li><strong>Doctrine</strong>: Summarized from official nuclear posture documents and academic analysis</li>
              <li><strong>Treaty status</strong>: Tracks NPT, New START, INF, CTBT, and other arms control agreements</li>
            </ul>
            <p className="mt-2 text-slate-500 text-sm">
              Nuclear weapons data is inherently opaque — exact figures are classified. All numbers
              represent best available estimates from authoritative open sources as of 2024.
            </p>
          </Section>

          <Section title="Data Sources">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <SourceCard
                name="Correlates of War Project"
                description="Systematic conflict data since 1816"
                url="https://correlatesofwar.org"
              />
              <SourceCard
                name="UCDP"
                description="Uppsala Conflict Data Program"
                url="https://ucdp.uu.se"
              />
              <SourceCard
                name="Global Peace Index"
                description="Institute for Economics & Peace"
                url="https://www.visionofhumanity.org"
              />
              <SourceCard
                name="FAS Nuclear Notebook"
                description="Federation of American Scientists — nuclear arsenal estimates"
                url="https://fas.org/issues/nuclear-weapons/nuclear-notebook"
              />
              <SourceCard
                name="SIPRI"
                description="Stockholm International Peace Research Institute"
                url="https://www.sipri.org"
              />
              <SourceCard
                name="Peer-reviewed literature"
                description="Cited per-conflict in each perspective card"
              />
            </div>
          </Section>

          <Section title="Coverage">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-2">
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{totalConflicts}</p>
                <p className="text-xs text-slate-400 mt-1">Conflicts documented</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{totalCountries}</p>
                <p className="text-xs text-slate-400 mt-1">Country profiles</p>
              </div>
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">1337–Present</p>
                <p className="text-xs text-slate-400 mt-1">Time span</p>
              </div>
            </div>
          </Section>

          <Section title="Limitations">
            <p>
              This is a curated dataset, not an exhaustive database. Gaps include: many pre-colonial
              African and Asian conflicts, minor border skirmishes, internal repression that did not
              meet armed-conflict thresholds, and ongoing events whose outcomes are not yet clear.
              Data will be expanded continuously.
            </p>
          </Section>

          <Section title="Goal: Patterns for Peace">
            <p>
              The ultimate purpose of this atlas is not to catalog violence, but to identify
              conditions under which peace prevails. Across our dataset, several patterns emerge:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Economic interdependence</strong> reduces interstate war probability</li>
              <li><strong>Democratic governance</strong> correlates with lower interstate conflict (but not necessarily civil conflict)</li>
              <li><strong>International institutions</strong> provide frameworks for dispute resolution</li>
              <li><strong>Post-conflict justice</strong> (truth commissions, tribunals) improves long-term stability</li>
              <li><strong>Inclusive governance</strong> reduces civil war recurrence</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/20 p-5">
      <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">{title}</h3>
      <div className="text-sm text-slate-300 leading-relaxed">{children}</div>
    </div>
  );
}

function SourceCard({ name, description, url }: { name: string; description: string; url?: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
      <p className="text-xs font-medium text-white">{name}</p>
      <p className="text-[10px] text-slate-400 mt-0.5">{description}</p>
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-blue-400 hover:underline mt-1 inline-block"
        >
          {url}
        </a>
      )}
    </div>
  );
}

export default AboutPage;
