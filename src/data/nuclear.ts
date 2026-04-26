export type NuclearStatus = 'declared' | 'undeclared' | 'nato_sharing' | 'former' | 'abandoned' | 'none';

export interface DeliverySystem {
  name: string;
  type: 'ICBM' | 'SLBM' | 'bomber' | 'tactical' | 'cruise_missile' | 'artillery';
  range_km: number;
  warheads: number;
  details: string;
}

export interface NuclearTest {
  name: string;
  year: number;
  yield_kt: number;
  location: string;
}

export interface NuclearTreaty {
  name: string;
  year: number;
  status: 'active' | 'expired' | 'withdrawn' | 'signed_not_ratified';
  description: string;
}

export interface NuclearProgram {
  countryId: string;
  status: NuclearStatus;
  totalWarheads: number;
  deployedWarheads: number;
  reserveWarheads: number;
  retiredAwaitingDismantlement: number;
  firstTest: NuclearTest | null;
  largestTest: NuclearTest | null;
  deliverySystems: DeliverySystem[];
  doctrine: string;
  doctrineDetails: string;
  treaties: NuclearTreaty[];
  timeline: { year: number; event: string }[];
  notes: string;
}

export const nuclearPrograms: Record<string, NuclearProgram> = {
  USA: {
    countryId: 'USA',
    status: 'declared',
    totalWarheads: 5044,
    deployedWarheads: 1670,
    reserveWarheads: 1938,
    retiredAwaitingDismantlement: 1436,
    firstTest: { name: 'Trinity', year: 1945, yield_kt: 21, location: 'Alamogordo, New Mexico' },
    largestTest: { name: 'Castle Bravo', year: 1954, yield_kt: 15000, location: 'Bikini Atoll, Marshall Islands' },
    deliverySystems: [
      { name: 'Minuteman III', type: 'ICBM', range_km: 13000, warheads: 400, details: 'Land-based, silo-launched, W78/W87 warheads' },
      { name: 'Trident II D5', type: 'SLBM', range_km: 12000, warheads: 960, details: '14 Ohio-class SSBNs, W76-1/W88 warheads' },
      { name: 'B-2 Spirit', type: 'bomber', range_km: 11000, warheads: 0, details: 'Stealth bomber, B61/B83 gravity bombs' },
      { name: 'B-52H Stratofortress', type: 'bomber', range_km: 16000, warheads: 0, details: 'AGM-86B ALCMs, longest-serving bomber' },
      { name: 'B61 Tactical', type: 'tactical', range_km: 0, warheads: 100, details: 'NATO forward-deployed in Europe (Belgium, Germany, Italy, Netherlands, Turkey)' },
    ],
    doctrine: 'Flexible Response / Nuclear Triad',
    doctrineDetails: 'The US maintains a nuclear triad (ICBMs, SLBMs, strategic bombers) for second-strike capability. Doctrine includes "calculated ambiguity" on first use, with stated willingness to use nuclear weapons to deter conventional, biological, or chemical attacks against the US or its allies. Launch authority rests solely with the President.',
    treaties: [
      { name: 'NPT', year: 1968, status: 'active', description: 'Nuclear Non-Proliferation Treaty signatory as nuclear-weapon state' },
      { name: 'New START', year: 2010, status: 'active', description: 'Limits deployed strategic warheads to 1,550, extended to 2026' },
      { name: 'INF Treaty', year: 1987, status: 'expired', description: 'Eliminated intermediate-range missiles, US withdrew 2019' },
      { name: 'ABM Treaty', year: 1972, status: 'expired', description: 'Limited anti-ballistic missile systems, US withdrew 2002' },
      { name: 'CTBT', year: 1996, status: 'signed_not_ratified', description: 'Comprehensive Test Ban Treaty, signed but Senate has not ratified' },
      { name: 'PTBT', year: 1963, status: 'active', description: 'Partial Test Ban Treaty, banned atmospheric/underwater/space tests' },
    ],
    timeline: [
      { year: 1942, event: 'Manhattan Project begins' },
      { year: 1945, event: 'Trinity test — first nuclear detonation (21 kt)' },
      { year: 1945, event: 'Hiroshima (Little Boy, 15 kt) and Nagasaki (Fat Man, 21 kt)' },
      { year: 1952, event: 'First thermonuclear (hydrogen) bomb test — Ivy Mike (10.4 Mt)' },
      { year: 1954, event: 'Castle Bravo — largest US test (15 Mt), fallout contamination incident' },
      { year: 1962, event: 'Cuban Missile Crisis — closest to nuclear war' },
      { year: 1967, event: 'Peak stockpile: ~31,255 warheads' },
      { year: 1972, event: 'SALT I / ABM Treaty signed with USSR' },
      { year: 1987, event: 'INF Treaty — eliminated intermediate-range missiles' },
      { year: 1991, event: 'START I signed, major reductions begin' },
      { year: 1992, event: 'Last US nuclear test (Divider, underground)' },
      { year: 2010, event: 'New START signed with Russia' },
    ],
    notes: 'Only country to have used nuclear weapons in warfare. Maintains ~100 tactical B61 bombs forward-deployed in 5 NATO countries.',
  },
  RUS: {
    countryId: 'RUS',
    status: 'declared',
    totalWarheads: 5580,
    deployedWarheads: 1674,
    reserveWarheads: 2815,
    retiredAwaitingDismantlement: 1091,
    firstTest: { name: 'Joe-1 / RDS-1', year: 1949, yield_kt: 22, location: 'Semipalatinsk, Kazakhstan' },
    largestTest: { name: 'Tsar Bomba', year: 1961, yield_kt: 50000, location: 'Novaya Zemlya, Arctic' },
    deliverySystems: [
      { name: 'RS-28 Sarmat', type: 'ICBM', range_km: 18000, warheads: 46, details: 'Newest heavy ICBM, replaces R-36M2, 10-15 MIRVed warheads' },
      { name: 'RT-2PM2 Topol-M', type: 'ICBM', range_km: 11000, warheads: 78, details: 'Road-mobile and silo-based, single warhead' },
      { name: 'RS-24 Yars', type: 'ICBM', range_km: 12000, warheads: 234, details: 'Road-mobile, MIRVed (3-6 warheads), backbone of ground force' },
      { name: 'RSM-56 Bulava', type: 'SLBM', range_km: 8300, warheads: 576, details: '6 Borei-class SSBNs, 6 MIRVed warheads per missile' },
      { name: 'Tu-160 Blackjack', type: 'bomber', range_km: 12300, warheads: 0, details: 'Strategic bomber, Kh-102 ALCMs' },
      { name: 'Tu-95MS Bear', type: 'bomber', range_km: 15000, warheads: 0, details: 'Turboprop strategic bomber, Kh-55/Kh-102 ALCMs' },
      { name: '9K720 Iskander', type: 'tactical', range_km: 500, warheads: 0, details: 'Dual-capable tactical ballistic missile' },
    ],
    doctrine: 'Escalate to De-escalate',
    doctrineDetails: 'Russia reserves the right to use nuclear weapons in response to nuclear or WMD attacks, or when conventional warfare threatens the existence of the state. The 2020 nuclear deterrence policy allows first use if Russia faces aggression with conventional weapons that threatens state existence. Maintains "dead hand" (Perimeter) automated launch system.',
    treaties: [
      { name: 'NPT', year: 1968, status: 'active', description: 'Signatory as nuclear-weapon state (succeeded USSR)' },
      { name: 'New START', year: 2010, status: 'active', description: 'Suspended participation in 2023, limits remain nominal' },
      { name: 'INF Treaty', year: 1987, status: 'expired', description: 'Collapsed 2019 after mutual withdrawal' },
      { name: 'CTBT', year: 1996, status: 'active', description: 'Signed and ratified, though withdrew ratification in 2023' },
    ],
    timeline: [
      { year: 1949, event: 'First Soviet nuclear test — RDS-1 (22 kt)' },
      { year: 1953, event: 'First thermonuclear test — Joe-4 (400 kt)' },
      { year: 1961, event: 'Tsar Bomba — largest nuclear detonation ever (50 Mt)' },
      { year: 1962, event: 'Cuban Missile Crisis' },
      { year: 1986, event: 'Peak Soviet stockpile: ~45,000 warheads' },
      { year: 1991, event: 'USSR dissolves, Russia inherits nuclear arsenal' },
      { year: 1994, event: 'Budapest Memorandum — Ukraine transfers warheads to Russia' },
      { year: 2018, event: 'Putin announces hypersonic weapons (Avangard, Kinzhal)' },
      { year: 2023, event: 'Suspends New START participation, revokes CTBT ratification' },
    ],
    notes: 'Largest nuclear arsenal in the world. Inherited USSR stockpile. Maintains Perimeter ("Dead Hand") automated nuclear launch system. Deployed tactical nuclear weapons in Belarus in 2023.',
  },
  CHN: {
    countryId: 'CHN',
    status: 'declared',
    totalWarheads: 500,
    deployedWarheads: 24,
    reserveWarheads: 476,
    retiredAwaitingDismantlement: 0,
    firstTest: { name: '596', year: 1964, yield_kt: 22, location: 'Lop Nur, Xinjiang' },
    largestTest: { name: 'Test No. 6', year: 1976, yield_kt: 4000, location: 'Lop Nur, Xinjiang' },
    deliverySystems: [
      { name: 'DF-41', type: 'ICBM', range_km: 14000, warheads: 0, details: 'Road-mobile, MIRVed (up to 10), newest ICBM' },
      { name: 'DF-5B', type: 'ICBM', range_km: 13000, warheads: 0, details: 'Silo-based, MIRVed, liquid-fueled' },
      { name: 'DF-31AG', type: 'ICBM', range_km: 11200, warheads: 0, details: 'Road-mobile, solid-fueled' },
      { name: 'JL-3', type: 'SLBM', range_km: 10000, warheads: 0, details: 'Type 094/096 SSBNs, MIRVed' },
      { name: 'H-6N', type: 'bomber', range_km: 6000, warheads: 0, details: 'Air-launched ballistic missile carrier' },
    ],
    doctrine: 'No First Use (NFU)',
    doctrineDetails: 'China has maintained an unconditional No First Use policy since 1964. Nuclear weapons are for retaliatory second strike only. China pledges not to use nuclear weapons against non-nuclear states. Currently undergoing the largest nuclear buildup in history, with Pentagon estimates of 1,000+ warheads by 2030 and 1,500 by 2035.',
    treaties: [
      { name: 'NPT', year: 1968, status: 'active', description: 'Signatory as nuclear-weapon state (joined 1992)' },
      { name: 'CTBT', year: 1996, status: 'signed_not_ratified', description: 'Signed but not ratified' },
    ],
    timeline: [
      { year: 1955, event: 'Decision to develop nuclear weapons after Korean War' },
      { year: 1964, event: 'First nuclear test — 596 (22 kt), No First Use declared' },
      { year: 1967, event: 'First thermonuclear test (3.3 Mt)' },
      { year: 1980, event: 'Last atmospheric test' },
      { year: 1996, event: 'Last nuclear test, signs CTBT' },
      { year: 2020, event: 'Rapid expansion: new silo fields detected via satellite' },
      { year: 2023, event: 'Pentagon estimates ~500 warheads, rapid buildup underway' },
    ],
    notes: 'Undergoing largest nuclear buildup in history. Building 300+ new ICBM silos in western China. Only P5 state with unconditional NFU policy.',
  },
  FRA: {
    countryId: 'FRA',
    status: 'declared',
    totalWarheads: 290,
    deployedWarheads: 280,
    reserveWarheads: 10,
    retiredAwaitingDismantlement: 0,
    firstTest: { name: 'Gerboise Bleue', year: 1960, yield_kt: 70, location: 'Reggane, French Algeria' },
    largestTest: { name: 'Canopus', year: 1968, yield_kt: 2600, location: 'Fangataufa, French Polynesia' },
    deliverySystems: [
      { name: 'M51', type: 'SLBM', range_km: 10000, warheads: 240, details: '4 Triomphant-class SSBNs, 6 TN 75 warheads per missile' },
      { name: 'ASMP-A', type: 'cruise_missile', range_km: 500, warheads: 50, details: 'Air-launched nuclear cruise missile, Rafale/Mirage 2000N' },
    ],
    doctrine: 'Strict Sufficiency / Dissuasion',
    doctrineDetails: 'France maintains an independent nuclear deterrent ("Force de dissuasion") outside NATO nuclear planning. Doctrine of "strict sufficiency" — minimum arsenal needed for credible deterrence. President has sole launch authority. Will use nuclear weapons if vital interests of France are threatened, deliberately ambiguous about what constitutes vital interests.',
    treaties: [
      { name: 'NPT', year: 1968, status: 'active', description: 'Signatory as nuclear-weapon state (joined 1992)' },
      { name: 'CTBT', year: 1996, status: 'active', description: 'Signed and ratified' },
    ],
    timeline: [
      { year: 1960, event: 'First nuclear test — Gerboise Bleue (70 kt) in Algeria' },
      { year: 1966, event: 'First thermonuclear test — Canopus (2.6 Mt)' },
      { year: 1966, event: 'Withdraws from NATO military structure (returns 2009)' },
      { year: 1996, event: 'Last nuclear test, signs CTBT, dismantles Pacific test sites' },
      { year: 2008, event: 'Reduces arsenal to fewer than 300 warheads' },
    ],
    notes: 'Only nuclear-armed EU member. Maintains continuous at-sea deterrent (CASD). Dismantled all land-based missiles and test facilities.',
  },
  GBR: {
    countryId: 'GBR',
    status: 'declared',
    totalWarheads: 225,
    deployedWarheads: 120,
    reserveWarheads: 105,
    retiredAwaitingDismantlement: 0,
    firstTest: { name: 'Hurricane', year: 1952, yield_kt: 25, location: 'Montebello Islands, Australia' },
    largestTest: { name: 'Grapple Y', year: 1958, yield_kt: 3000, location: 'Christmas Island, Pacific' },
    deliverySystems: [
      { name: 'Trident II D5', type: 'SLBM', range_km: 12000, warheads: 120, details: '4 Vanguard-class SSBNs, Holbrook warheads, leased from US' },
    ],
    doctrine: 'Minimum Credible Deterrent',
    doctrineDetails: 'UK maintains a continuous at-sea deterrent (CASD) — at least one SSBN on patrol at all times since 1969. Uses US Trident II D5 missiles via Polaris Sales Agreement. The PM writes "letters of last resort" to submarine commanders with instructions for retaliation if the government is destroyed. Deliberately ambiguous on circumstances for use.',
    treaties: [
      { name: 'NPT', year: 1968, status: 'active', description: 'Signatory as nuclear-weapon state' },
      { name: 'CTBT', year: 1996, status: 'active', description: 'Signed and ratified' },
    ],
    timeline: [
      { year: 1952, event: 'First nuclear test — Hurricane (25 kt)' },
      { year: 1957, event: 'First thermonuclear test — Grapple (1.8 Mt)' },
      { year: 1958, event: 'US-UK Mutual Defence Agreement — nuclear sharing' },
      { year: 1969, event: 'Begins continuous at-sea deterrent (CASD)' },
      { year: 1991, event: 'Last nuclear test (underground, Nevada)' },
      { year: 2021, event: 'Increases warhead cap from 180 to 260' },
    ],
    notes: 'Smallest P5 arsenal. Only delivery system is submarine-based Trident. "Letters of last resort" written by each new PM.',
  },
  IND: {
    countryId: 'IND',
    status: 'declared',
    totalWarheads: 172,
    deployedWarheads: 0,
    reserveWarheads: 172,
    retiredAwaitingDismantlement: 0,
    firstTest: { name: 'Smiling Buddha', year: 1974, yield_kt: 12, location: 'Pokhran, Rajasthan' },
    largestTest: { name: 'Shakti I', year: 1998, yield_kt: 45, location: 'Pokhran, Rajasthan' },
    deliverySystems: [
      { name: 'Agni-V', type: 'ICBM', range_km: 5500, warheads: 0, details: 'Road-mobile, solid-fueled, MIRVed capable' },
      { name: 'Agni-IV', type: 'ICBM', range_km: 4000, warheads: 0, details: 'Intermediate-range ballistic missile' },
      { name: 'K-4/K-15', type: 'SLBM', range_km: 3500, warheads: 0, details: 'INS Arihant-class SSBNs' },
      { name: 'BrahMos (nuclear variant)', type: 'cruise_missile', range_km: 600, warheads: 0, details: 'Supersonic cruise missile, dual-capable' },
      { name: 'Rafale/Jaguar', type: 'bomber', range_km: 1800, warheads: 0, details: 'Fighter-bombers with nuclear gravity bombs' },
    ],
    doctrine: 'No First Use / Credible Minimum Deterrence',
    doctrineDetails: 'India declared No First Use in 2003 nuclear doctrine. Nuclear weapons would only be used in retaliation against a nuclear attack. Response to a nuclear attack would be "massive and designed to inflict unacceptable damage." Nuclear command authority rests with the Political Council chaired by PM. Building nuclear triad capability.',
    treaties: [],
    timeline: [
      { year: 1974, event: 'Smiling Buddha — "peaceful nuclear explosion" (12 kt)' },
      { year: 1998, event: 'Pokhran-II — 5 tests (Shakti I-V), declares nuclear power' },
      { year: 2003, event: 'Nuclear doctrine: NFU, credible minimum deterrence' },
      { year: 2016, event: 'INS Arihant — nuclear triad achieved with SSBN' },
      { year: 2022, event: 'Agni-V MIRV test' },
    ],
    notes: 'Not an NPT signatory. Developing nuclear triad. Nuclear command under Strategic Forces Command. Major regional rival: Pakistan.',
  },
  PAK: {
    countryId: 'PAK',
    status: 'declared',
    totalWarheads: 170,
    deployedWarheads: 0,
    reserveWarheads: 170,
    retiredAwaitingDismantlement: 0,
    firstTest: { name: 'Chagai-I', year: 1998, yield_kt: 40, location: 'Ras Koh Hills, Balochistan' },
    largestTest: { name: 'Chagai-I', year: 1998, yield_kt: 40, location: 'Ras Koh Hills, Balochistan' },
    deliverySystems: [
      { name: 'Shaheen-III', type: 'ICBM', range_km: 2750, warheads: 0, details: 'Solid-fueled MRBM, can reach all of India and Israel' },
      { name: 'Shaheen-II', type: 'ICBM', range_km: 1500, warheads: 0, details: 'Solid-fueled medium-range' },
      { name: 'Babur', type: 'cruise_missile', range_km: 700, warheads: 0, details: 'Ground- and sea-launched cruise missile, terrain-hugging' },
      { name: 'Ra\'ad', type: 'cruise_missile', range_km: 350, warheads: 0, details: 'Air-launched cruise missile' },
      { name: 'Nasr (Hatf-IX)', type: 'tactical', range_km: 70, warheads: 0, details: 'Tactical nuclear missile, designed to counter India\'s Cold Start doctrine' },
    ],
    doctrine: 'First Use / Full Spectrum Deterrence',
    doctrineDetails: 'Pakistan explicitly reserves the right to first use of nuclear weapons against India, particularly if: (1) India attacks Pakistan with nuclear weapons, (2) India conquers a large part of Pakistani territory, (3) India strangles Pakistan economically, or (4) India destabilizes Pakistan domestically. Tactical nuclear weapons (Nasr) developed specifically to counter India\'s conventional superiority. National Command Authority controls arsenal.',
    treaties: [],
    timeline: [
      { year: 1972, event: 'Zulfikar Ali Bhutto initiates nuclear program after Bangladesh war' },
      { year: 1976, event: 'A.Q. Khan brings centrifuge technology from Netherlands' },
      { year: 1998, event: 'Chagai tests — 6 tests in response to India\'s Pokhran-II' },
      { year: 2004, event: 'A.Q. Khan proliferation network exposed (Libya, Iran, North Korea)' },
      { year: 2011, event: 'Nasr tactical nuclear missile tested — full spectrum deterrence' },
    ],
    notes: 'Not an NPT signatory. Fastest-growing nuclear arsenal. A.Q. Khan proliferation network spread nuclear technology to Libya, Iran, and North Korea. Tactical nuclear weapons raise concerns about escalation ladder.',
  },
  ISR: {
    countryId: 'ISR',
    status: 'undeclared',
    totalWarheads: 90,
    deployedWarheads: 0,
    reserveWarheads: 90,
    retiredAwaitingDismantlement: 0,
    firstTest: { name: 'Vela Incident (suspected)', year: 1979, yield_kt: 3, location: 'South Indian Ocean (suspected)' },
    largestTest: null,
    deliverySystems: [
      { name: 'Jericho III', type: 'ICBM', range_km: 6500, warheads: 0, details: 'Silo- or TEL-launched, MIRV-capable' },
      { name: 'Popeye Turbo (Dolphin-class)', type: 'SLBM', range_km: 1500, warheads: 0, details: 'Submarine-launched cruise missiles, 6 Dolphin-class subs' },
      { name: 'F-35I Adir', type: 'bomber', range_km: 2200, warheads: 0, details: 'Dual-capable fighter, can deliver gravity bombs' },
    ],
    doctrine: 'Nuclear Ambiguity / "Samson Option"',
    doctrineDetails: 'Israel maintains a policy of nuclear ambiguity ("amimut") — neither confirming nor denying possession. The "Samson Option" doctrine implies massive retaliation if Israel faces existential threat. Mordechai Vanunu revealed details in 1986. Israel has never officially conducted a nuclear test, though the 1979 Vela Incident (double flash detected by satellite over South Indian Ocean) is widely attributed to a joint Israeli-South African test.',
    treaties: [],
    timeline: [
      { year: 1952, event: 'Israel Atomic Energy Commission established' },
      { year: 1958, event: 'Dimona reactor construction begins with French assistance' },
      { year: 1966, event: 'Estimated to have first nuclear weapon' },
      { year: 1973, event: 'Yom Kippur War — reportedly readied nuclear weapons' },
      { year: 1979, event: 'Vela Incident — suspected nuclear test' },
      { year: 1986, event: 'Mordechai Vanunu reveals nuclear program to Sunday Times' },
    ],
    notes: 'Only nuclear-armed state that has not officially tested or acknowledged its arsenal. Not an NPT signatory. "Samson Option" — existential last resort. Dimona reactor is the production facility.',
  },
  PRK: {
    countryId: 'PRK',
    status: 'declared',
    totalWarheads: 50,
    deployedWarheads: 0,
    reserveWarheads: 50,
    retiredAwaitingDismantlement: 0,
    firstTest: { name: 'Punggye-ri 1', year: 2006, yield_kt: 1, location: 'Punggye-ri, North Hamgyong' },
    largestTest: { name: 'Punggye-ri 6', year: 2017, yield_kt: 250, location: 'Punggye-ri, North Hamgyong' },
    deliverySystems: [
      { name: 'Hwasong-17', type: 'ICBM', range_km: 15000, warheads: 0, details: 'Road-mobile, liquid-fueled, largest DPRK missile' },
      { name: 'Hwasong-18', type: 'ICBM', range_km: 15000, warheads: 0, details: 'First solid-fueled ICBM, road-mobile' },
      { name: 'Hwasong-15', type: 'ICBM', range_km: 13000, warheads: 0, details: 'Can reach entire US mainland' },
      { name: 'Pukguksong-3', type: 'SLBM', range_km: 2000, warheads: 0, details: 'Submarine-launched, solid-fueled' },
      { name: 'KN-23 / KN-24', type: 'tactical', range_km: 600, warheads: 0, details: 'Short-range, maneuverable, nuclear-capable' },
    ],
    doctrine: 'Regime Survival / Pre-emptive Strike',
    doctrineDetails: '2022 nuclear doctrine law codifies: (1) Nuclear weapons ensure regime survival, (2) Pre-emptive nuclear strike authorized if command/control threatened, (3) Automatic nuclear retaliation if leadership attacked, (4) Cannot be used for coercion or as bargaining chip. Kim Jong-un has sole authority.',
    treaties: [],
    timeline: [
      { year: 1962, event: 'Yongbyon Nuclear Scientific Research Center established' },
      { year: 1993, event: 'First North Korean nuclear crisis, threatens to leave NPT' },
      { year: 2003, event: 'Withdraws from NPT' },
      { year: 2006, event: 'First nuclear test (~1 kt), widely condemned' },
      { year: 2009, event: 'Second nuclear test (~4 kt)' },
      { year: 2013, event: 'Third test, claims miniaturized warhead' },
      { year: 2016, event: 'Fourth test (claims H-bomb) and fifth test' },
      { year: 2017, event: 'Sixth test (~250 kt, thermonuclear), Hwasong-15 ICBM test' },
      { year: 2018, event: 'Singapore summit with Trump, moratorium on ICBM tests' },
      { year: 2022, event: 'Record missile launches, new doctrine law, Hwasong-17/18 tests' },
      { year: 2023, event: 'Hwasong-18 solid-fuel ICBM tested, satellite launch attempts' },
    ],
    notes: 'Only country to have tested nuclear weapons in the 21st century. Withdrew from NPT in 2003. Six nuclear tests 2006-2017. Rapid ICBM development threatens US mainland. Subject to extensive UN sanctions.',
  },
};

