export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) {
    const k = n / 1_000;
    if (k >= 999.5) return `${(n / 1_000_000).toFixed(1)}M`;
    return `${k.toFixed(0)}K`;
  }
  return n.toLocaleString();
}

export function formatCasualtyRange(low: number, high: number): string {
  if (low === high) return formatNumber(low);
  return `${formatNumber(low)}–${formatNumber(high)}`;
}

export function formatDateRange(start: number, end: number | null): string {
  if (end === null) return `${start}–present`;
  if (start === end) return `${start}`;
  return `${start}–${end}`;
}

export function getYearsAtWar(
  conflicts: { startYear: number; endYear: number | null }[],
  earliestYear = 1500,
): number {
  const years = new Set<number>();
  const currentYear = new Date().getFullYear();
  for (const c of conflicts) {
    const start = Math.max(c.startYear, earliestYear);
    const end = c.endYear ?? currentYear;
    for (let y = start; y <= end; y++) {
      years.add(y);
    }
  }
  return years.size;
}

export function getLongestPeacePeriod(
  conflicts: { startYear: number; endYear: number | null }[],
  earliestYear = 1500,
): number {
  if (conflicts.length === 0) return new Date().getFullYear() - earliestYear;

  const currentYear = new Date().getFullYear();
  const warYears = new Set<number>();
  for (const c of conflicts) {
    const end = c.endYear ?? currentYear;
    for (let y = c.startYear; y <= end; y++) {
      warYears.add(y);
    }
  }

  let maxPeace = 0;
  let currentPeace = 0;
  for (let y = earliestYear; y <= currentYear; y++) {
    if (warYears.has(y)) {
      maxPeace = Math.max(maxPeace, currentPeace);
      currentPeace = 0;
    } else {
      currentPeace++;
    }
  }
  maxPeace = Math.max(maxPeace, currentPeace);
  return maxPeace;
}
