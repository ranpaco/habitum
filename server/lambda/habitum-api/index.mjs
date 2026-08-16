import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { DetectDocumentTextCommand, TextractClient } from "@aws-sdk/client-textract";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { XMLParser } from "fast-xml-parser";
import JSZip from "jszip";
import crypto from "node:crypto";

const ddb = new DynamoDBClient({});
const s3 = new S3Client({});
const textract = new TextractClient({});
const bedrock = new BedrockRuntimeClient({});

const MAX_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024;
const MAX_SYNC_OCR_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_KNOWLEDGE_DOCUMENTS = 6;
const MAX_KNOWLEDGE_CHUNKS = 24;
const KNOWLEDGE_CHUNK_SIZE = 900;
const ALLOWED_EXTENSIONS = new Set(["xlsx", "xls", "csv", "pdf", "jpg", "jpeg", "png"]);
const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  textNodeName: "text",
});

const env = {
  corsAllowOrigin: process.env.CORS_ALLOW_ORIGIN || "*",
  uploadsBucket: process.env.UPLOADS_BUCKET,
  demoRequestsTable: process.env.DEMO_REQUESTS_TABLE,
  onboardingSessionsTable: process.env.ONBOARDING_SESSIONS_TABLE,
  communitiesTable: process.env.COMMUNITIES_TABLE,
  uploadedFilesTable: process.env.UPLOADED_FILES_TABLE,
  processingJobsTable: process.env.PROCESSING_JOBS_TABLE,
  bedrockModelId: process.env.BEDROCK_MODEL_ID,
};

export async function handler(event) {
  try {
    const method = event.requestContext?.http?.method || "GET";
    const path = event.rawPath || "/";

    if (method === "OPTIONS") {
      return response(204, null);
    }

    if (method === "GET" && path === "/api/health") {
      return response(200, {
        ok: true,
        service: "habitum-api",
        time: new Date().toISOString(),
      });
    }

    if (method === "POST" && path === "/api/demo-requests") {
      return createDemoRequest(parseBody(event));
    }

    if (method === "POST" && path === "/api/onboarding/sessions") {
      return createOnboardingSession(parseBody(event));
    }

    const accountMatch = path.match(/^\/api\/onboarding\/sessions\/([^/]+)\/account$/);
    if (method === "PATCH" && accountMatch) {
      return completeOnboardingAccount(accountMatch[1], parseBody(event));
    }

    const presignFilesMatch = path.match(/^\/api\/onboarding\/sessions\/([^/]+)\/files\/presign$/);
    if (method === "POST" && presignFilesMatch) {
      return presignOnboardingFiles(presignFilesMatch[1], parseBody(event));
    }

    const completeFilesMatch = path.match(/^\/api\/onboarding\/sessions\/([^/]+)\/files\/complete$/);
    if (method === "POST" && completeFilesMatch) {
      return completeOnboardingFiles(completeFilesMatch[1], parseBody(event));
    }

    const processMatch = path.match(/^\/api\/onboarding\/sessions\/([^/]+)\/process$/);
    if (method === "POST" && processMatch) {
      return processOnboardingSession(processMatch[1]);
    }

    const reviewMatch = path.match(/^\/api\/onboarding\/sessions\/([^/]+)\/review$/);
    if (method === "PATCH" && reviewMatch) {
      return reviewOnboardingSession(reviewMatch[1], parseBody(event));
    }

    const manualSetupMatch = path.match(/^\/api\/onboarding\/sessions\/([^/]+)\/manual-setup$/);
    if (method === "PATCH" && manualSetupMatch) {
      return completeManualOnboardingSetup(manualSetupMatch[1], parseBody(event));
    }

    const statusMatch = path.match(/^\/api\/onboarding\/sessions\/([^/]+)\/status$/);
    if (method === "GET" && statusMatch) {
      return getOnboardingStatus(statusMatch[1]);
    }

    const dashboardMatch = path.match(/^\/api\/communities\/([^/]+)\/dashboard$/);
    if (method === "GET" && dashboardMatch) {
      return getDashboard(dashboardMatch[1]);
    }

    const agentAskMatch = path.match(/^\/api\/communities\/([^/]+)\/agent\/ask$/);
    if (method === "POST" && agentAskMatch) {
      return askCommunityAgent(agentAskMatch[1], parseBody(event));
    }

    return response(404, { error: "not_found" });
  } catch (error) {
    console.error(error);
    return response(500, { error: "internal_error" });
  }
}

