import type { OperatorSlug, Region } from "./user";

export type ComplaintCategory =
  | "network_outage"
  | "poor_quality"
  | "billing_error"
  | "unauthorized_charge"
  | "fraudulent_sva"
  | "contract_issue"
  | "number_portability"
  | "customer_service"
  | "other";

export type ComplaintStatus =
  | "submitted"
  | "under_review"
  | "forwarded_to_operator"
  | "pending_response"
  | "resolved"
  | "closed"
  | "rejected";

export type ComplaintPriority = "low" | "medium" | "high" | "critical";

export interface Complaint {
  id: string;
  reference: string;        // ex: ARTP-2026-00142
  userId: string;
  operator: OperatorSlug;
  category: ComplaintCategory;
  subject: string;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  region: Region;
  attachments: Attachment[];
  timeline: ComplaintEvent[];
  agentId?: string;
  resolution?: string;
  satisfactionScore?: number;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface ComplaintCreate {
  operator: OperatorSlug;
  category: ComplaintCategory;
  subject: string;
  description: string;
  region: Region;
  attachmentIds?: string[];
}

export interface ComplaintEvent {
  id: string;
  complaintId: string;
  status: ComplaintStatus;
  message: string;
  agentId?: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  createdAt: string;
}

export interface ComplaintStats {
  total: number;
  byStatus: Record<ComplaintStatus, number>;
  byOperator: Record<OperatorSlug, number>;
  byCategory: Record<ComplaintCategory, number>;
  avgResolutionDays: number;
  period: string;
}
