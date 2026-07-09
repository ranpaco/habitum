export interface OnboardingAccountFormData {
  email: string;
  password: string;
  condoName: string;
  country: string;
  baseCurrency: string;
}

export interface CreateOnboardingSessionInput {
  source: string;
  region: "latam" | "usa";
}

export interface CreateOnboardingSessionResponse {
  sessionId: string;
  status: "created";
}

export interface CompleteOnboardingAccountResponse {
  sessionId: string;
  communityId: string;
  status: "account_completed";
}

export interface OnboardingStatusResponse {
  sessionId: string;
  status: string;
  progress: number;
  stage: string;
  communityId?: string;
  uploadedFileCount?: number;
  processingJobId?: string;
  summary?: ProcessingSummary;
  previewRows?: ProcessingPreviewRow[];
  extractedRows?: ProcessingPreviewRow[];
  issues?: ProcessingIssue[];
}

export interface ProcessingSummary {
  unitsFound: number;
  ownersFound: number;
  totalBalances: number;
  collectionRate: number;
  documentsFound: number;
  rowsProcessed: number;
}

export interface ProcessingPreviewRow {
  unit: string;
  owner: string;
  balance: number;
  status: "paid" | "pending" | "overdue" | string;
}

export interface ProcessingIssue {
  fileId?: string;
  fileName?: string;
  message: string;
}

export interface ProcessOnboardingSessionResponse {
  sessionId: string;
  jobId: string;
  status: "completed" | "processing_running" | "failed";
  progress: number;
  summary: ProcessingSummary;
  previewRows: ProcessingPreviewRow[];
  extractedRows: ProcessingPreviewRow[];
  issues: ProcessingIssue[];
}

export interface ReviewOnboardingDataResponse {
  sessionId: string;
  status: "review_completed";
  progress: number;
  summary: ProcessingSummary;
  previewRows: ProcessingPreviewRow[];
  extractedRows: ProcessingPreviewRow[];
  issues: ProcessingIssue[];
}

export interface UploadFileDescriptor {
  name: string;
  type: string;
  size: number;
}

export interface PresignedUploadFile {
  fileId: string;
  name: string;
  kind: "spreadsheet" | "pdf" | "image" | "unknown";
  objectKey: string;
  uploadUrl: string;
  headers: Record<string, string>;
}

export interface PresignOnboardingFilesResponse {
  sessionId: string;
  status: "upload_urls_created";
  files: PresignedUploadFile[];
}

export interface CompleteOnboardingFilesResponse {
  sessionId: string;
  status: "files_uploaded";
  files: Array<{
    fileId: string;
    status: "stored";
  }>;
}