// Countries that formerly had nuclear weapons or hosted them
export const formerNuclearStates: Record<string, { countryId: string; status: NuclearStatus; details: string; years: string }> = {
  UKR: { countryId: 'UKR', status: 'former', details: 'Inherited ~1,900 Soviet warheads. Transferred all to Russia by 1996 under Budapest Memorandum.', years: '1991–1996' },
  KAZ: { countryId: 'KAZ', status: 'former', details: 'Inherited ~1,400 Soviet warheads. Transferred all to Russia by 1995. Semipalatinsk Test Site (456 Soviet tests).', years: '1991–1995' },
  BLR: { countryId: 'BLR', status: 'former', details: 'Inherited ~81 Soviet warheads. Transferred all to Russia by 1996. Russia has redeployed tactical nuclear weapons to Belarus since 2023.', years: '1991–1996' },
  ZAF: { countryId: 'ZAF', status: 'abandoned', details: 'Built 6 nuclear weapons (7th in progress). Only country to independently develop and then voluntarily dismantle its nuclear arsenal.', years: '1979–1991' },
};

// NATO nuclear sharing countries (host US B61 bombs)
export const natoNuclearSharing: string[] = ['BEL', 'DEU', 'ITA', 'NLD', 'TUR'];

// Countries under nuclear umbrella
export const nuclearUmbrella: Record<string, string[]> = {
  USA: ['JPN', 'KOR', 'AUS', 'BEL', 'DEU', 'ITA', 'NLD', 'TUR', 'CAN', 'GBR', 'FRA', 'NOR', 'DNK', 'ESP', 'PRT', 'POL', 'CZE', 'HUN', 'ROU', 'BGR', 'GRC', 'EST', 'LVA', 'LTU', 'SVK', 'SVN', 'HRV'],
  RUS: ['BLR'],
};

