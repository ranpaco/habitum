export interface DemoRequestFormData {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  condoName: string;
  condoSize: string;
  role: string;
}

export interface CreateDemoRequestInput extends DemoRequestFormData {
  region: "latam" | "usa";
}

export interface CreateDemoRequestResponse {
  demoRequestId: string;
  status: "received";
}

export interface DemoRequestSubmission extends DemoRequestFormData {
  demoRequestId: string;
  status: "received";
}

