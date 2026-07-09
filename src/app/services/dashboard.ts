import { apiRequest } from "./apiClient";
import { AgentAskResponse, DashboardData } from "../types/dashboard";

export function getCommunityDashboard(communityId: string) {
  return apiRequest<DashboardData>(`/api/communities/${communityId}/dashboard`);
}

export function askCommunityAgent(communityId: string, question: string) {
  return apiRequest<AgentAskResponse>(`/api/communities/${communityId}/agent/ask`, {
    method: "POST",
    body: JSON.stringify({ question }),
  });
}
