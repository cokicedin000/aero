export type Airport = {
  city: string;
  name: string;
  code: string; // IATA
  group?: string; // e.g., region section title
};

export const AIRPORTS: Airport[] = [
  { group: "Private Terminals", city: "Aspen", name: "Aspen/Pitkin County Airport", code: "ASE" },
  { group: "Las Vegas", city: "Las Vegas", name: "Harry Reid International Airport", code: "LAS" },
  { group: "Los Angeles", city: "Los Angeles", name: "Van Nuys Airport", code: "VNY" },
  { group: "Los Cabos", city: "Los Cabos", name: "San José del Cabo Airport", code: "SJD" },
  { group: "Napa Valley", city: "Napa Valley", name: "Napa County Airport", code: "APC" },
  { group: "New York City", city: "New York City", name: "Teterboro Airport", code: "TEB" },
  { group: "Sun Valley", city: "Sun Valley", name: "Friedman Memorial Airport", code: "SUN" },
  { group: "Jackson Hole", city: "Jackson Hole", name: "Jackson Hole Airport", code: "JAC" },
];

export function groupAirports(list: Airport[]) {
  const map = new Map<string, Airport[]>();
  list.forEach(a => {
    const key = a.group ?? a.city;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(a);
  });
  return Array.from(map.entries()).map(([title, items]) => ({ title, items }));
}
