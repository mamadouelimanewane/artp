export const NATIONAL = {
  avgDownload:     7.4,
  avgUpload:       2.1,
  avgLatency:      82,
  availability4G:  94.2,
  coverage4G:      78,
  totalComplaints: 2847,
  resolvedRate:    91,
  avgDelay:        8.3,
  blindSpots:      234,
  lastUpdate:      "Juin 2026",
};

export const OPERATORS = [
  {
    name: "Orange Sénégal", short: "Orange", color: "#f97316", light: "#fff7ed",
    share: 52, qos: 8.2, download: 9.1, latency: 68, availability: 97.1,
    coverage: 89, complaints: 1240, resolved: 1180,
    trend: +0.3,
  },
  {
    name: "Free Sénégal", short: "Free", color: "#6366f1", light: "#eef2ff",
    share: 31, qos: 6.8, download: 6.7, latency: 88, availability: 94.5,
    coverage: 74, complaints: 1020, resolved: 920,
    trend: +0.8,
  },
  {
    name: "Expresso Sénégal", short: "Expresso", color: "#ef4444", light: "#fef2f2",
    share: 17, qos: 5.9, download: 5.4, latency: 102, availability: 91.2,
    coverage: 61, complaints: 587, resolved: 510,
    trend: -0.2,
  },
];

export const REGIONS = [
  { name: "Dakar",       qos: 8.4, download: 10.2, latency: 61, coverage: 95, complaints: 840  },
  { name: "Thiès",       qos: 7.1, download: 7.4,  latency: 79, coverage: 82, complaints: 310  },
  { name: "Saint-Louis", qos: 6.8, download: 6.8,  latency: 84, coverage: 77, complaints: 241  },
  { name: "Kaolack",     qos: 6.5, download: 6.1,  latency: 91, coverage: 72, complaints: 198  },
  { name: "Ziguinchor",  qos: 5.9, download: 5.2,  latency: 104,coverage: 63, complaints: 172  },
  { name: "Tambacounda", qos: 5.1, download: 4.1,  latency: 118,coverage: 54, complaints: 141  },
  { name: "Diourbel",    qos: 6.9, download: 6.5,  latency: 85, coverage: 74, complaints: 187  },
  { name: "Fatick",      qos: 6.2, download: 5.7,  latency: 96, coverage: 68, complaints: 134  },
  { name: "Kolda",       qos: 5.4, download: 4.5,  latency: 112,coverage: 58, complaints: 118  },
  { name: "Matam",       qos: 4.8, download: 3.8,  latency: 125,coverage: 48, complaints: 97   },
  { name: "Sédhiou",     qos: 5.2, download: 4.2,  latency: 115,coverage: 55, complaints: 89   },
  { name: "Kédougou",    qos: 4.3, download: 3.1,  latency: 135,coverage: 41, complaints: 72   },
  { name: "Kaffrine",    qos: 5.8, download: 5.1,  latency: 99, coverage: 64, complaints: 112  },
  { name: "Louga",       qos: 6.4, download: 5.9,  latency: 93, coverage: 70, complaints: 136  },
];

export const MONTHLY = [
  { month: "Jan", download: 6.8, latency: 91, complaints: 310, orange: 8.4, free: 5.9, expresso: 4.8 },
  { month: "Fév", download: 7.0, latency: 89, complaints: 298, orange: 8.6, free: 6.1, expresso: 4.9 },
  { month: "Mar", download: 7.1, latency: 87, complaints: 281, orange: 8.8, free: 6.3, expresso: 5.0 },
  { month: "Avr", download: 7.2, latency: 85, complaints: 265, orange: 8.9, free: 6.5, expresso: 5.1 },
  { month: "Mai", download: 7.3, latency: 84, complaints: 254, orange: 9.0, free: 6.6, expresso: 5.2 },
  { month: "Jun", download: 7.4, latency: 82, complaints: 241, orange: 9.1, free: 6.7, expresso: 5.4 },
];

export const THRESHOLDS = { download: 5, latency: 100, availability: 99 };
