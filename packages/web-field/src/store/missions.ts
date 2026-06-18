import { create } from "zustand";
import { persist } from "zustand/middleware";

export type MissionStatus = "assigned" | "in_progress" | "completed" | "synced";
export type MeasureType = "download" | "upload" | "latency" | "coverage" | "blind_spot";

export interface GpsCoord {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

export interface Measurement {
  id: string;
  type: MeasureType;
  value: number;
  unit: string;
  coords: GpsCoord;
  operator: string;
  technology: "2G" | "3G" | "4G" | "5G" | "No signal";
  signalStrength: number;
  note: string;
  photos: string[];
  timestamp: number;
  synced: boolean;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  region: string;
  zone: string;
  priority: "urgent" | "normal" | "low";
  status: MissionStatus;
  assignedAt: number;
  dueDate: number;
  completedAt?: number;
  measurements: Measurement[];
  targetCount: number;
  coords?: GpsCoord;
}

interface MissionsState {
  missions: Mission[];
  activeMissionId: string | null;
  pendingSync: Measurement[];
  setMissions: (m: Mission[]) => void;
  setActive: (id: string | null) => void;
  addMeasurement: (missionId: string, m: Measurement) => void;
  updateStatus: (missionId: string, status: MissionStatus) => void;
  markSynced: (missionId: string) => void;
}

const DEMO_MISSIONS: Mission[] = [
  {
    id: "m1", title: "Mesure QoS Zone Nord Dakar",
    description: "Contrôle de couverture 4G — Secteur Parcelles Assainies et environs",
    region: "Dakar", zone: "Parcelles Assainies",
    priority: "urgent", status: "assigned",
    assignedAt: Date.now() - 86400000, dueDate: Date.now() + 86400000,
    measurements: [], targetCount: 20,
    coords: { lat: 14.78, lng: -17.42, timestamp: Date.now() },
  },
  {
    id: "m2", title: "Inspection Zone Blanche Thiès-Est",
    description: "Signalement zone sans couverture — confirmer coordonnées GPS et opérateurs présents",
    region: "Thiès", zone: "Thiès-Est",
    priority: "normal", status: "in_progress",
    assignedAt: Date.now() - 172800000, dueDate: Date.now() + 172800000,
    measurements: [
      { id: "ms1", type: "blind_spot", value: 0, unit: "signal", coords: { lat: 14.79, lng: -16.93, timestamp: Date.now()-3600000 },
        operator: "Orange", technology: "No signal", signalStrength: 0, note: "Aucun réseau disponible", photos: [], timestamp: Date.now()-3600000, synced: false },
    ],
    targetCount: 10,
  },
  {
    id: "m3", title: "Audit Débit Saint-Louis",
    description: "Mesures de débit descendant/montant — Boulevard du Centenaire",
    region: "Saint-Louis", zone: "Centre-ville",
    priority: "low", status: "completed",
    assignedAt: Date.now() - 604800000, dueDate: Date.now() - 86400000,
    completedAt: Date.now() - 86400000,
    measurements: [], targetCount: 15,
  },
];

export const useMissionsStore = create<MissionsState>()(
  persist(
    (set) => ({
      missions: DEMO_MISSIONS,
      activeMissionId: null,
      pendingSync: [],
      setMissions: (missions) => set({ missions }),
      setActive: (activeMissionId) => set({ activeMissionId }),
      addMeasurement: (missionId, m) =>
        set((s) => ({
          missions: s.missions.map((ms) =>
            ms.id === missionId
              ? { ...ms, measurements: [...ms.measurements, m], status: "in_progress" as MissionStatus }
              : ms
          ),
          pendingSync: [...s.pendingSync, m],
        })),
      updateStatus: (missionId, status) =>
        set((s) => ({
          missions: s.missions.map((ms) =>
            ms.id === missionId
              ? { ...ms, status, completedAt: status === "completed" ? Date.now() : ms.completedAt }
              : ms
          ),
        })),
      markSynced: (missionId) =>
        set((s) => ({
          missions: s.missions.map((ms) =>
            ms.id === missionId ? { ...ms, status: "synced" as MissionStatus, measurements: ms.measurements.map(m => ({ ...m, synced: true })) } : ms
          ),
          pendingSync: [],
        })),
    }),
    { name: "artp-field-missions" }
  )
);
