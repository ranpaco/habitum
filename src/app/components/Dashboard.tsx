import { useCallback, useEffect, useState } from "react";
import { Activity, AlertCircle, Bot, Building2, CheckCircle, DollarSign, FileText, RefreshCw, Send, Upload, Users } from "lucide-react";
import { AddOwnerDialog } from "./dashboard/AddOwnerDialog";
import { RecordPaymentDialog } from "./dashboard/RecordPaymentDialog";
import { UnitDirectory } from "./dashboard/UnitDirectory";
import { fallbackDashboard } from "../mocks/dashboard";
import { askCommunityAgent, createCommunityOwner, getCommunityDashboard, recordCommunityPayment } from "../services/dashboard";
import { AgentAskResponse, CreateOwnerInput, DashboardData, DashboardUnit, RecordPaymentInput } from "../types/dashboard";

const COMMUNITY_STORAGE_KEY = "habitum.communityId";

type DashboardDataMode = "sample" | "live";

export function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(fallbackDashboard);
  const [dataMode, setDataMode] = useState<DashboardDataMode>("sample");
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [agentQuestion, setAgentQuestion] = useState("");
  const [agentAnswer, setAgentAnswer] = useState<AgentAskResponse | null>(null);
  const [isAskingAgent, setIsAskingAgent] = useState(false);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [isOwnerDialogOpen, setIsOwnerDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const loadLiveDashboard = useCallback((communityId: string) => {
    setIsLoading(true);
    setLoadError(null);

    return getCommunityDashboard(communityId)
      .then((data) => {
        setDashboardData(data);
        setDataMode("live");
        sessionStorage.setItem(COMMUNITY_STORAGE_KEY, data.community.id);
      })
      .catch((error) => {
        console.error(error);
        setDataMode("sample");
        setLoadError("We could not load the live dashboard data. Showing sample data.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const communityId = getCommunityIdFromHash() || sessionStorage.getItem(COMMUNITY_STORAGE_KEY);

    if (!communityId) {
      return;
    }

    loadLiveDashboard(communityId);
  }, [loadLiveDashboard]);

  const { community, metrics, recentPayments, agent } = dashboardData;
  const isSampleData = dataMode === "sample";
  const activeCommunityId = isSampleData ? null : community.id;
  const units = getDashboardUnits(dashboardData);

  const recordPayment = async (payment: RecordPaymentInput) => {
    if (!activeCommunityId) throw new Error("Live community required");
    const result = await recordCommunityPayment(activeCommunityId, payment);
    setDashboardData(result.dashboard);
    setActionSuccess(`${formatMoney(result.payment.amount, result.payment.currency)} payment recorded for ${result.payment.unit}.`);
  };

  const addOwner = async (owner: CreateOwnerInput) => {
    if (!activeCommunityId) throw new Error("Live community required");
    const result = await createCommunityOwner(activeCommunityId, owner);
    setDashboardData(result.dashboard);
    setActionSuccess(`${result.unit.owner} was added to unit ${result.unit.unit}.`);
  };

  const askAgent = async (question: string) => {
    const trimmedQuestion = question.trim();
    if (!activeCommunityId || !trimmedQuestion) return;

    setIsAskingAgent(true);
    setAgentError(null);
    setAgentAnswer(null);

    try {
      setAgentAnswer(await askCommunityAgent(activeCommunityId, trimmedQuestion));
      setAgentQuestion(trimmedQuestion);
    } catch (error) {
      console.error(error);
      setAgentError("We could not ask the AI agent right now. Try again after the documents finish processing.");
    } finally {
      setIsAskingAgent(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#1A365D] to-[#00A3BF]">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-bold text-[#1A365D]">Habitum</span>
                <p className="truncate text-xs text-gray-600">
                  {community.name}{isSampleData ? " · sample data" : ""}
                </p>
              </div>
            </div>
            <div className="ml-3 flex shrink-0 items-center gap-3 sm:gap-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-[#1A365D]">Admin Dashboard</p>
                <p className="text-xs text-gray-600">admin@condominium.com</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#00A3BF] to-[#1A365D] font-bold text-white" title="Administrator account">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        {isLoading && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Loading live dashboard data...
          </div>
        )}

        {loadError && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800 sm:flex-row sm:items-center sm:justify-between">
            <span>{loadError}</span>
            {(getCommunityIdFromHash() || sessionStorage.getItem(COMMUNITY_STORAGE_KEY)) && (
              <button
                type="button"
                onClick={() => {
                  const communityId = getCommunityIdFromHash() || sessionStorage.getItem(COMMUNITY_STORAGE_KEY);
                  if (communityId) loadLiveDashboard(communityId);
                }}
                disabled={isLoading}
                className="rounded-lg border border-yellow-300 bg-white px-3 py-2 text-sm font-semibold text-yellow-800 hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Retrying..." : "Retry Live Data"}
              </button>
            )}
          </div>
        )}

        {actionSuccess && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800" role="status">
            <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4 shrink-0" />{actionSuccess}</span>
            <button type="button" onClick={() => setActionSuccess(null)} className="font-semibold hover:text-emerald-950">Dismiss</button>
          </div>
        )}

        {isSampleData && (
          <div className="mb-6 break-words rounded-xl border border-[#00A3BF]/30 bg-[#00A3BF]/10 px-4 py-3 text-sm font-medium text-[#1A365D]">
            Sample demo data is active. Complete onboarding or open a dashboard link with a communityId to load live data.
          </div>
        )}

        {/* Operational Context */}
        <section className="mb-8 border-b border-gray-200 pb-6" aria-labelledby="dashboard-title">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${isSampleData ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                  {isSampleData ? "Sample workspace" : "Live workspace"}
                </span>
                <span className="text-xs text-gray-500">Updated {formatDateTime(dashboardData.lastUpdatedAt)}</span>
              </div>
              <h1 id="dashboard-title" className="text-3xl font-bold text-[#1A365D]">{community.name}</h1>
              <p className="mt-2 text-sm text-gray-600">Community operations overview</p>
            </div>

            <div className="flex flex-wrap gap-3">
              {!isSampleData && activeCommunityId && (
                <button
                  type="button"
                  onClick={() => loadLiveDashboard(activeCommunityId)}
                  disabled={isLoading}
                  className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-[#1A365D] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              )}
              <a
                href="#onboarding"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#00A3BF] px-4 text-sm font-semibold text-white hover:bg-[#008CA3]"
              >
                <Upload className="h-4 w-4" />
                Import data
              </a>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#1A365D] mb-1">{metrics.totalUnits}</div>
            <div className="text-gray-600 text-sm">Total units</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#1A365D] mb-1">{metrics.activeOwners}</div>
            <div className="text-gray-600 text-sm">Active owners</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{formatMoney(metrics.totalBalances, community.baseCurrency)}</div>
            <div className="text-gray-600 text-sm">Outstanding balance</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#1A365D] mb-1">{metrics.collectionRate}%</div>
            <div className="text-gray-600 text-sm">Collection rate</div>
          </div>
        </div>

        <UnitDirectory units={units} defaultCurrency={community.baseCurrency} />

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            {/* Recent Payments */}
            <section className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h2 className="text-2xl font-bold text-[#1A365D] mb-6">Recent Payments</h2>
              <div className="space-y-4">
                {recentPayments.length === 0 && (
                  <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
                    Recorded payments will appear here.
                  </div>
                )}

                {recentPayments.slice(0, 5).map((payment, index) => (
                  <div key={payment.id || `${payment.unit}-${index}`} className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="w-10 h-10 shrink-0 bg-gradient-to-br from-[#00A3BF] to-[#1A365D] rounded-lg flex items-center justify-center text-white font-bold">
                        {payment.unit[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#1A365D]">{payment.unit}</p>
                        <p className="truncate text-sm text-gray-600">{payment.owner}</p>
                        {payment.paidAt && <p className="mt-0.5 text-xs text-gray-500">{formatDate(payment.paidAt)} · {formatStatus(payment.method || "manual")}</p>}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold text-[#1A365D]">{formatMoney(payment.amount, payment.currency)}</p>
                      <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                        payment.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {formatStatus(payment.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-gray-100 bg-white p-8 shadow-lg">
              <div className="mb-5 flex items-center gap-3">
                <Activity className="h-5 w-5 text-[#00A3BF]" />
                <h2 className="text-xl font-bold text-[#1A365D]">Recent activity</h2>
              </div>
              {dashboardData.activity?.length ? (
                <div className="space-y-4">
                  {dashboardData.activity.slice(0, 5).map((entry) => (
                    <div key={entry.id} className="border-l-2 border-[#00A3BF]/30 pl-4">
                      <p className="text-sm font-semibold text-[#1A365D]">{entry.description}</p>
                      <p className="mt-1 text-xs text-gray-500">{entry.unit ? `${entry.unit} · ` : ""}{formatDateTime(entry.occurredAt)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600">Administrative actions will appear here.</p>
              )}
            </section>
          </div>

          {/* AI Agent */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#1A365D] mb-2">AI Rules Agent</h2>
                <p className="text-sm text-gray-600">
                  {agent.knowledgeDocuments > 0
                    ? `${agent.knowledgeDocuments} knowledge source${agent.knowledgeDocuments === 1 ? "" : "s"} ready for grounded answers.`
                    : "Upload regulations or add manual rules to activate grounded answers."}
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                agent.status === "ready" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
              }`}>
                <Bot className="w-4 h-4" />
                {agent.status === "ready" ? "Ready" : "No Docs"}
              </div>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {agent.suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => askAgent(question)}
                  disabled={isAskingAgent || !activeCommunityId}
                  className="rounded-full border border-[#00A3BF]/30 px-3 py-2 text-left text-xs font-semibold text-[#1A365D] hover:border-[#00A3BF] hover:bg-[#00A3BF]/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {question}
                </button>
              ))}
            </div>

            <form
              className="flex gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                askAgent(agentQuestion);
              }}
            >
              <input
                value={agentQuestion}
                onChange={(event) => setAgentQuestion(event.target.value)}
                placeholder="Ask about pets, reservations, noise rules..."
                className="min-w-0 flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
              />
              <button
                type="submit"
                disabled={isAskingAgent || !activeCommunityId || !agentQuestion.trim()}
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#00A3BF] text-white hover:bg-[#008CA3] disabled:cursor-not-allowed disabled:bg-gray-300"
                aria-label="Ask AI agent"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            {isAskingAgent && (
              <div className="mt-5 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                Searching community knowledge...
              </div>
            )}

            {agentError && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {agentError}
              </div>
            )}

            {agentAnswer && (
              <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#1A365D]">
                    <Bot className="w-4 h-4" />
                    Answer
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-600">
                    {agentAnswer.confidence} confidence
                  </span>
                </div>
                <p className="text-sm leading-6 text-gray-700">{agentAnswer.answer}</p>

                {agentAnswer.citations.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {agentAnswer.citations.map((citation, index) => (
                      <div key={`${citation.documentName}-${index}`} className="rounded-lg bg-white p-3 text-xs text-gray-600">
                        <div className="mb-1 flex items-center gap-2 font-semibold text-[#1A365D]">
                          <FileText className="w-3.5 h-3.5" />
                          {citation.documentName}
                        </div>
                        <p className="line-clamp-3">{citation.excerpt}</p>
                      </div>
                    ))}
                  </div>
                )}

                {agentAnswer.needsHumanReview && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    {agentAnswer.outOfScope
                      ? "This question is outside the community scope."
                      : "Review this answer before sending it to a resident."}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1A365D] mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => { setActionSuccess(null); setIsOwnerDialogOpen(true); }}
              disabled={!activeCommunityId}
              title={activeCommunityId ? "Add an owner and unit" : "Open a live community to add owners"}
              className="p-6 bg-gradient-to-br from-[#00A3BF]/10 to-[#1A365D]/10 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-[#00A3BF] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-transparent disabled:hover:shadow-none"
            >
              <Users className="w-8 h-8 text-[#00A3BF] mb-3" />
              <p className="font-semibold text-[#1A365D]">Add Owner</p>
            </button>
            <button
              type="button"
              onClick={() => { setActionSuccess(null); setIsPaymentDialogOpen(true); }}
              disabled={!activeCommunityId}
              title={activeCommunityId ? "Record a manual payment" : "Open a live community to record payments"}
              className="p-6 bg-gradient-to-br from-[#00A3BF]/10 to-[#1A365D]/10 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-[#00A3BF] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-transparent disabled:hover:shadow-none"
            >
              <DollarSign className="w-8 h-8 text-[#00A3BF] mb-3" />
              <p className="font-semibold text-[#1A365D]">Record Payment</p>
            </button>
            <button className="p-6 bg-gradient-to-br from-[#00A3BF]/10 to-[#1A365D]/10 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-[#00A3BF]">
              <Bot className="w-8 h-8 text-[#00A3BF] mb-3" />
              <p className="font-semibold text-[#1A365D]">Configure Agent</p>
            </button>
            <button className="p-6 bg-gradient-to-br from-[#00A3BF]/10 to-[#1A365D]/10 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-[#00A3BF]">
              <AlertCircle className="w-8 h-8 text-[#00A3BF] mb-3" />
              <p className="font-semibold text-[#1A365D]">View Reports</p>
            </button>
            </div>
          </div>
      </div>
      <AddOwnerDialog
        open={isOwnerDialogOpen}
        onOpenChange={setIsOwnerDialogOpen}
        units={units}
        currency={community.baseCurrency}
        onSubmit={addOwner}
      />
      <RecordPaymentDialog
        open={isPaymentDialogOpen}
        onOpenChange={setIsPaymentDialogOpen}
        units={units}
        currency={community.baseCurrency}
        onSubmit={recordPayment}
      />
    </div>
  );
}

function getCommunityIdFromHash() {
  const [, query = ""] = window.location.hash.split("?");
  return new URLSearchParams(query).get("communityId");
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatStatus(status: string) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getDashboardUnits(data: DashboardData): DashboardUnit[] {
  if (data.units?.length) return data.units;

  return data.recentPayments.map((payment, index) => ({
    id: `${data.community.id}:${payment.unit}:${index}`,
    unit: payment.unit,
    owner: payment.owner,
    balance: payment.status === "completed" || payment.status === "paid" ? 0 : payment.amount,
    currency: payment.currency || data.community.baseCurrency,
    status: payment.status === "completed" || payment.status === "paid" ? "current" : "pending",
    lastActivityAt: data.lastUpdatedAt,
  }));
}

function formatDateTime(value?: string) {
  if (!value) return "not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "not available";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}
