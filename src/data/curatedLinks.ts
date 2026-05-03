export interface CuratedLink {
  label: string;
  url: string;
  source: 'wikipedia' | 'britannica' | 'scholar' | 'ucdp' | 'other';
}

const curatedLinks: Record<string, CuratedLink[]> = {
  'ww1': [
    { label: 'World War I', url: 'https://en.wikipedia.org/wiki/World_War_I', source: 'wikipedia' },
    { label: 'World War I - Britannica', url: 'https://www.britannica.com/event/World-War-I', source: 'britannica' },
    { label: 'Causes of World War I', url: 'https://en.wikipedia.org/wiki/Causes_of_World_War_I', source: 'wikipedia' },
  ],
  'ww2': [
    { label: 'World War II', url: 'https://en.wikipedia.org/wiki/World_War_II', source: 'wikipedia' },
    { label: 'World War II - Britannica', url: 'https://www.britannica.com/event/World-War-II', source: 'britannica' },
    { label: 'European Theatre', url: 'https://en.wikipedia.org/wiki/European_theatre_of_World_War_II', source: 'wikipedia' },
    { label: 'Pacific War', url: 'https://en.wikipedia.org/wiki/Pacific_War', source: 'wikipedia' },
  ],
  'korean-war': [
    { label: 'Korean War', url: 'https://en.wikipedia.org/wiki/Korean_War', source: 'wikipedia' },
    { label: 'Korean War - Britannica', url: 'https://www.britannica.com/event/Korean-War', source: 'britannica' },
  ],
  'vietnam-war': [
    { label: 'Vietnam War', url: 'https://en.wikipedia.org/wiki/Vietnam_War', source: 'wikipedia' },
    { label: 'Vietnam War - Britannica', url: 'https://www.britannica.com/event/Vietnam-War', source: 'britannica' },
    { label: 'Fall of Saigon', url: 'https://en.wikipedia.org/wiki/Fall_of_Saigon', source: 'wikipedia' },
  ],
  'soviet-afghan-war': [
    { label: 'Soviet-Afghan War', url: 'https://en.wikipedia.org/wiki/Soviet%E2%80%93Afghan_War', source: 'wikipedia' },
    { label: 'Soviet-Afghan War - Britannica', url: 'https://www.britannica.com/event/Soviet-invasion-of-Afghanistan', source: 'britannica' },
  ],
  'us-war-on-terror-afghanistan': [
    { label: 'War in Afghanistan (2001-2021)', url: 'https://en.wikipedia.org/wiki/War_in_Afghanistan_(2001%E2%80%932021)', source: 'wikipedia' },
    { label: 'Fall of Kabul (2021)', url: 'https://en.wikipedia.org/wiki/Fall_of_Kabul_(2021)', source: 'wikipedia' },
  ],
  'arab-israeli-1948': [
    { label: '1948 Arab-Israeli War', url: 'https://en.wikipedia.org/wiki/1948_Arab%E2%80%93Israeli_War', source: 'wikipedia' },
    { label: 'Arab-Israeli conflict', url: 'https://www.britannica.com/event/Arab-Israeli-wars', source: 'britannica' },
  ],
  'six-day-war': [
    { label: 'Six-Day War', url: 'https://en.wikipedia.org/wiki/Six-Day_War', source: 'wikipedia' },
    { label: 'Six-Day War - Britannica', url: 'https://www.britannica.com/event/Six-Day-War', source: 'britannica' },
  ],
  'yom-kippur-war': [
    { label: 'Yom Kippur War', url: 'https://en.wikipedia.org/wiki/Yom_Kippur_War', source: 'wikipedia' },
    { label: 'Yom Kippur War - Britannica', url: 'https://www.britannica.com/event/Yom-Kippur-War', source: 'britannica' },
  ],
  'iran-iraq-war': [
    { label: 'Iran-Iraq War', url: 'https://en.wikipedia.org/wiki/Iran%E2%80%93Iraq_War', source: 'wikipedia' },
    { label: 'Iran-Iraq War - Britannica', url: 'https://www.britannica.com/event/Iran-Iraq-War', source: 'britannica' },
  ],
  'gulf-war-1991': [
    { label: 'Gulf War', url: 'https://en.wikipedia.org/wiki/Gulf_War', source: 'wikipedia' },
    { label: 'Persian Gulf War - Britannica', url: 'https://www.britannica.com/event/Persian-Gulf-War', source: 'britannica' },
  ],
  'iraq-war-2003': [
    { label: 'Iraq War', url: 'https://en.wikipedia.org/wiki/Iraq_War', source: 'wikipedia' },
    { label: 'Iraq War - Britannica', url: 'https://www.britannica.com/event/Iraq-War', source: 'britannica' },
  ],
  'syrian-civil-war': [
    { label: 'Syrian Civil War', url: 'https://en.wikipedia.org/wiki/Syrian_civil_war', source: 'wikipedia' },
    { label: 'Syrian Civil War - Britannica', url: 'https://www.britannica.com/event/Syrian-Civil-War', source: 'britannica' },
  ],
  'russia-ukraine-war': [
    { label: 'Russian invasion of Ukraine', url: 'https://en.wikipedia.org/wiki/Russian_invasion_of_Ukraine', source: 'wikipedia' },
    { label: 'Russia-Ukraine War - Britannica', url: 'https://www.britannica.com/event/2022-Russian-invasion-of-Ukraine', source: 'britannica' },
  ],
  'rwandan-genocide': [
    { label: 'Rwandan genocide', url: 'https://en.wikipedia.org/wiki/Rwandan_genocide', source: 'wikipedia' },
    { label: 'Rwanda genocide - Britannica', url: 'https://www.britannica.com/event/Rwanda-genocide-of-1994', source: 'britannica' },
  ],
  'american-revolution': [
    { label: 'American Revolution', url: 'https://en.wikipedia.org/wiki/American_Revolution', source: 'wikipedia' },
    { label: 'American Revolution - Britannica', url: 'https://www.britannica.com/event/American-Revolution', source: 'britannica' },
  ],
  'french-revolution-wars': [
    { label: 'French Revolution', url: 'https://en.wikipedia.org/wiki/French_Revolution', source: 'wikipedia' },
    { label: 'French Revolution - Britannica', url: 'https://www.britannica.com/event/French-Revolution', source: 'britannica' },
  ],
  'napoleonic-wars': [
    { label: 'Napoleonic Wars', url: 'https://en.wikipedia.org/wiki/Napoleonic_Wars', source: 'wikipedia' },
    { label: 'Napoleonic Wars - Britannica', url: 'https://www.britannica.com/event/Napoleonic-Wars', source: 'britannica' },
  ],
  'us-civil-war': [
    { label: 'American Civil War', url: 'https://en.wikipedia.org/wiki/American_Civil_War', source: 'wikipedia' },
    { label: 'American Civil War - Britannica', url: 'https://www.britannica.com/event/American-Civil-War', source: 'britannica' },
  ],
  'falklands-war': [
    { label: 'Falklands War', url: 'https://en.wikipedia.org/wiki/Falklands_War', source: 'wikipedia' },
    { label: 'Falkland Islands War - Britannica', url: 'https://www.britannica.com/event/Falkland-Islands-War', source: 'britannica' },
  ],
  'bosnian-war': [
    { label: 'Bosnian War', url: 'https://en.wikipedia.org/wiki/Bosnian_War', source: 'wikipedia' },
    { label: 'Bosnian conflict - Britannica', url: 'https://www.britannica.com/event/Bosnian-conflict', source: 'britannica' },
  ],
  'kosovo-war': [
    { label: 'Kosovo War', url: 'https://en.wikipedia.org/wiki/Kosovo_War', source: 'wikipedia' },
  ],
  'yugoslav-wars': [
    { label: 'Yugoslav Wars', url: 'https://en.wikipedia.org/wiki/Yugoslav_Wars', source: 'wikipedia' },
  ],
  'cambodian-genocide': [
    { label: 'Cambodian genocide', url: 'https://en.wikipedia.org/wiki/Cambodian_genocide', source: 'wikipedia' },
    { label: 'Khmer Rouge', url: 'https://www.britannica.com/topic/Khmer-Rouge', source: 'britannica' },
  ],
  'spanish-civil-war': [
    { label: 'Spanish Civil War', url: 'https://en.wikipedia.org/wiki/Spanish_Civil_War', source: 'wikipedia' },
    { label: 'Spanish Civil War - Britannica', url: 'https://www.britannica.com/event/Spanish-Civil-War', source: 'britannica' },
  ],
  'cuban-revolution': [
    { label: 'Cuban Revolution', url: 'https://en.wikipedia.org/wiki/Cuban_Revolution', source: 'wikipedia' },
  ],
  'chinese-civil-war': [
    { label: 'Chinese Civil War', url: 'https://en.wikipedia.org/wiki/Chinese_Civil_War', source: 'wikipedia' },
  ],
  'russian-civil-war': [
    { label: 'Russian Civil War', url: 'https://en.wikipedia.org/wiki/Russian_Civil_War', source: 'wikipedia' },
  ],
  'first-congo-war': [
    { label: 'First Congo War', url: 'https://en.wikipedia.org/wiki/First_Congo_War', source: 'wikipedia' },
  ],
  'second-congo-war': [
    { label: 'Second Congo War', url: 'https://en.wikipedia.org/wiki/Second_Congo_War', source: 'wikipedia' },
  ],
  'algerian-independence': [
    { label: 'Algerian War', url: 'https://en.wikipedia.org/wiki/Algerian_War', source: 'wikipedia' },
  ],
  'irish-war-of-independence': [
    { label: 'Irish War of Independence', url: 'https://en.wikipedia.org/wiki/Irish_War_of_Independence', source: 'wikipedia' },
  ],
  'crimean-war': [
    { label: 'Crimean War', url: 'https://en.wikipedia.org/wiki/Crimean_War', source: 'wikipedia' },
  ],
  'opium-wars': [
    { label: 'Opium Wars', url: 'https://en.wikipedia.org/wiki/Opium_Wars', source: 'wikipedia' },
  ],
  'taiping-rebellion': [
    { label: 'Taiping Rebellion', url: 'https://en.wikipedia.org/wiki/Taiping_Rebellion', source: 'wikipedia' },
  ],
  'isis-insurgency': [
    { label: 'Islamic State of Iraq and the Levant', url: 'https://en.wikipedia.org/wiki/Islamic_State', source: 'wikipedia' },
  ],
  'arab-spring': [
    { label: 'Arab Spring', url: 'https://en.wikipedia.org/wiki/Arab_Spring', source: 'wikipedia' },
    { label: 'Arab Spring - Britannica', url: 'https://www.britannica.com/event/Arab-Spring', source: 'britannica' },
  ],
};

export function getCuratedLinks(conflictId: string): CuratedLink[] {
  return curatedLinks[conflictId] ?? [];
}

export function hasCuratedLinks(conflictId: string): boolean {
  return conflictId in curatedLinks;
}
