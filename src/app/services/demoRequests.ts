import { apiRequest } from "./apiClient";
import {
  CreateDemoRequestInput,
  CreateDemoRequestResponse,
} from "../types/demo";

export function createDemoRequest(input: CreateDemoRequestInput) {
  return apiRequest<CreateDemoRequestResponse>("/api/demo-requests", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