async function createDemoRequest(body) {
  const required = ["name", "email", "phone", "condoName"];
  const missing = required.filter((field) => !body[field]);

  if (missing.length > 0) {
    return response(400, { error: "missing_required_fields", fields: missing });
  }

  const id = `dr_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  await ddb.send(new PutItemCommand({
    TableName: env.demoRequestsTable,
    Item: {
      id: { S: id },
      createdAt: { S: now },
      status: { S: "received" },
      name: { S: String(body.name) },
      email: { S: String(body.email) },
      countryCode: { S: String(body.countryCode || "") },
      phone: { S: String(body.phone) },
      condoName: { S: String(body.condoName) },
      condoSize: { S: String(body.condoSize || "") },
      role: { S: String(body.role || "") },
      region: { S: String(body.region || "latam") },
    },
  }));

  return response(201, { demoRequestId: id, status: "received" });
}

async function createOnboardingSession(body) {
  const id = `obs_${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  await ddb.send(new PutItemCommand({
    TableName: env.onboardingSessionsTable,
    Item: {
      id: { S: id },
      createdAt: { S: now },
      updatedAt: { S: now },
      source: { S: String(body.source || "landing_cta") },
      region: { S: String(body.region || "latam") },
      status: { S: "created" },
    },
  }));

  return response(201, { sessionId: id, status: "created" });
}

async function completeOnboardingAccount(sessionId, body) {
  const communityId = `com_${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  const country = String(body.country || "");
  const region = country.toLowerCase().includes("united states") || country.toLowerCase() === "us" ? "usa" : "latam";

  await ddb.send(new PutItemCommand({
    TableName: env.communitiesTable,
    Item: {
      id: { S: communityId },
      createdAt: { S: now },
      name: { S: String(body.condoName || "Demo Community") },
      country: { S: country },
      baseCurrency: { S: String(body.baseCurrency || "USD") },
      region: { S: region },
      status: { S: "demo" },
    },
  }));

  await ddb.send(new UpdateItemCommand({
    TableName: env.onboardingSessionsTable,
    Key: { id: { S: sessionId } },
    UpdateExpression: "SET updatedAt = :updatedAt, #status = :status, communityId = :communityId, email = :email",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":updatedAt": { S: now },
      ":status": { S: "account_completed" },
      ":communityId": { S: communityId },
      ":email": { S: String(body.email || "") },
    },
  }));

  return response(200, { sessionId, communityId, status: "account_completed" });
}

async function presignOnboardingFiles(sessionId, body) {
  const files = Array.isArray(body.files) ? body.files : [];

  if (files.length === 0) {
    return response(400, { error: "files_required" });
  }

  if (files.length > 10) {
    return response(400, { error: "too_many_files", maxFiles: 10 });
  }

  const session = await ddb.send(new GetItemCommand({
    TableName: env.onboardingSessionsTable,
    Key: { id: { S: sessionId } },
  }));

  if (!session.Item) {
    return response(404, { error: "session_not_found" });
  }

  const now = new Date().toISOString();
  const presignedFiles = [];

  for (const file of files) {
    const validationError = validateUploadFile(file);
    if (validationError) {
      return response(400, validationError);
    }

    const fileId = `file_${crypto.randomUUID()}`;
    const safeName = sanitizeFileName(file.name);
    const objectKey = `onboarding/${sessionId}/${fileId}/${safeName}`;
    const contentType = String(file.type || "application/octet-stream");
    const size = Number(file.size || 0);
    const kind = getFileKind(file.name, contentType);

    await ddb.send(new PutItemCommand({
      TableName: env.uploadedFilesTable,
      Item: {
        id: { S: fileId },
        sessionId: { S: sessionId },
        communityId: { S: session.Item.communityId?.S || "" },
        createdAt: { S: now },
        updatedAt: { S: now },
        name: { S: String(file.name) },
        contentType: { S: contentType },
        size: { N: String(size) },
        kind: { S: kind },
        bucket: { S: env.uploadsBucket },
        objectKey: { S: objectKey },
        status: { S: "upload_requested" },
      },
    }));

    const command = new PutObjectCommand({
      Bucket: env.uploadsBucket,
      Key: objectKey,
      ContentType: contentType,
    });

    presignedFiles.push({
      fileId,
      name: file.name,
      kind,
      objectKey,
      uploadUrl: await getSignedUrl(s3, command, { expiresIn: 900 }),
      headers: {
        "content-type": contentType,
      },
    });
  }

  return response(200, {
    sessionId,
    status: "upload_urls_created",
    files: presignedFiles,
  });
}

async function completeOnboardingFiles(sessionId, body) {
  const files = Array.isArray(body.files) ? body.files : [];

  if (files.length === 0) {
    return response(400, { error: "files_required" });
  }

  const now = new Date().toISOString();
  const completedFiles = [];

  for (const file of files) {
    const fileId = String(file.fileId || "");

    if (!fileId.startsWith("file_")) {
      return response(400, { error: "invalid_file_id" });
    }

    await ddb.send(new UpdateItemCommand({
      TableName: env.uploadedFilesTable,
      Key: { id: { S: fileId } },
      UpdateExpression: "SET updatedAt = :updatedAt, #status = :status",
      ExpressionAttributeNames: { "#status": "status" },
      ExpressionAttributeValues: {
        ":updatedAt": { S: now },
        ":status": { S: "stored" },
      },
    }));

    completedFiles.push({
      fileId,
      status: "stored",
    });
  }

  await ddb.send(new UpdateItemCommand({
    TableName: env.onboardingSessionsTable,
    Key: { id: { S: sessionId } },
    UpdateExpression: "SET updatedAt = :updatedAt, #status = :status, uploadedFileCount = :uploadedFileCount",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":updatedAt": { S: now },
      ":status": { S: "files_uploaded" },
      ":uploadedFileCount": { N: String(files.length) },
    },
  }));

  return response(200, {
    sessionId,
    status: "files_uploaded",
    files: completedFiles,
  });
}

async function processOnboardingSession(sessionId) {
  const sessionResult = await ddb.send(new GetItemCommand({
    TableName: env.onboardingSessionsTable,
    Key: { id: { S: sessionId } },
  }));

  if (!sessionResult.Item) {
    return response(404, { error: "session_not_found" });
  }

  const communityId = sessionResult.Item.communityId?.S;
  if (!communityId) {
    return response(400, { error: "community_not_ready" });
  }

  const uploadedFiles = await getStoredFilesForSession(sessionId);
  if (uploadedFiles.length === 0) {
    return response(400, { error: "no_uploaded_files" });
  }

  const now = new Date().toISOString();
  const jobId = `job_${crypto.randomUUID()}`;

  await ddb.send(new PutItemCommand({
    TableName: env.processingJobsTable,
    Item: {
      id: { S: jobId },
      sessionId: { S: sessionId },
      communityId: { S: communityId },
      createdAt: { S: now },
      updatedAt: { S: now },
      status: { S: "processing_running" },
      progress: { N: "60" },
    },
  }));

  await ddb.send(new UpdateItemCommand({
    TableName: env.onboardingSessionsTable,
    Key: { id: { S: sessionId } },
    UpdateExpression: "SET updatedAt = :updatedAt, #status = :status, processingJobId = :processingJobId",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":updatedAt": { S: now },
      ":status": { S: "processing_running" },
      ":processingJobId": { S: jobId },
    },
  }));

  const result = await extractCommunityData(uploadedFiles);
  const completedAt = new Date().toISOString();

  await ddb.send(new UpdateItemCommand({
    TableName: env.communitiesTable,
    Key: { id: { S: communityId } },
    UpdateExpression: [
      "SET totalUnits = :totalUnits",
      "activeOwners = :activeOwners",
      "totalBalances = :totalBalances",
      "collectionRate = :collectionRate",
      "recentPaymentsJson = :recentPaymentsJson",
      "processingSummaryJson = :processingSummaryJson",
      "previewRowsJson = :previewRowsJson",
      "extractedRowsJson = :extractedRowsJson",
      "knowledgeDocumentsJson = :knowledgeDocumentsJson",
      "knowledgeChunksJson = :knowledgeChunksJson",
      "updatedAt = :updatedAt",
    ].join(", "),
    ExpressionAttributeValues: {
      ":totalUnits": { N: String(result.summary.unitsFound) },
      ":activeOwners": { N: String(result.summary.ownersFound) },
      ":totalBalances": { N: String(result.summary.totalBalances) },
      ":collectionRate": { N: String(result.summary.collectionRate) },
      ":recentPaymentsJson": { S: JSON.stringify(result.recentPayments) },
      ":processingSummaryJson": { S: JSON.stringify(result.summary) },
      ":previewRowsJson": { S: JSON.stringify(result.previewRows) },
      ":extractedRowsJson": { S: JSON.stringify(result.extractedRows) },
      ":knowledgeDocumentsJson": { S: JSON.stringify(result.knowledgeDocuments) },
      ":knowledgeChunksJson": { S: JSON.stringify(result.knowledgeChunks) },
      ":updatedAt": { S: completedAt },
    },
  }));

  await ddb.send(new UpdateItemCommand({
    TableName: env.processingJobsTable,
    Key: { id: { S: jobId } },
    UpdateExpression: "SET updatedAt = :updatedAt, #status = :status, progress = :progress, summaryJson = :summaryJson, issuesJson = :issuesJson",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":updatedAt": { S: completedAt },
      ":status": { S: "completed" },
      ":progress": { N: "100" },
      ":summaryJson": { S: JSON.stringify(result.summary) },
      ":issuesJson": { S: JSON.stringify(result.issues) },
    },
  }));

  await ddb.send(new UpdateItemCommand({
    TableName: env.onboardingSessionsTable,
    Key: { id: { S: sessionId } },
    UpdateExpression: [
      "SET updatedAt = :updatedAt",
      "#status = :status",
      "progress = :progress",
      "processingSummaryJson = :processingSummaryJson",
      "previewRowsJson = :previewRowsJson",
      "extractedRowsJson = :extractedRowsJson",
      "issuesJson = :issuesJson",
    ].join(", "),
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":updatedAt": { S: completedAt },
      ":status": { S: "completed" },
      ":progress": { N: "100" },
      ":processingSummaryJson": { S: JSON.stringify(result.summary) },
      ":previewRowsJson": { S: JSON.stringify(result.previewRows) },
      ":extractedRowsJson": { S: JSON.stringify(result.extractedRows) },
      ":issuesJson": { S: JSON.stringify(result.issues) },
    },
  }));

  return response(200, {
    sessionId,
    jobId,
    status: "completed",
    progress: 100,
    summary: result.summary,
    previewRows: result.previewRows,
    extractedRows: result.extractedRows,
    issues: result.issues,
  });
}

async function reviewOnboardingSession(sessionId, body) {
  const sessionResult = await ddb.send(new GetItemCommand({
    TableName: env.onboardingSessionsTable,
    Key: { id: { S: sessionId } },
  }));

  if (!sessionResult.Item) {
    return response(404, { error: "session_not_found" });
  }

  const communityId = sessionResult.Item.communityId?.S;
  if (!communityId) {
    return response(400, { error: "community_not_ready" });
  }

  const rows = Array.isArray(body.rows) ? body.rows : [];
  const normalizedRows = rows
    .map((row) => ({
      unit: String(row.unit || "").trim(),
      owner: String(row.owner || "").trim(),
      balance: parseMoney(row.balance),
    }))
    .filter((row) => row.unit || row.owner);

  if (normalizedRows.length === 0) {
    return response(400, { error: "review_rows_required" });
  }

  const currentIssues = parseJsonAttribute(sessionResult.Item.issuesJson?.S, []);
  const currentSummary = parseJsonAttribute(sessionResult.Item.processingSummaryJson?.S, {});
  const reviewed = buildExtractionResult(
    normalizedRows,
    Number(currentSummary?.documentsFound || 0),
    currentIssues,
  );
  const reviewedAt = new Date().toISOString();

  await ddb.send(new UpdateItemCommand({
    TableName: env.communitiesTable,
    Key: { id: { S: communityId } },
    UpdateExpression: [
      "SET totalUnits = :totalUnits",
      "activeOwners = :activeOwners",
      "totalBalances = :totalBalances",
      "collectionRate = :collectionRate",
      "recentPaymentsJson = :recentPaymentsJson",
      "processingSummaryJson = :processingSummaryJson",
      "previewRowsJson = :previewRowsJson",
      "extractedRowsJson = :extractedRowsJson",
      "updatedAt = :updatedAt",
    ].join(", "),
    ExpressionAttributeValues: {
      ":totalUnits": { N: String(reviewed.summary.unitsFound) },
      ":activeOwners": { N: String(reviewed.summary.ownersFound) },
      ":totalBalances": { N: String(reviewed.summary.totalBalances) },
      ":collectionRate": { N: String(reviewed.summary.collectionRate) },
      ":recentPaymentsJson": { S: JSON.stringify(reviewed.recentPayments) },
      ":processingSummaryJson": { S: JSON.stringify(reviewed.summary) },
      ":previewRowsJson": { S: JSON.stringify(reviewed.previewRows) },
      ":extractedRowsJson": { S: JSON.stringify(reviewed.extractedRows) },
      ":updatedAt": { S: reviewedAt },
    },
  }));

  await ddb.send(new UpdateItemCommand({
    TableName: env.onboardingSessionsTable,
    Key: { id: { S: sessionId } },
    UpdateExpression: [
      "SET updatedAt = :updatedAt",
      "#status = :status",
      "progress = :progress",
      "processingSummaryJson = :processingSummaryJson",
      "previewRowsJson = :previewRowsJson",
      "extractedRowsJson = :extractedRowsJson",
      "reviewedAt = :reviewedAt",
    ].join(", "),
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":updatedAt": { S: reviewedAt },
      ":status": { S: "review_completed" },
      ":progress": { N: "100" },
      ":processingSummaryJson": { S: JSON.stringify(reviewed.summary) },
      ":previewRowsJson": { S: JSON.stringify(reviewed.previewRows) },
      ":extractedRowsJson": { S: JSON.stringify(reviewed.extractedRows) },
      ":reviewedAt": { S: reviewedAt },
    },
  }));

  return response(200, {
    sessionId,
    status: "review_completed",
    progress: 100,
    summary: reviewed.summary,
    previewRows: reviewed.previewRows,
    extractedRows: reviewed.extractedRows,
    issues: reviewed.issues,
  });
}

async function completeManualOnboardingSetup(sessionId, body) {
  const sessionResult = await ddb.send(new GetItemCommand({
    TableName: env.onboardingSessionsTable,
    Key: { id: { S: sessionId } },
  }));

  if (!sessionResult.Item) {
    return response(404, { error: "session_not_found" });
  }

  const communityId = sessionResult.Item.communityId?.S;
  if (!communityId) {
    return response(400, { error: "community_not_ready" });
  }

  const rows = Array.isArray(body.rows) ? body.rows : [];
  const normalizedRows = rows
    .map((row) => ({
      unit: String(row.unit || "").trim(),
      owner: String(row.owner || "").trim(),
      balance: parseMoney(row.balance),
    }))
    .filter((row) => row.unit || row.owner);

  if (normalizedRows.length === 0) {
    return response(400, { error: "manual_rows_required" });
  }

  const rulesText = buildManualRulesText(body.rules);
  const knowledgeDocuments = rulesText
    ? [buildManualKnowledgeDocument(communityId, rulesText)]
    : [];
  const result = buildExtractionResult(normalizedRows, knowledgeDocuments.length, [], knowledgeDocuments);
  const completedAt = new Date().toISOString();

  await ddb.send(new UpdateItemCommand({
    TableName: env.communitiesTable,
    Key: { id: { S: communityId } },
    UpdateExpression: [
      "SET totalUnits = :totalUnits",
      "activeOwners = :activeOwners",
      "totalBalances = :totalBalances",
      "collectionRate = :collectionRate",
      "recentPaymentsJson = :recentPaymentsJson",
      "processingSummaryJson = :processingSummaryJson",
      "previewRowsJson = :previewRowsJson",
      "extractedRowsJson = :extractedRowsJson",
      "knowledgeDocumentsJson = :knowledgeDocumentsJson",
      "knowledgeChunksJson = :knowledgeChunksJson",
      "updatedAt = :updatedAt",
    ].join(", "),
    ExpressionAttributeValues: {
      ":totalUnits": { N: String(result.summary.unitsFound) },
      ":activeOwners": { N: String(result.summary.ownersFound) },
      ":totalBalances": { N: String(result.summary.totalBalances) },
      ":collectionRate": { N: String(result.summary.collectionRate) },
      ":recentPaymentsJson": { S: JSON.stringify(result.recentPayments) },
      ":processingSummaryJson": { S: JSON.stringify(result.summary) },
      ":previewRowsJson": { S: JSON.stringify(result.previewRows) },
      ":extractedRowsJson": { S: JSON.stringify(result.extractedRows) },
      ":knowledgeDocumentsJson": { S: JSON.stringify(result.knowledgeDocuments) },
      ":knowledgeChunksJson": { S: JSON.stringify(result.knowledgeChunks) },
      ":updatedAt": { S: completedAt },
    },
  }));

  await ddb.send(new UpdateItemCommand({
    TableName: env.onboardingSessionsTable,
    Key: { id: { S: sessionId } },
    UpdateExpression: [
      "SET updatedAt = :updatedAt",
      "#status = :status",
      "progress = :progress",
      "processingSummaryJson = :processingSummaryJson",
      "previewRowsJson = :previewRowsJson",
      "extractedRowsJson = :extractedRowsJson",
      "issuesJson = :issuesJson",
      "manualSetupCompletedAt = :manualSetupCompletedAt",
    ].join(", "),
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":updatedAt": { S: completedAt },
      ":status": { S: "manual_setup_completed" },
      ":progress": { N: "100" },
      ":processingSummaryJson": { S: JSON.stringify(result.summary) },
      ":previewRowsJson": { S: JSON.stringify(result.previewRows) },
      ":extractedRowsJson": { S: JSON.stringify(result.extractedRows) },
      ":issuesJson": { S: JSON.stringify(result.issues) },
      ":manualSetupCompletedAt": { S: completedAt },
    },
  }));

  return response(200, {
    sessionId,
    communityId,
    status: "manual_setup_completed",
    progress: 100,
    summary: result.summary,
    previewRows: result.previewRows,
    extractedRows: result.extractedRows,
    issues: result.issues,
  });
}

async function getOnboardingStatus(sessionId) {
  const result = await ddb.send(new GetItemCommand({
    TableName: env.onboardingSessionsTable,
    Key: { id: { S: sessionId } },
  }));

  if (!result.Item) {
    return response(404, { error: "session_not_found" });
  }

  return response(200, {
    sessionId,
    status: result.Item.status?.S || "created",
    progress: Number(result.Item.progress?.N || getProgressForStatus(result.Item.status?.S)),
    stage: result.Item.status?.S || "created",
    communityId: result.Item.communityId?.S,
    uploadedFileCount: Number(result.Item.uploadedFileCount?.N || 0),
    processingJobId: result.Item.processingJobId?.S,
    summary: parseJsonAttribute(result.Item.processingSummaryJson?.S),
    previewRows: parseJsonAttribute(result.Item.previewRowsJson?.S, []),
    extractedRows: parseJsonAttribute(result.Item.extractedRowsJson?.S, []),
    issues: parseJsonAttribute(result.Item.issuesJson?.S, []),
  });
}

async function getDashboard(communityId) {
  const result = await ddb.send(new GetItemCommand({
    TableName: env.communitiesTable,
    Key: { id: { S: communityId } },
  }));

  if (!result.Item) {
    return response(404, { error: "community_not_found" });
  }

  return response(200, {
    community: {
      id: communityId,
      name: result.Item.name?.S,
      country: result.Item.country?.S,
      baseCurrency: result.Item.baseCurrency?.S,
      region: result.Item.region?.S,
    },
    metrics: {
      totalUnits: Number(result.Item.totalUnits?.N || 0),
      activeOwners: Number(result.Item.activeOwners?.N || 0),
      totalBalances: Number(result.Item.totalBalances?.N || 0),
      collectionRate: Number(result.Item.collectionRate?.N || 0),
    },
    recentPayments: parseJsonAttribute(result.Item.recentPaymentsJson?.S, []),
    agent: {
      status: parseJsonAttribute(result.Item.knowledgeChunksJson?.S, []).length > 0 ? "ready" : "not_configured",
      knowledgeDocuments: parseJsonAttribute(result.Item.knowledgeDocumentsJson?.S, []).length,
      suggestedQuestions: [
        "Puedo tener mascotas?",
        "Como puedo reservar el salon?",
        "Que dice el reglamento sobre mascotas?",
        "Cuales son las normas de ruido?",
      ],
    },
  });
}

async function askCommunityAgent(communityId, body) {
  const question = String(body.question || "").trim();

  if (!question) {
    return response(400, { error: "question_required" });
  }

  if (question.length > 500) {
    return response(400, { error: "question_too_long", maxLength: 500 });
  }

  const result = await ddb.send(new GetItemCommand({
    TableName: env.communitiesTable,
    Key: { id: { S: communityId } },
  }));

  if (!result.Item) {
    return response(404, { error: "community_not_found" });
  }

  const community = {
    id: communityId,
    name: result.Item.name?.S || "Demo Community",
    country: result.Item.country?.S || "",
    baseCurrency: result.Item.baseCurrency?.S || "USD",
    region: result.Item.region?.S || "latam",
  };

  if (!isCommunityScopedQuestion(question, community)) {
    return response(200, buildOutOfScopeAgentAnswer(question, community));
  }

  const knowledgeChunks = parseJsonAttribute(result.Item.knowledgeChunksJson?.S, []);

  if (knowledgeChunks.length === 0) {
    return response(200, {
      answer: "Todavia no hay reglamentos, documentos o reglas manuales con texto suficiente en esta comunidad. Sube un PDF, una imagen clara del reglamento o completa el setup manual para activar respuestas basadas en conocimiento.",
      confidence: "none",
      needsHumanReview: true,
      citations: [],
    });
  }

  const relevantChunks = selectRelevantKnowledgeChunks(knowledgeChunks, question, 4);

  if (relevantChunks.length === 0) {
    return response(200, {
      answer: "No encontre una referencia suficientemente clara en los documentos cargados. Esta pregunta deberia escalarse al administrador o a la junta antes de responder al residente.",
      confidence: "low",
      needsHumanReview: true,
      citations: [],
    });
  }

  const answer = await answerQuestionWithKnowledge(question, community, relevantChunks);
  return response(200, answer);
}

async function getStoredFilesForSession(sessionId) {
  const result = await ddb.send(new ScanCommand({
    TableName: env.uploadedFilesTable,
    FilterExpression: "sessionId = :sessionId AND #status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: {
      ":sessionId": { S: sessionId },
      ":status": { S: "stored" },
    },
  }));

  return (result.Items || []).map((item) => ({
    fileId: item.id?.S,
    name: item.name?.S || "",
    kind: item.kind?.S || "unknown",
    contentType: item.contentType?.S || "",
    bucket: item.bucket?.S || env.uploadsBucket,
    objectKey: item.objectKey?.S || "",
  }));
}

async function extractCommunityData(files) {
  const rows = [];
  const issues = [];
  const knowledgeDocuments = [];
  let documentsFound = 0;

  for (const file of files) {
    const extension = getExtension(file.name);

    if (extension === "csv") {
      const text = await getObjectText(file.bucket, file.objectKey);
      rows.push(...parseCsvRows(text));
      continue;
    }

    if (extension === "xlsx") {
      const buffer = await getObjectBuffer(file.bucket, file.objectKey);
      rows.push(...await parseXlsxRows(buffer));
      continue;
    }

    if (extension === "xls") {
      issues.push({
        fileId: file.fileId,
        fileName: file.name,
        message: "Legacy .xls files are stored, but the MVP parser currently supports .xlsx and .csv.",
      });
      continue;
    }

    if (file.kind === "pdf" || file.kind === "image") {
      documentsFound += 1;
      const ocrResult = await extractTextWithTextract(file);
      const documentText = ocrResult.lines.map((line) => line.text).join("\n").trim();
      if (documentText) {
        knowledgeDocuments.push(buildKnowledgeDocument(file, documentText, ocrResult.lines));
      }
      const ocrRows = parseOcrRows(ocrResult.lines);
      rows.push(...ocrRows);

      if (ocrResult.lines.length === 0) {
        issues.push({
          fileId: file.fileId,
          fileName: file.name,
          message: "OCR completed, but no text was detected.",
        });
      } else if (ocrRows.length === 0) {
        const llmResult = await extractRowsWithLlm(ocrResult.lines, file);
        rows.push(...llmResult.rows);

        if (llmResult.rows.length === 0) {
          issues.push({
            fileId: file.fileId,
            fileName: file.name,
            message: llmResult.enabled
              ? "OCR text was extracted, but LLM extraction did not find unit/owner/balance rows."
              : "OCR text was extracted, but no unit/owner/balance rows were detected. Configure BEDROCK_MODEL_ID to enable LLM extraction.",
          });
        }
      }
      continue;
    }

    issues.push({
      fileId: file.fileId,
      fileName: file.name,
      message: "File stored, but this parser currently supports CSV structured data only.",
    });
  }

  const normalizedRows = rows.map(normalizeCommunityRow).filter((row) => row.unit || row.owner);

  return buildExtractionResult(normalizedRows, documentsFound, issues, knowledgeDocuments);
}

function buildExtractionResult(normalizedRows, documentsFound, issues, knowledgeDocuments = []) {
  const units = new Set(normalizedRows.map((row) => row.unit).filter(Boolean));
  const owners = new Set(normalizedRows.map((row) => row.owner).filter(Boolean));
  const totalBalances = normalizedRows.reduce((sum, row) => sum + row.balance, 0);
  const paidUnits = normalizedRows.filter((row) => row.balance <= 0).length;
  const collectionRate = normalizedRows.length > 0 ? Math.round((paidUnits / normalizedRows.length) * 100) : 0;
  const previewRows = normalizedRows.slice(0, 5).map((row) => ({
    unit: row.unit || "Unassigned",
    owner: row.owner || "Unknown owner",
    balance: row.balance,
    status: row.balance <= 0 ? "paid" : "pending",
  }));
  const extractedRows = normalizedRows.map((row) => ({
    unit: row.unit || "Unassigned",
    owner: row.owner || "Unknown owner",
    balance: row.balance,
    status: row.balance <= 0 ? "paid" : "pending",
  }));

  return {
    summary: {
      unitsFound: units.size,
      ownersFound: owners.size,
      totalBalances,
      collectionRate,
      documentsFound,
      rowsProcessed: normalizedRows.length,
    },
    previewRows,
    extractedRows,
    knowledgeDocuments,
    knowledgeChunks: buildKnowledgeChunks(knowledgeDocuments),
    recentPayments: extractedRows.map((row) => ({
      unit: row.unit,
      owner: row.owner,
      amount: row.balance,
      currency: "USD",
      status: row.status,
    })),
    issues,
  };
}

function buildKnowledgeDocument(file, text, lines) {
  const averageConfidence = lines.length > 0
    ? Math.round(lines.reduce((sum, line) => sum + Number(line.confidence || 0), 0) / lines.length)
    : 0;

  return {
    fileId: file.fileId,
    name: file.name,
    kind: file.kind,
    text: text.slice(0, 12000),
    lineCount: lines.length,
    averageConfidence,
  };
}

function buildKnowledgeChunks(documents) {
  const chunks = [];

  for (const document of documents.slice(0, MAX_KNOWLEDGE_DOCUMENTS)) {
    const paragraphs = splitKnowledgeText(document.text);
    let current = "";
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
      const next = current ? `${current}\n${paragraph}` : paragraph;

      if (next.length > KNOWLEDGE_CHUNK_SIZE && current) {
        chunks.push(makeKnowledgeChunk(document, current, chunkIndex));
        chunkIndex += 1;
        current = paragraph;
      } else {
        current = next;
      }

      if (chunks.length >= MAX_KNOWLEDGE_CHUNKS) break;
    }

    if (current && chunks.length < MAX_KNOWLEDGE_CHUNKS) {
      chunks.push(makeKnowledgeChunk(document, current, chunkIndex));
    }

    if (chunks.length >= MAX_KNOWLEDGE_CHUNKS) break;
  }

  return chunks;
}

function splitKnowledgeText(text) {
  return String(text || "")
    .split(/\n{1,}|\.\s+/)
    .map((part) => part.trim())
    .filter((part) => part.length > 20);
}

function makeKnowledgeChunk(document, text, chunkIndex) {
  return {
    id: `${document.fileId || "doc"}_${chunkIndex}`,
    fileId: document.fileId,
    documentName: document.name,
    chunkIndex,
    text: text.slice(0, KNOWLEDGE_CHUNK_SIZE),
  };
}

function buildManualRulesText(rules) {
  if (!rules || typeof rules !== "object") return "";

  const sections = [
    ["Pet Rules", rules.pets],
    ["Quiet Hours and Noise", rules.quietHours],
    ["Parking", rules.parking],
    ["Reservations and Amenities", rules.reservations],
    ["Maintenance Requests", rules.maintenance],
    ["Payments and Assessments", rules.payments],
    ["Additional Community Notes", rules.additional],
  ];

  return sections
    .map(([title, value]) => {
      const text = String(value || "").trim();
      return text ? `${title}: ${text}` : "";
    })
    .filter(Boolean)
    .join("\n\n")
    .slice(0, 12000);
}

function buildManualKnowledgeDocument(communityId, text) {
  return {
    fileId: `manual_${communityId}`,
    name: "Manual onboarding rules",
    kind: "manual",
    text,
    lineCount: text.split(/\n+/).filter(Boolean).length,
    averageConfidence: 100,
  };
}

function selectRelevantKnowledgeChunks(chunks, question, limit) {
  const questionTokens = tokenizeForSearch(question);
  if (questionTokens.length === 0) return [];

  return chunks
    .map((chunk) => {
      const chunkTokens = tokenizeForSearch(`${chunk.documentName} ${chunk.text}`);
      const uniqueChunkTokens = new Set(chunkTokens);
      const score = questionTokens.reduce((sum, token) => sum + (uniqueChunkTokens.has(token) ? 1 : 0), 0);
      return { chunk, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.chunk);
}

async function answerQuestionWithKnowledge(question, community, chunks) {
  const fallback = buildFallbackKnowledgeAnswer(chunks);
  const modelId = String(env.bedrockModelId || "");

  if (!modelId || modelId === "disabled") {
    return fallback;
  }

  const context = chunks.map((chunk, index) => [
    `[${index + 1}] ${chunk.documentName}`,
    chunk.text,
  ].join("\n")).join("\n\n");

  const prompt = [
    `Community: ${community.name}`,
    `Country: ${community.country}`,
    "",
    "Answer the resident question using only the provided community document excerpts.",
    "If the excerpts do not contain the answer, say that the administrator should review it.",
    "Return only valid JSON with this exact shape:",
    "{\"answer\":\"short answer\",\"confidence\":\"high|medium|low\",\"needsHumanReview\":false}",
    "Use the same language as the user's question.",
    "",
    "Resident question:",
    question,
    "",
    "Community document excerpts:",
    context,
  ].join("\n");

  try {
    const result = await bedrock.send(new ConverseCommand({
      modelId,
      system: [
        {
          text: "You are Habitum's resident support agent. You answer only from the community documents provided and avoid legal certainty when documents are incomplete.",
        },
      ],
      messages: [
        {
          role: "user",
          content: [{ text: prompt }],
        },
      ],
      inferenceConfig: {
        maxTokens: 700,
        temperature: 0,
      },
    }));

    const text = (result.output?.message?.content || [])
      .map((content) => content.text || "")
      .join("")
      .trim();
    const parsed = parseJsonFromModelText(text);

    if (!parsed?.answer) return fallback;

    return {
      answer: String(parsed.answer),
      confidence: ["high", "medium", "low"].includes(parsed.confidence) ? parsed.confidence : "medium",
      needsHumanReview: Boolean(parsed.needsHumanReview),
      citations: chunks.map(formatCitation),
    };
  } catch (error) {
    console.error("Bedrock agent answer failed", error);
    return fallback;
  }
}

function buildFallbackKnowledgeAnswer(chunks) {
  return {
    answer: "Encontre referencias relacionadas en los documentos cargados, pero el modelo de respuesta no esta disponible. Revisa los extractos citados antes de responder al residente.",
    confidence: "low",
    needsHumanReview: true,
    citations: chunks.map(formatCitation),
  };
}

function formatCitation(chunk) {
  return {
    documentName: chunk.documentName,
    excerpt: String(chunk.text || "").slice(0, 320),
  };
}

function isCommunityScopedQuestion(question, community) {
  const normalizedQuestion = normalizeSearchText(question);
  const communityTokens = tokenizeForSearch(`${community.name} ${community.country}`);
  const scopeTerms = [
    "condominio", "condo", "comunidad", "edificio", "torre", "residencia", "urbanizacion", "inmueble",
    "administracion", "administrador", "junta", "board", "association", "hoa", "coa", "community",
    "vecino", "vecinos", "residente", "residentes", "propietario", "propietarios", "owner", "homeowner", "tenant",
    "unidad", "apartamento", "apto", "casa", "home", "door", "unit",
    "reglamento", "regla", "reglas", "norma", "normas", "bylaws", "ccrs", "covenants", "policy", "policies",
    "mascota", "mascotas", "animal", "animales", "perro", "gato", "pet", "pets",
    "estacionamiento", "parking", "puesto", "vehiculo", "vehicle",
    "salon", "reserva", "reservar", "fiesta", "piscina", "gym", "gimnasio", "ascensor", "elevator", "amenity", "amenities",
    "ruido", "musica", "noise", "quiet", "silence", "fumar", "smoke", "smoking",
    "mantenimiento", "filtracion", "reparacion", "averia", "basura", "trash", "garbage", "maintenance", "repair",
    "pago", "pagos", "saldo", "deuda", "cuota", "condominio", "cobranza", "mora", "multa", "payment", "payments", "balance", "assessment", "fine",
    "documento", "documentos", "acta", "actas", "document", "documents",
  ];
  const hasScopeTerm = scopeTerms.some((term) => normalizedQuestion.includes(normalizeSearchText(term)));
  const hasCommunityNameTerm = communityTokens.some((token) => normalizedQuestion.includes(token));

  return hasScopeTerm || hasCommunityNameTerm;
}

function buildOutOfScopeAgentAnswer(question, community) {
  const spanish = looksSpanish(question);
  const answer = spanish
    ? `Solo puedo responder preguntas relacionadas con ${community.name}: reglamentos, pagos, reservas, mantenimiento, residentes o administracion del condominio. No puedo ayudar con temas externos a esta comunidad.`
    : `I can only answer questions related to ${community.name}: rules, payments, reservations, maintenance, residents, or community administration. I cannot help with topics outside this community.`;

  return {
    answer,
    confidence: "none",
    needsHumanReview: true,
    outOfScope: true,
    citations: [],
  };
}

function looksSpanish(text) {
  return /\b(que|como|cual|puedo|debo|dice|reglamento|condominio|pago|saldo|mascotas|administracion)\b/i.test(
    normalizeSearchText(text),
  );
}

function tokenizeForSearch(text) {
  const stopwords = new Set([
    "que", "como", "para", "con", "del", "las", "los", "una", "uno", "the", "and", "for", "can", "may", "what", "how",
    "dice", "puedo", "puede", "sobre", "reglamento", "norma", "normas", "rules", "rule",
  ]);

  return normalizeSearchText(text)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 2 && !stopwords.has(token));
}

function normalizeSearchText(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

async function getObjectText(bucket, key) {
  const result = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  return result.Body.transformToString();
}

async function getObjectBuffer(bucket, key) {
  const result = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const chunks = [];

  for await (const chunk of result.Body) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks);
}

async function extractTextWithTextract(file) {
  const result = await textract.send(new DetectDocumentTextCommand({
    Document: {
      S3Object: {
        Bucket: file.bucket,
        Name: file.objectKey,
      },
    },
  }));

  const lines = (result.Blocks || [])
    .filter((block) => block.BlockType === "LINE" && block.Text)
    .map((block) => ({
      text: block.Text,
      confidence: Number(block.Confidence || 0),
    }));

  await ddb.send(new UpdateItemCommand({
    TableName: env.uploadedFilesTable,
    Key: { id: { S: file.fileId } },
    UpdateExpression: "SET updatedAt = :updatedAt, ocrStatus = :ocrStatus, ocrLineCount = :ocrLineCount, ocrTextPreview = :ocrTextPreview",
    ExpressionAttributeValues: {
      ":updatedAt": { S: new Date().toISOString() },
      ":ocrStatus": { S: "completed" },
      ":ocrLineCount": { N: String(lines.length) },
      ":ocrTextPreview": { S: lines.map((line) => line.text).join("\n").slice(0, 4000) },
    },
  }));

  return { lines };
}

function parseOcrRows(lines) {
  const textLines = lines.map((line) => String(line.text || "").trim()).filter(Boolean);
  const delimitedLines = textLines.filter((line) => line.includes(",") || line.includes("\t"));

  if (delimitedLines.length >= 2) {
    const csvLikeText = delimitedLines.map((line) => line.replace(/\t/g, ",")).join("\n");
    return parseCsvRows(csvLikeText);
  }

  return textLines
    .filter((line) => !looksLikeHeaderLine(line))
    .map(parseOcrStructuredLine)
    .filter(Boolean);
}

async function extractRowsWithLlm(lines, file) {
  const modelId = String(env.bedrockModelId || "");

  if (!modelId || modelId === "disabled") {
    return { enabled: false, rows: [] };
  }

  const ocrText = lines.map((line) => line.text).join("\n").slice(0, 12000);
  const prompt = [
    "Extract condominium account rows from this OCR text.",
    "Return only valid JSON with this exact shape:",
    "{\"rows\":[{\"unit\":\"A-101\",\"owner\":\"Name\",\"balance\":125}]}",
    "Rules:",
    "- Unit identifiers may be called unit, apartment, apt, home, house, door, casa, unidad, apartamento, or apto.",
    "- Include every row or sentence that has a unit/home identifier and an owner or balance.",
    "- Do not omit rows just because the word is Home instead of Apartment.",
    "- balance must be a number. Use 0 when paid or missing.",
    "- If text says no outstanding balance, paid, current, or no balance, use balance 0.",
    "- If text says balance due, unpaid balance, saldo, deuda, or outstanding, extract that amount.",
    "- Do not include markdown, comments, or extra text.",
    "",
    "OCR text:",
    ocrText,
  ].join("\n");

  try {
    const result = await bedrock.send(new ConverseCommand({
      modelId,
      system: [
        {
          text: "You extract structured data from condominium administration OCR text. You return strict JSON only.",
        },
      ],
      messages: [
        {
          role: "user",
          content: [{ text: prompt }],
        },
      ],
      inferenceConfig: {
        maxTokens: 1200,
        temperature: 0,
      },
    }));

    const text = (result.output?.message?.content || [])
      .map((content) => content.text || "")
      .join("")
      .trim();
    const parsed = parseJsonFromModelText(text);
    const rows = Array.isArray(parsed?.rows) ? parsed.rows : [];

    await ddb.send(new UpdateItemCommand({
      TableName: env.uploadedFilesTable,
      Key: { id: { S: file.fileId } },
      UpdateExpression: "SET updatedAt = :updatedAt, llmExtractionStatus = :llmExtractionStatus, llmRowsFound = :llmRowsFound",
      ExpressionAttributeValues: {
        ":updatedAt": { S: new Date().toISOString() },
        ":llmExtractionStatus": { S: "completed" },
        ":llmRowsFound": { N: String(rows.length) },
      },
    }));

    return {
      enabled: true,
      rows: rows.map((row) => ({
        unit: row.unit || "",
        owner: row.owner || "",
        balance: row.balance ?? 0,
      })),
    };
  } catch (error) {
    console.error("Bedrock extraction failed", error);
    await ddb.send(new UpdateItemCommand({
      TableName: env.uploadedFilesTable,
      Key: { id: { S: file.fileId } },
      UpdateExpression: "SET updatedAt = :updatedAt, llmExtractionStatus = :llmExtractionStatus",
      ExpressionAttributeValues: {
        ":updatedAt": { S: new Date().toISOString() },
        ":llmExtractionStatus": { S: "failed" },
      },
    }));
    return { enabled: true, rows: [] };
  }
}

function parseJsonFromModelText(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

function parseOcrStructuredLine(line) {
  const match = line.match(/^\s*([A-Za-z0-9][A-Za-z0-9.-]*)\s+(.+?)\s+([$]?\d[\d,.]*)\s*$/);
  if (!match) return null;

  return {
    unit: match[1],
    owner: match[2].trim(),
    balance: match[3],
  };
}

function looksLikeHeaderLine(line) {
  const normalized = normalizeHeader(line);
  const hasUnit = ["unit", "unidad", "apto", "apartamento", "door", "casa"].some((key) => normalized.includes(key));
  const hasOwner = ["owner", "propietario", "resident", "residente", "nombre"].some((key) => normalized.includes(key));
  const hasBalance = ["balance", "saldo", "debt", "deuda", "amount", "monto"].some((key) => normalized.includes(key));
  return Number(hasUnit) + Number(hasOwner) + Number(hasBalance) >= 2;
}

async function parseXlsxRows(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const workbookXml = await readZipText(zip, "xl/workbook.xml");
  const workbookRelsXml = await readZipText(zip, "xl/_rels/workbook.xml.rels");
  const sharedStrings = await readSharedStrings(zip);
  const firstSheetPath = getFirstWorksheetPath(workbookXml, workbookRelsXml);

  if (!firstSheetPath) return [];

  const sheetXml = await readZipText(zip, firstSheetPath);
  const sheetRows = extractWorksheetRows(sheetXml, sharedStrings);

  return rowsToRecords(sheetRows);
}

async function readZipText(zip, path) {
  const file = zip.file(path);
  if (!file) return "";
  return file.async("text");
}

async function readSharedStrings(zip) {
  const xml = await readZipText(zip, "xl/sharedStrings.xml");
  if (!xml) return [];

  const parsed = xmlParser.parse(xml);
  const items = toArray(parsed?.sst?.si);

  return items.map((item) => {
    if (item?.t !== undefined) return getTextValue(item.t);
    return toArray(item?.r).map((run) => getTextValue(run?.t)).join("");
  });
}

function getFirstWorksheetPath(workbookXml, workbookRelsXml) {
  const workbook = xmlParser.parse(workbookXml);
  const rels = xmlParser.parse(workbookRelsXml);
  const firstSheet = toArray(workbook?.workbook?.sheets?.sheet)[0];
  const relationshipId = firstSheet?.["r:id"];

  if (!relationshipId) return "xl/worksheets/sheet1.xml";

  const relationship = toArray(rels?.Relationships?.Relationship)
    .find((rel) => rel.Id === relationshipId);

  if (!relationship?.Target) return "xl/worksheets/sheet1.xml";

  const target = String(relationship.Target);
  if (target.startsWith("/")) return target.slice(1);
  if (target.startsWith("xl/")) return target;
  return `xl/${target}`;
}

function extractWorksheetRows(sheetXml, sharedStrings) {
  const parsed = xmlParser.parse(sheetXml);
  const rows = toArray(parsed?.worksheet?.sheetData?.row);

  return rows.map((row) => {
    const cells = toArray(row?.c);
    const values = [];

    for (const cell of cells) {
      const columnIndex = getColumnIndex(cell.r);
      values[columnIndex] = getCellValue(cell, sharedStrings);
    }

    return values.map((value) => value ?? "");
  });
}

function getCellValue(cell, sharedStrings) {
  const rawValue = getTextValue(cell?.v);

  if (cell?.t === "s") {
    return sharedStrings[Number(rawValue)] || "";
  }

  if (cell?.t === "inlineStr") {
    if (cell?.is?.t !== undefined) return getTextValue(cell.is.t);
    return toArray(cell?.is?.r).map((run) => getTextValue(run?.t)).join("");
  }

  return rawValue;
}

function rowsToRecords(rows) {
  const meaningfulRows = rows.filter((row) => row.some((value) => String(value || "").trim()));
  if (meaningfulRows.length < 2) return [];

  const headers = meaningfulRows[0].map(normalizeHeader);
  return meaningfulRows.slice(1).map((row) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = row[index] || "";
    });
    return record;
  });
}

function parseCsvRows(text) {
  const rows = parseCsv(text.trim());
  if (rows.length < 2) return [];

  return rowsToRecords(rows);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && insideQuotes && nextChar === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  row.push(value);
  rows.push(row);
  return rows;
}

function normalizeCommunityRow(row) {
  const unit = getFirstValue(row, ["unit", "unidad", "apto", "apartment", "apartamento", "door", "casa"]);
  const owner = getFirstValue(row, ["owner", "propietario", "resident", "residente", "name", "nombre"]);
  const balanceValue = getFirstValue(row, ["balance", "saldo", "debt", "deuda", "amount", "monto"]);

  return {
    unit: String(unit || "").trim(),
    owner: String(owner || "").trim(),
    balance: parseMoney(balanceValue),
  };
}

function getFirstValue(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== "") return row[key];
  }

  return "";
}

function normalizeHeader(header) {
  return String(header || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function parseMoney(value) {
  const cleaned = String(value || "")
    .replace(/[^0-9.,-]/g, "")
    .replace(/,/g, "");
  const amount = Number(cleaned);
  return Number.isFinite(amount) ? amount : 0;
}

function toArray(value) {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

function getTextValue(value) {
  if (value === undefined || value === null) return "";
  if (typeof value === "object" && "text" in value) return String(value.text || "");
  return String(value);
}

function getColumnIndex(cellReference) {
  const letters = String(cellReference || "A").match(/[A-Z]+/i)?.[0]?.toUpperCase() || "A";
  let index = 0;

  for (let position = 0; position < letters.length; position += 1) {
    index = index * 26 + (letters.charCodeAt(position) - 64);
  }

  return index - 1;
}

function parseBody(event) {
  if (!event.body) return {};
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
  return JSON.parse(rawBody);
}

function validateUploadFile(file) {
  const name = String(file.name || "");
  const size = Number(file.size || 0);
  const extension = getExtension(name);

  if (!name) {
    return { error: "file_name_required" };
  }

  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return { error: "unsupported_file_type", fileName: name };
  }

  if (!Number.isFinite(size) || size <= 0) {
    return { error: "invalid_file_size", fileName: name };
  }

  if (size > MAX_UPLOAD_SIZE_BYTES) {
    return { error: "file_too_large", fileName: name, maxBytes: MAX_UPLOAD_SIZE_BYTES };
  }

  if (["pdf", "jpg", "jpeg", "png"].includes(extension) && size > MAX_SYNC_OCR_SIZE_BYTES) {
    return { error: "file_too_large_for_sync_ocr", fileName: name, maxBytes: MAX_SYNC_OCR_SIZE_BYTES };
  }

  return null;
}

function getExtension(name) {
  return name.toLowerCase().split(".").pop() || "";
}

function sanitizeFileName(name) {
  return String(name)
    .normalize("NFKD")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120) || "upload";
}

function getFileKind(name, contentType) {
  const extension = getExtension(name);

  if (["xlsx", "xls", "csv"].includes(extension)) return "spreadsheet";
  if (extension === "pdf" || contentType.includes("pdf")) return "pdf";
  if (["jpg", "jpeg", "png"].includes(extension) || contentType.startsWith("image/")) return "image";
  return "unknown";
}

function getProgressForStatus(status) {
  if (status === "processing_running") return 75;
  if (status === "files_uploaded") return 45;
  if (status === "account_completed") return 25;
  if (status === "manual_setup_completed") return 100;
  if (status === "review_completed") return 100;
  if (status === "completed") return 100;
  return 0;
}

function parseJsonAttribute(value, fallback = null) {
  if (!value) return fallback;

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "access-control-allow-origin": env.corsAllowOrigin,
      "access-control-allow-methods": "GET,POST,PATCH,PUT,OPTIONS",
      "access-control-allow-headers": "content-type,authorization",
      "content-type": "application/json",
    },
    body: body === null ? "" : JSON.stringify(body),
  };
}
