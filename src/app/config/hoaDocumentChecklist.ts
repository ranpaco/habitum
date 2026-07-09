export interface HoaDocumentChecklistCategory {
  title: string;
  description: string;
  documents: string[];
}

export const hoaDocumentChecklist: HoaDocumentChecklistCategory[] = [
  {
    title: "Governing Documents",
    description: "Core documents that define how the HOA operates and what owners can or cannot do.",
    documents: [
      "Declaration / CC&Rs / restrictive covenants",
      "Articles of incorporation or certificate of formation",
      "Bylaws and amendments",
      "Current rules and regulations",
      "Architectural guidelines and approval procedures",
      "Enforcement policy, fine schedule, and violation procedures",
    ],
  },
  {
    title: "Financial and Assessment Records",
    description: "Documents needed for balances, dues, collections, reserves, and financial questions.",
    documents: [
      "Current annual budget and proposed budget",
      "Income and expense statements",
      "Balance sheet and budget comparison",
      "General ledger or accounting export",
      "Assessment schedule, special assessment notices, and fee schedule",
      "Owner account ledgers with charges, payments, late fees, and balances",
      "Tax returns, audits, reviews, or compiled financial statements",
      "Reserve study, reserve funding plan, and reserve account balances",
    ],
  },
  {
    title: "Owners, Lots, and Access Data",
    description: "Structured records that connect owners, units, parcels, notices, and portal access.",
    documents: [
      "Owner roster / membership list",
      "Unit, lot, parcel, or address list",
      "Mailing addresses and notice preferences",
      "Email or electronic notice consent list",
      "Rental or tenant registration records when applicable",
      "Gate, amenity, parking, or access device assignments",
    ],
  },
  {
    title: "Meetings, Elections, and Board Governance",
    description: "Records that explain board decisions and let the agent answer process questions.",
    documents: [
      "Board meeting minutes",
      "Member meeting minutes",
      "Meeting notices and agendas",
      "Election rules and voting procedures",
      "Ballots, proxies, sign-in sheets, and voting results",
      "Director certifications, conflict disclosures, and board policies",
    ],
  },
  {
    title: "Insurance, Contracts, and Vendors",
    description: "Operational documents administrators often need to answer owner and board questions.",
    documents: [
      "Property, general liability, fidelity/crime, flood, and other insurance policies",
      "Insurance declaration pages and deductible summaries",
      "Management agreement",
      "Landscaping, pool, security, maintenance, janitorial, and other vendor contracts",
      "Leases, service agreements, bids, proposals, and approved invoices",
      "Warranties, permits, plans, and specifications for common-area improvements",
    ],
  },
  {
    title: "Compliance, Requests, and Legal Workflow",
    description: "Documents that power resident support, escalation rules, and board review queues.",
    documents: [
      "Architectural request forms and approvals",
      "Violation notices and unresolved violation summaries",
      "Collection policy and delinquency notices",
      "Dispute resolution procedures",
      "Maintenance work orders and incident reports",
      "Disclosure packages, resale certificates, estoppel letters, or transfer documents",
    ],
  },
];

