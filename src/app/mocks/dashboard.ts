import { DashboardData } from "../types/dashboard";

export const fallbackDashboard: DashboardData = {
  community: {
    id: "mock",
    name: "Torre Vista Hermosa",
    country: "Venezuela",
    baseCurrency: "USD",
    region: "latam",
  },
  metrics: {
    totalUnits: 50,
    activeOwners: 48,
    totalBalances: 1200,
    collectionRate: 94,
  },
  recentPayments: [
    { unit: "A-101", owner: "María González", amount: 125, currency: "USD", status: "completed" },
    { unit: "B-203", owner: "Carlos Rodríguez", amount: 125, currency: "USD", status: "completed" },
    { unit: "C-305", owner: "Ana Martínez", amount: 125, currency: "USD", status: "pending" },
  ],
  agent: {
    status: "mock",
    knowledgeDocuments: 0,
    suggestedQuestions: [
      "Que dice el reglamento sobre mascotas?",
      "Cuales son las normas de ruido?",
    ],
  },
};
