import { apiRequest } from "./apiClient";
import { AgentAskResponse, DashboardData, RecordPaymentInput, RecordPaymentResponse } from "../types/dashboard";

export function getCommunityDashboard(communityId: string) {
  return apiRequest<DashboardData>(`/api/communities/${communityId}/dashboard`);
}

export function askCommunityAgent(communityId: string, question: string) {
  return apiRequest<AgentAskResponse>(`/api/communities/${communityId}/agent/ask`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}

export function recordCommunityPayment(communityId: string, payment: RecordPaymentInput) {
  return apiRequest<RecordPaymentResponse>(`/api/communities/${communityId}/payments`, {
    method: "POST",
    body: JSON.stringify(payment),
  });
}
