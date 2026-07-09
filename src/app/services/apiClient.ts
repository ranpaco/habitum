export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!apiBaseUrl) {
    throw new ApiError("Missing VITE_API_BASE_URL", 0);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...options.headers,
    },
  });

  const data = await parseJson(response);

  if (!response.ok) {
    const message = getErrorMessage(data) || `API request failed with ${response.status}`;
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

async function parseJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(data: unknown): string | null {
  if (data && typeof data === "object" && "error" in data) {
    return String((data as { error: unknown }).error);
  }

  return null;
}

