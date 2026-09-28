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
  recentPayments: Array<{
    unit: string;
    owner: string;
    amount: number;
    currency: string;
    status: string;
  }>;
  units?: DashboardUnit[];
  lastUpdatedAt?: string;
  agent: {
    status: string;
    knowledgeDocuments: number;
    suggestedQuestions: string[];
  };
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
