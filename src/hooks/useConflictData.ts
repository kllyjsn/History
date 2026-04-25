import { useMemo } from 'react';
import { conflicts, getConflictsForCountry, getActiveConflicts } from '../data/conflicts';
import { countries } from '../data/countries';
import type { CountryStats } from '../types';
import { getYearsAtWar, getLongestPeacePeriod } from '../utils/formatters';

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
      result[id] = getLongestPeacePeriod(countryConflicts);
    }
    return result;
  }, []);

  const getCountryStats = useMemo(() => {
    return (countryId: string): CountryStats => {
      const countryConflicts = getConflictsForCountry(countryId);
      const yearsAtWar = getYearsAtWar(countryConflicts);
      const longestPeace = getLongestPeacePeriod(countryConflicts);
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

      return {
        totalConflicts: countryConflicts.length,
        yearsAtWar,
        yearsAtPeace: Math.max(0, new Date().getFullYear() - 1500 - yearsAtWar),
        deadliestConflict: deadliest,
        longestPeacePeriod: longestPeace,
        activeConflicts: active,
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