// Key nuclear events for timeline
export const nuclearTimelineEvents: { year: number; event: string; significance: 'critical' | 'major' | 'notable' }[] = [
  { year: 1938, event: 'Nuclear fission discovered (Hahn, Meitner, Strassmann)', significance: 'critical' },
  { year: 1942, event: 'Manhattan Project begins', significance: 'critical' },
  { year: 1945, event: 'Trinity test, Hiroshima and Nagasaki bombings', significance: 'critical' },
  { year: 1949, event: 'Soviet Union tests first nuclear weapon', significance: 'critical' },
  { year: 1952, event: 'US tests first thermonuclear weapon (Ivy Mike)', significance: 'major' },
  { year: 1952, event: 'UK tests first nuclear weapon', significance: 'major' },
  { year: 1954, event: 'Castle Bravo fallout incident — global anti-nuclear movement begins', significance: 'major' },
  { year: 1960, event: 'France tests first nuclear weapon', significance: 'major' },
  { year: 1962, event: 'Cuban Missile Crisis — closest to nuclear war', significance: 'critical' },
  { year: 1963, event: 'Partial Test Ban Treaty signed', significance: 'major' },
  { year: 1964, event: 'China tests first nuclear weapon', significance: 'major' },
  { year: 1967, event: 'Treaty of Tlatelolco — Latin American NWFZ', significance: 'notable' },
  { year: 1968, event: 'Nuclear Non-Proliferation Treaty (NPT) opened for signature', significance: 'critical' },
  { year: 1974, event: 'India conducts "peaceful nuclear explosion"', significance: 'major' },
  { year: 1979, event: 'Vela Incident — suspected Israeli-South African test', significance: 'notable' },
  { year: 1983, event: 'Able Archer 83 — NATO exercise nearly triggers Soviet launch', significance: 'critical' },
  { year: 1986, event: 'Reykjavik Summit — Reagan and Gorbachev discuss eliminating all nukes', significance: 'major' },
  { year: 1987, event: 'INF Treaty eliminates intermediate-range missiles', significance: 'major' },
  { year: 1991, event: 'Soviet Union dissolves — 4 states inherit nuclear weapons', significance: 'critical' },
  { year: 1991, event: 'South Africa dismantles its nuclear weapons', significance: 'notable' },
  { year: 1996, event: 'CTBT opened for signature — ends nuclear testing era', significance: 'major' },
  { year: 1998, event: 'India and Pakistan both test nuclear weapons', significance: 'critical' },
  { year: 2003, event: 'North Korea withdraws from NPT', significance: 'major' },
  { year: 2006, event: 'North Korea conducts first nuclear test', significance: 'major' },
  { year: 2015, event: 'Iran nuclear deal (JCPOA) signed', significance: 'major' },
  { year: 2017, event: 'TPNW (Treaty on Prohibition of Nuclear Weapons) adopted', significance: 'notable' },
  { year: 2017, event: 'North Korea tests thermonuclear weapon and ICBM', significance: 'critical' },
  { year: 2019, event: 'INF Treaty collapses', significance: 'major' },
  { year: 2023, event: 'Russia suspends New START, deploys tactical nukes to Belarus', significance: 'major' },
];

export function getNuclearWarheadCount(countryId: string): number {
  return nuclearPrograms[countryId]?.totalWarheads ?? 0;
}

export function getNuclearStatus(countryId: string): NuclearStatus {
  if (nuclearPrograms[countryId]) return nuclearPrograms[countryId].status;
  if (formerNuclearStates[countryId]) return formerNuclearStates[countryId].status;
  if (natoNuclearSharing.includes(countryId)) return 'nato_sharing';
  return 'none';
}
