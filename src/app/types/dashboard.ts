export type DashboardBalanceStatus = "current" | "pending" | "overdue" | string;

export interface DashboardUnit {
  id: string;
  unit: string;
  owner: string;
  balance: number;
  currency: string;
  status: DashboardBalanceStatus;
  lastActivityAt?: string;
  contact?: string;
  notes?: string;
}

export interface DashboardPayment {
  id?: string;
  unit: string;
  owner: string;
  amount: number;
  currency: string;
  status: string;
  method?: string;
  paidAt?: string;
  reference?: string;
  createdAt?: string;
}

export interface DashboardActivity {
  id: string;
  type: string;
  unit?: string;
  description: string;
  occurredAt: string;
}

export interface RecordPaymentInput {
  unit: string;
  amount: number;
  currency: string;
  method: "cash" | "bank_transfer" | "card" | "check" | "zelle" | "other";
  paidAt: string;
  reference?: string;
}

export interface DashboardData {
  community: {
    id: string;
    name: string;
    country: string;
    baseCurrency: string;
    region: string;
  };
  metrics: {
    totalUnits: number;
    activeOwners: number;
    totalBalances: number;
    collectionRate: number;
  };
  recentPayments: DashboardPayment[];
  payments?: DashboardPayment[];
  activity?: DashboardActivity[];
  units?: DashboardUnit[];
  lastUpdatedAt?: string;
  agent: {
    status: string;
    knowledgeDocuments: number;
    suggestedQuestions: string[];
  };
}

export interface RecordPaymentResponse {
  payment: DashboardPayment;
  dashboard: DashboardData;
}

export interface AgentAskResponse {
  answer: string;
  confidence: "high" | "medium" | "low" | "none" | string;
  needsHumanReview: boolean;
  outOfScope?: boolean;
  citations: Array<{
    documentName: string;
    excerpt: string;
  }>;
}
