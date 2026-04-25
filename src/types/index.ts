export type ConflictType =
  | 'interstate_war'
  | 'civil_war'
  | 'colonial_war'
  | 'revolution'
  | 'genocide'
  | 'border_conflict'
  | 'proxy_war'
  | 'independence_war'
  | 'world_war'
  | 'religious_war'
  | 'trade_war'
  | 'rebellion'
  | 'insurgency'
  | 'ethnic_conflict'
  | 'gang_war'
  | 'cartel_war'
  | 'separatist_conflict';

export type PartyRole =
  | 'aggressor'
  | 'defender'
  | 'ally'
  | 'belligerent'
  | 'mediator'
  | 'coalition_member';

export interface CasualtyRange {
  low: number;
  high: number;
}

export interface ConflictParty {
  countryId: string;
  role: PartyRole;
  perspectiveNote?: string;
}

export interface ConflictPerspective {
  viewpoint: string;
  description: string;
  source: string;
}

export interface KeyFigure {
  name: string;
  role: string;
  country: string;
}

export interface Treaty {
  name: string;
  year: number;
  description: string;
}

export interface Conflict {
  id: string;
  name: string;
  alternateNames: { name: string; perspective: string }[];
  type: ConflictType;
  startYear: number;
  endYear: number | null;
  parties: ConflictParty[];
  casualties: {
    military: CasualtyRange | null;
    civilian: CasualtyRange | null;
    total: CasualtyRange | null;
    source: string;
  };
  territorialChanges: string | null;
  outcome: string;
  summary: string;
  perspectives: ConflictPerspective[];
  sources: string[];
  tags: string[];
  keyFigures?: KeyFigure[];
  treaties?: Treaty[];
  relatedConflicts?: string[];
}

export interface Country {
  id: string;
  name: string;
  historicalNames: { name: string; startYear: number; endYear: number | null }[];
  region: string;
  subregion: string;
  flagEmoji: string;
  independence?: number;
  governmentType?: string;
}

export type ColorMode = 'conflict_frequency' | 'active_conflicts' | 'peace_duration' | 'region';

export interface TimelineEvent {
  year: number;
  countryId: string;
  conflictId: string;
  eventType: 'start' | 'end' | 'major_battle' | 'treaty' | 'ceasefire' | 'escalation';
  description: string;
}

export interface CountryStats {
  totalConflicts: number;
  yearsAtWar: number;
  yearsAtPeace: number;
  deadliestConflict: Conflict | null;
  longestPeacePeriod: number;
  activeConflicts: Conflict[];
  peaceIndex: number;
}

export interface MapFeatureProperties {
  name: string;
  iso_a3: string;
  iso_a2: string;
}
