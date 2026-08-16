import { apiRequest } from "./apiClient";
import {
  CompleteOnboardingFilesResponse,
  CompleteManualSetupResponse,
  CompleteOnboardingAccountResponse,
  CreateOnboardingSessionInput,
  CreateOnboardingSessionResponse,
  ManualSetupInput,
  OnboardingAccountFormData,
  OnboardingStatusResponse,
  ProcessOnboardingSessionResponse,
  ProcessingPreviewRow,
  ReviewOnboardingDataResponse,
  PresignOnboardingFilesResponse,
} from "../types/onboarding";

export function createOnboardingSession(input: CreateOnboardingSessionInput) {
  return apiRequest<CreateOnboardingSessionResponse>("/api/onboarding/sessions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function completeOnboardingAccount(
  sessionId: string,
  input: OnboardingAccountFormData,
) {
  return apiRequest<CompleteOnboardingAccountResponse>(
    `/api/onboarding/sessions/${sessionId}/account`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export function getOnboardingStatus(sessionId: string) {
  return apiRequest<OnboardingStatusResponse>(
    `/api/onboarding/sessions/${sessionId}/status`,
  );
}

export function processOnboardingSession(sessionId: string) {
  return apiRequest<ProcessOnboardingSessionResponse>(
    `/api/onboarding/sessions/${sessionId}/process`,
    {
      method: "POST",
    },
  );
}

export function reviewOnboardingData(sessionId: string, rows: ProcessingPreviewRow[]) {
  return apiRequest<ReviewOnboardingDataResponse>(
    `/api/onboarding/sessions/${sessionId}/review`,
    {
      method: "PATCH",
      body: JSON.stringify({ rows }),
    },
  );
}

export function completeManualOnboardingSetup(sessionId: string, input: ManualSetupInput) {
  return apiRequest<CompleteManualSetupResponse>(
    `/api/onboarding/sessions/${sessionId}/manual-setup`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}

export async function uploadOnboardingFiles(sessionId: string, files: File[]) {
  const presignResult = await apiRequest<PresignOnboardingFilesResponse>(
    `/api/onboarding/sessions/${sessionId}/files/presign`,
    {
      method: "POST",
      body: JSON.stringify({
        files: files.map((file) => ({
          name: file.name,
          type: file.type || "application/octet-stream",
          size: file.size,
        })),
      }),
    },
  );

  for (const [index, presignedFile] of presignResult.files.entries()) {
    const file = files[index];

    if (!file) {
      throw new Error(`Missing selected file for ${presignedFile.name}`);
    }

    const uploadResponse = await fetch(presignedFile.uploadUrl, {
      method: "PUT",
      headers: presignedFile.headers,
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed for ${presignedFile.name}`);
    }
  }

  return apiRequest<CompleteOnboardingFilesResponse>(
    `/api/onboarding/sessions/${sessionId}/files/complete`,
    {
      method: "POST",
      body: JSON.stringify({
        files: presignResult.files.map((file) => ({ fileId: file.fileId })),
      }),
    },
  );
}
