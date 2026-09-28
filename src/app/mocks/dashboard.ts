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
  units: [
    { id: "unit-a-101", unit: "A-101", owner: "María González", balance: 0, currency: "USD", status: "current", lastActivityAt: "2026-08-16T14:30:00.000Z", contact: "maria@example.com" },
    { id: "unit-b-203", unit: "B-203", owner: "Carlos Rodríguez", balance: 125, currency: "USD", status: "pending", lastActivityAt: "2026-08-14T10:15:00.000Z" },
    { id: "unit-c-305", unit: "C-305", owner: "Ana Martínez", balance: 450, currency: "USD", status: "overdue", lastActivityAt: "2026-07-28T18:20:00.000Z", notes: "Follow up before the next board meeting." },
    { id: "unit-d-402", unit: "D-402", owner: "Luis Hernández", balance: 0, currency: "USD", status: "current", lastActivityAt: "2026-08-17T09:05:00.000Z" },
    { id: "unit-e-110", unit: "E-110", owner: "Sofía Ramírez", balance: 625, currency: "USD", status: "pending", lastActivityAt: "2026-08-10T16:45:00.000Z" },
  ],
  lastUpdatedAt: "2026-08-18T12:00:00.000Z",
  agent: {
    status: "mock",
    knowledgeDocuments: 0,
    suggestedQuestions: [
      "Que dice el reglamento sobre mascotas?",
      "Cuales son las normas de ruido?",
    ],
  },
};
