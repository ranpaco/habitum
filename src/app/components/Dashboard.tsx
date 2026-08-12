import { useEffect, useState } from "react";
import { AlertCircle, Bot, Building2, CheckCircle, DollarSign, FileText, Send, Users } from "lucide-react";
import { fallbackDashboard } from "../mocks/dashboard";
import { askCommunityAgent, getCommunityDashboard } from "../services/dashboard";
import { AgentAskResponse, DashboardData } from "../types/dashboard";

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

  useEffect(() => {
    const communityId = getCommunityIdFromHash() || sessionStorage.getItem(COMMUNITY_STORAGE_KEY);

    if (!communityId) {
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    getCommunityDashboard(communityId)
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

  const { community, metrics, recentPayments, agent } = dashboardData;
  const isSampleData = dataMode === "sample";
  const activeCommunityId = isSampleData ? null : community.id;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#1A365D] to-[#00A3BF] rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-[#1A365D]">Habitum</span>
                <p className="text-xs text-gray-600">
                  {community.name}{isSampleData ? " · sample data" : ""}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-[#1A365D]">Admin Dashboard</p>
                <p className="text-xs text-gray-600">admin@condominium.com</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-[#00A3BF] to-[#1A365D] rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        {isLoading && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            Loading live dashboard data...
          </div>
        )}

        {loadError && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {loadError}
          </div>
        )}

        {isSampleData && (
          <div className="mb-6 rounded-xl border border-[#00A3BF]/30 bg-[#00A3BF]/10 px-4 py-3 text-sm font-medium text-[#1A365D]">
            Sample demo data is active. Complete onboarding or open a dashboard link with a communityId to load live data.
          </div>
        )}

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#1A365D] to-[#00A3BF] rounded-3xl p-12 mb-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4">Welcome to Your Dashboard! 🎉</h1>
            <p className="text-xl text-white/90 mb-6">
              {community.name} is now ready for the Habitum demo workspace.
            </p>
            <button className="bg-white text-[#1A365D] px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all">
              Take a Quick Tour
            </button>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#1A365D] mb-1">{metrics.totalUnits}</div>
            <div className="text-gray-600 text-sm">Total Units</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#1A365D] mb-1">{metrics.activeOwners}</div>
            <div className="text-gray-600 text-sm">Active Owners</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-1">{formatMoney(metrics.totalBalances, community.baseCurrency)}</div>
            <div className="text-gray-600 text-sm">Total Balances</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-[#1A365D] mb-1">{metrics.collectionRate}%</div>
            <div className="text-gray-600 text-sm">Collection Rate</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Payments */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-[#1A365D] mb-6">Recent Payments</h2>
            <div className="space-y-4">
              {recentPayments.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
                  Payment data will appear here after the upload and reconciliation step is connected.
                </div>
              )}

              {recentPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00A3BF] to-[#1A365D] rounded-lg flex items-center justify-center text-white font-bold">
                      {payment.unit[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1A365D]">{payment.unit}</p>
                      <p className="text-sm text-gray-600">{payment.owner}</p>
                    </div>
                  </div>
                  <div className="text-right">
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
          </div>

          {/* AI Agent */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#1A365D] mb-2">AI Rules Agent</h2>
                <p className="text-sm text-gray-600">
                  {agent.knowledgeDocuments > 0
                    ? `${agent.knowledgeDocuments} uploaded document${agent.knowledgeDocuments === 1 ? "" : "s"} ready for grounded answers.`
                    : "Upload a clear PDF or image of the regulations to activate grounded answers."}
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
                Searching uploaded regulations...
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
            <button className="p-6 bg-gradient-to-br from-[#00A3BF]/10 to-[#1A365D]/10 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-[#00A3BF]">
              <Users className="w-8 h-8 text-[#00A3BF] mb-3" />
              <p className="font-semibold text-[#1A365D]">Add Owner</p>
            </button>
            <button className="p-6 bg-gradient-to-br from-[#00A3BF]/10 to-[#1A365D]/10 rounded-xl hover:shadow-lg transition-all border-2 border-transparent hover:border-[#00A3BF]">
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
