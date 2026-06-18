// Données de démonstration — 14 régions du Sénégal
export interface RegionData {
  id: string;
  name: string;
  population: number;
  qosScore: number;       // /10
  downloadAvg: number;    // Mbps
  latencyAvg: number;     // ms
  availability: number;   // %
  blindSpots: number;
  complaints: number;
  resolved: number;
  coverage: number;       // % couverture 4G
  // SVG path approximatif pour la carte
  cx: number; cy: number; // centre pour le cercle
}

export const REGIONS: RegionData[] = [
  { id:"dakar",        name:"Dakar",        population:3732284, qosScore:8.2, downloadAvg:18.4, latencyAvg:42,  availability:99.5, blindSpots:2,  complaints:312, resolved:287, coverage:98, cx:88,  cy:310 },
  { id:"thies",        name:"Thiès",        population:2000158, qosScore:7.5, downloadAvg:11.2, latencyAvg:68,  availability:98.9, blindSpots:5,  complaints:147, resolved:129, coverage:91, cx:118, cy:285 },
  { id:"saint_louis",  name:"Saint-Louis",  population:1039845, qosScore:6.8, downloadAvg:7.8,  latencyAvg:89,  availability:97.8, blindSpots:11, complaints:89,  resolved:72,  coverage:78, cx:115, cy:165 },
  { id:"louga",        name:"Louga",        population:996219,  qosScore:6.2, downloadAvg:5.9,  latencyAvg:102, availability:97.1, blindSpots:14, complaints:64,  resolved:51,  coverage:72, cx:148, cy:210 },
  { id:"matam",        name:"Matam",        population:717399,  qosScore:5.4, downloadAvg:3.8,  latencyAvg:142, availability:95.8, blindSpots:22, complaints:41,  resolved:28,  coverage:58, cx:240, cy:175 },
  { id:"tambacounda",  name:"Tambacounda",  population:780975,  qosScore:5.1, downloadAvg:3.2,  latencyAvg:158, availability:94.9, blindSpots:29, complaints:53,  resolved:34,  coverage:52, cx:265, cy:260 },
  { id:"kedougou",     name:"Kédougou",     population:195573,  qosScore:4.3, downloadAvg:2.1,  latencyAvg:198, availability:92.3, blindSpots:38, complaints:18,  resolved:9,   coverage:41, cx:255, cy:320 },
  { id:"fatick",       name:"Fatick",       population:791527,  qosScore:7.1, downloadAvg:9.4,  latencyAvg:79,  availability:98.1, blindSpots:7,  complaints:72,  resolved:60,  coverage:83, cx:145, cy:310 },
  { id:"kaolack",      name:"Kaolack",      population:1063042, qosScore:7.4, downloadAvg:10.8, latencyAvg:74,  availability:98.5, blindSpots:6,  complaints:94,  resolved:80,  coverage:87, cx:168, cy:300 },
  { id:"kaffrine",     name:"Kaffrine",     population:723124,  qosScore:6.5, downloadAvg:6.3,  latencyAvg:96,  availability:97.4, blindSpots:12, complaints:48,  resolved:38,  coverage:74, cx:198, cy:275 },
  { id:"diourbel",     name:"Diourbel",     population:1554063, qosScore:7.8, downloadAvg:13.1, latencyAvg:61,  availability:98.7, blindSpots:4,  complaints:118, resolved:104, coverage:89, cx:148, cy:260 },
  { id:"kolda",        name:"Kolda",        population:754787,  qosScore:5.8, downloadAvg:4.5,  latencyAvg:128, availability:96.4, blindSpots:19, complaints:44,  resolved:31,  coverage:63, cx:178, cy:365 },
  { id:"sedhiou",      name:"Sédhiou",      population:525360,  qosScore:5.5, downloadAvg:3.9,  latencyAvg:135, availability:96.0, blindSpots:21, complaints:31,  resolved:20,  coverage:61, cx:150, cy:370 },
  { id:"ziguinchor",   name:"Ziguinchor",   population:604373,  qosScore:6.3, downloadAvg:6.8,  latencyAvg:94,  availability:97.2, blindSpots:15, complaints:58,  resolved:44,  coverage:76, cx:115, cy:385 },
];

export const MONTHS = ["Jan","Fév","Mar","Avr","Mai","Jun","Jul","Aoû","Sep","Oct","Nov","Déc"];

export function genTimeSeries(months = 6) {
  return MONTHS.slice(0, months).map((m, i) => ({
    month: m,
    orange: +(12 + i * 0.8 + Math.random() * 3).toFixed(1),
    free:   +(7  + i * 0.5 + Math.random() * 2).toFixed(1),
    expresso: +(5 + i * 0.3 + Math.random() * 2).toFixed(1),
    complaints: Math.floor(80 + i * 5 + Math.random() * 20),
    resolved:   Math.floor(65 + i * 4 + Math.random() * 15),
  }));
}

export const OPERATOR_SUMMARY = [
  { name:"Orange",   color:"#f97316", share:55.4, qos:8.1, complaints:498, resolved:441, blindSpots:12, download:14.2 },
  { name:"Free",     color:"#6366f1", share:31.8, qos:7.0, complaints:287, resolved:238, blindSpots:24, download:9.4  },
  { name:"Expresso", color:"#ef4444", share:12.8, qos:6.2, complaints:114, resolved:87,  blindSpots:32, download:6.1  },
];

export const NATIONAL_KPIS = {
  totalComplaints:  899,
  resolved:         766,
  resolutionRate:   85.2,
  avgDelay:         6.4,
  blindSpots:       168,
  qosMeasures:      14820,
  avgDownload:      11.3,
  avgLatency:       82,
  coverage4G:       74.8,
  activeUsers:      6120000,
};
