import { useMemo } from 'react';
import { conflicts, getConflictsForCountry, getActiveConflicts } from '../data/conflicts';
import { countries } from '../data/countries';
import type { Country, CountryStats } from '../types';
import { getYearsAtWar, getLongestPeacePeriod } from '../utils/formatters';

function getEffectiveStartYear(country: Country): number {
  const candidates: number[] = [];
  if (country.independence) candidates.push(country.independence);
  for (const hn of country.historicalNames) {
    candidates.push(hn.startYear);
  }
  return candidates.length > 0 ? Math.min(...candidates) : 1500;
}

export function useConflictData() {
  const countryConflictCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const id of Object.keys(countries)) {
      counts[id] = getConflictsForCountry(id).length;
    }
    return counts;
  }, []);

  const activeConflictCountries = useMemo(() => {
    const active = getActiveConflicts();
    const set = new Set<string>();
    for (const c of active) {
      for (const p of c.parties) {
        set.add(p.countryId);
      }
    }
    return set;
  }, []);

  const peaceYears = useMemo(() => {
    const result: Record<string, number> = {};
    for (const id of Object.keys(countries)) {
      const countryConflicts = getConflictsForCountry(id);
      const startYear = getEffectiveStartYear(countries[id]);
      result[id] = getLongestPeacePeriod(countryConflicts, startYear);
    }
    return result;
  }, []);

  const getCountryStats = useMemo(() => {
    return (countryId: string): CountryStats => {
      const countryConflicts = getConflictsForCountry(countryId);
      const country = countries[countryId];
      const startYear = country ? getEffectiveStartYear(country) : 1500;
      const yearsAtWar = getYearsAtWar(countryConflicts, startYear);
      const longestPeace = getLongestPeacePeriod(countryConflicts, startYear);
      const active = countryConflicts.filter((c) => c.endYear === null);

      let deadliest = null;
      let maxCasualties = 0;
      for (const c of countryConflicts) {
        const total = c.casualties.total?.high ?? 0;
        if (total > maxCasualties) {
          maxCasualties = total;
          deadliest = c;
        }
      }

      const yearsAtPeace = Math.max(0, new Date().getFullYear() - startYear - yearsAtWar);
      const totalYears = yearsAtWar + yearsAtPeace;
      const peacePct = totalYears > 0 ? yearsAtPeace / totalYears : 1;
      const activeWeight = active.length > 0 ? 0.7 : 1;
      const conflictDensity = Math.max(0, 1 - countryConflicts.length / 50);
      const peaceIndex = Math.round((peacePct * 0.4 + activeWeight * 0.3 + conflictDensity * 0.3) * 100);

      return {
        totalConflicts: countryConflicts.length,
        yearsAtWar,
        yearsAtPeace,
        deadliestConflict: deadliest,
        longestPeacePeriod: longestPeace,
        activeConflicts: active,
        peaceIndex,
      };
    };
  }, []);

  const conflictsByDecade = useMemo(() => {
    const decades: Record<number, number> = {};
    for (let d = 1500; d <= 2020; d += 10) {
      decades[d] = 0;
    }
    for (const c of conflicts) {
      const startDecade = Math.floor(c.startYear / 10) * 10;
      if (decades[startDecade] !== undefined) {
        decades[startDecade]++;
      }
    }
    return Object.entries(decades).map(([decade, count]) => ({
      decade: Number(decade),
      count,
    }));
  }, []);

  const conflictsByType = useMemo(() => {
    const types: Record<string, number> = {};
    for (const c of conflicts) {
      types[c.type] = (types[c.type] ?? 0) + 1;
    }
    return Object.entries(types)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const deadliestConflicts = useMemo(() => {
    return [...conflicts]
      .filter((c) => c.casualties.total !== null)
      .sort((a, b) => (b.casualties.total?.high ?? 0) - (a.casualties.total?.high ?? 0))
      .slice(0, 15);
  }, []);

  return {
    conflicts,
    countries,
    countryConflictCounts,
    activeConflictCountries,
    peaceYears,
    getCountryStats,
    conflictsByDecade,
    conflictsByType,
    deadliestConflicts,
  };
}
