import { scaleLinear, scaleOrdinal } from 'd3';
import type { ColorMode } from '../types';
import { getNuclearStatus, getNuclearWarheadCount } from '../data/nuclear';

const CONFLICT_COLORS = ['#1e293b', '#854d0e', '#c2410c', '#dc2626', '#7f1d1d'];
const PEACE_COLORS = ['#7f1d1d', '#854d0e', '#365314', '#166534', '#14532d'];
const REGION_COLORS: Record<string, string> = {
  Europe: '#3b82f6',
  Asia: '#ef4444',
  Africa: '#f59e0b',
  Americas: '#22c55e',
  Oceania: '#a855f7',
};

const conflictScale = scaleLinear<string>()
  .domain([0, 3, 8, 20, 50])
  .range(CONFLICT_COLORS)
  .clamp(true);

const peaceScale = scaleLinear<string>()
  .domain([0, 10, 30, 75, 200])
  .range(PEACE_COLORS)
  .clamp(true);

const regionScale = scaleOrdinal<string>()
  .domain(Object.keys(REGION_COLORS))
  .range(Object.values(REGION_COLORS));

const NUCLEAR_COLORS: Record<string, string> = {
  declared: '#ef4444',
  undeclared: '#f97316',
  nato_sharing: '#3b82f6',
  former: '#8b5cf6',
  abandoned: '#22c55e',
  none: '#1e293b',
};

const nuclearWarheadScale = scaleLinear<string>()
  .domain([0, 50, 200, 500, 2000, 6000])
  .range(['#1e293b', '#92400e', '#dc2626', '#ef4444', '#f87171', '#fca5a5'])
  .clamp(true);

export function getCountryColor(
  mode: ColorMode,
  conflictCount: number,
  peaceYears: number,
  region: string,
  isActive: boolean,
  countryId?: string,
): string {
  switch (mode) {
    case 'conflict_frequency':
      return conflictScale(conflictCount);
    case 'active_conflicts':
      return isActive ? '#ef4444' : '#1e293b';
    case 'peace_duration':
      return peaceScale(peaceYears);
    case 'region':
      return regionScale(region) ?? '#334155';
    case 'nuclear': {
      if (!countryId) return '#1e293b';
      const status = getNuclearStatus(countryId);
      if (status === 'declared') return nuclearWarheadScale(getNuclearWarheadCount(countryId));
      return NUCLEAR_COLORS[status] ?? '#1e293b';
    }
    default:
      return '#334155';
  }
}

export function getConflictTypeColor(type: string): string {
  const map: Record<string, string> = {
    world_war: '#dc2626',
    interstate_war: '#ef4444',
    civil_war: '#f97316',
    colonial_war: '#a855f7',
    revolution: '#3b82f6',
    genocide: '#991b1b',
    border_conflict: '#eab308',
    proxy_war: '#f43f5e',
    independence_war: '#22c55e',
    religious_war: '#8b5cf6',
    trade_war: '#06b6d4',
    rebellion: '#e879f9',
    insurgency: '#fb923c',
    ethnic_conflict: '#f472b6',
    gang_war: '#b91c1c',
    cartel_war: '#92400e',
    separatist_conflict: '#7c3aed',
  };
  return map[type] ?? '#64748b';
}

export function getConflictTypeBadge(type: string): string {
  const map: Record<string, string> = {
    world_war: 'World War',
    interstate_war: 'Interstate War',
    civil_war: 'Civil War',
    colonial_war: 'Colonial War',
    revolution: 'Revolution',
    genocide: 'Genocide',
    border_conflict: 'Border Conflict',
    proxy_war: 'Proxy War',
    independence_war: 'Independence War',
    religious_war: 'Religious War',
    trade_war: 'Trade War',
    rebellion: 'Rebellion',
    insurgency: 'Insurgency',
    ethnic_conflict: 'Ethnic Conflict',
    gang_war: 'Gang War',
    cartel_war: 'Cartel War',
    separatist_conflict: 'Separatist Conflict',
  };
  return map[type] ?? type;
}
