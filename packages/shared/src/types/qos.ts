import type { OperatorSlug, Region } from "./user";

export type NetworkType = "2G" | "3G" | "4G" | "4G+" | "5G" | "wifi";
export type SignalQuality = "excellent" | "good" | "fair" | "poor" | "no_signal";

export interface QosMeasure {
  id: string;
  userId: string;
  operator: OperatorSlug;
  networkType: NetworkType;
  downloadSpeed: number;   // Mbps
  uploadSpeed: number;     // Mbps
  latency: number;         // ms
  jitter: number;          // ms
  packetLoss: number;      // %
  signalStrength: number;  // dBm
  signalQuality: SignalQuality;
  mosScore?: number;       // 1.0 - 4.5 (vocal quality)
  latitude: number;
  longitude: number;
  region: Region;
  address?: string;
  isBlindSpot: boolean;
  deviceModel?: string;
  appVersion: string;
  createdAt: string;
}

export interface QosMeasureCreate {
  operator: OperatorSlug;
  networkType: NetworkType;
  downloadSpeed: number;
  uploadSpeed: number;
  latency: number;
  jitter: number;
  packetLoss: number;
  signalStrength: number;
  mosScore?: number;
  latitude: number;
  longitude: number;
  isBlindSpot?: boolean;
  deviceModel?: string;
  appVersion: string;
}

export interface QosStats {
  operator: OperatorSlug;
  avgDownload: number;
  avgUpload: number;
  avgLatency: number;
  avgMos: number;
  measureCount: number;
  blindSpotCount: number;
  period: string;
}

export interface QosRanking {
  rank: number;
  operator: OperatorSlug;
  score: number;       // 0 - 100
  avgDownload: number;
  avgLatency: number;
  avgMos: number;
  trend: "up" | "down" | "stable";
}

export interface CoveragePoint {
  latitude: number;
  longitude: number;
  operator: OperatorSlug;
  networkType: NetworkType;
  signalQuality: SignalQuality;
  measureCount: number;
}
