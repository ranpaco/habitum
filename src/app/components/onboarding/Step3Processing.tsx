import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import { CheckCircle, Sparkles, Users, Building, DollarSign, AlertCircle, Plus, Trash2 } from "lucide-react";
import { getOnboardingStatus, processOnboardingSession, reviewOnboardingData } from "../../services/onboarding";
import {
  OnboardingStatusResponse,
  ProcessingPreviewRow,
  ProcessingSummary,
} from "../../types/onboarding";

interface Step3Props {
  sessionId: string | null;
  onComplete: () => void;
}

const emptySummary: ProcessingSummary = {
  unitsFound: 0,
  ownersFound: 0,
  totalBalances: 0,
  collectionRate: 0,
  documentsFound: 0,
  rowsProcessed: 0,
};

export function Step3Processing({ sessionId, onComplete }: Step3Props) {
  const [status, setStatus] = useState<OnboardingStatusResponse | null>(null);
  const [reviewRows, setReviewRows] = useState<ProcessingPreviewRow[]>([]);
  const [hasSeededReviewRows, setHasSeededReviewRows] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [retryAttempt, setRetryAttempt] = useState(0);

  useEffect(() => {
    if (!sessionId) {
      setError("The onboarding session is missing. Please restart the onboarding flow.");
      return;
    }

    let cancelled = false;

    async function startProcessing() {
      setIsStarting(true);
      setError(null);
      setReviewRows([]);
      setHasSeededReviewRows(false);

      try {
        const result = await processOnboardingSession(sessionId);
        if (cancelled) return;
        setStatus({
          sessionId: result.sessionId,
          status: result.status,
          progress: result.progress,
          stage: result.status,
          summary: result.summary,
          previewRows: result.previewRows,
          extractedRows: result.extractedRows,
          issues: result.issues,
        });
      } catch (startError) {
        console.error(startError);
        if (!cancelled) {
          setError("We could not process your files. CSV, XLSX, PDF, JPG and PNG files are supported in this MVP.");
        }
      } finally {
        if (!cancelled) setIsStarting(false);
      }
    }

    startProcessing();

    return () => {
      cancelled = true;
    };
  }, [sessionId, retryAttempt]);

  useEffect(() => {
    const extractedRows = status?.extractedRows || status?.previewRows || [];
    const isReviewReady = status?.status === "completed" || status?.status === "review_completed";

    if (isReviewReady && extractedRows.length > 0 && !hasSeededReviewRows) {
      setReviewRows(extractedRows);
      setHasSeededReviewRows(true);
    }
  }, [status, hasSeededReviewRows]);

  useEffect(() => {
    if (!sessionId || status?.status === "completed" || status?.status === "review_completed" || error) return;

    const intervalId = window.setInterval(async () => {
      try {
        setStatus(await getOnboardingStatus(sessionId));
      } catch (pollError) {
        console.error(pollError);
      }
    }, 2500);

    return () => window.clearInterval(intervalId);
  }, [sessionId, status?.status, error]);

  const summary = status?.summary || emptySummary;
  const editedSummary = getSummaryFromRows(reviewRows, summary.documentsFound);
  const progress = status?.progress || (isStarting ? 60 : 0);
  const isComplete = status?.status === "completed" || status?.status === "review_completed";
  const processingStages = useMemo(() => ([
    { label: "Scanning Uploaded Files", icon: Building, threshold: 60 },
    { label: "Identifying Owners", icon: Users, threshold: 80 },
    { label: "Extracting Balances", icon: DollarSign, threshold: 100 },
  ]), []);

  if (isComplete) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-in fade-in duration-700">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-2xl animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-[#1A365D] mb-4">
            Digitization Complete!
          </h1>
          <p className="text-xl text-gray-600">
            Review the extracted data before opening the demo dashboard.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <SummaryCard
            icon={Building}
            value={editedSummary.unitsFound}
            label="Units Found"
            color="blue"
          />
          <SummaryCard
            icon={Users}
            value={editedSummary.ownersFound}
            label="Owners Identified"
            color="purple"
          />
          <SummaryCard
            icon={DollarSign}
            value={formatMoney(editedSummary.totalBalances)}
            label="Total Balances"
            color="green"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-[#1A365D] to-[#00A3BF] px-8 py-6">
            <h3 className="text-xl font-bold text-white">Review Extracted Data</h3>
          </div>
          <div className="p-8">
            {reviewRows.length > 0 ? (
              <div className="overflow-x-auto">
                <ReviewTable
                  rows={reviewRows}
                  onChange={setReviewRows}
                />
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
                No structured rows were detected yet. Add rows manually or upload a clearer file.
              </div>
            )}

            <button
              type="button"
              onClick={() => setReviewRows([...reviewRows, { unit: "", owner: "", balance: 0, status: "paid" }])}
              className="mt-5 inline-flex items-center gap-2 rounded-lg border border-[#00A3BF] px-4 py-2 text-sm font-semibold text-[#00A3BF] hover:bg-[#00A3BF] hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Row
            </button>
          </div>
        </div>

        {status?.issues && status.issues.length > 0 && (
          <div className="mb-8 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            {status.issues[0].message}
          </div>
        )}

        {reviewError && (
          <div className="mb-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {reviewError}
          </div>
        )}

        <Button
          onClick={async () => {
            if (!sessionId) return;
            setIsSavingReview(true);
            setReviewError(null);
            try {
              await reviewOnboardingData(sessionId, reviewRows);
              onComplete();
            } catch (saveError) {
              console.error(saveError);
              setReviewError("We could not save the reviewed data. Please check the rows and try again.");
            } finally {
              setIsSavingReview(false);
            }
          }}
          disabled={isSavingReview || reviewRows.length === 0}
          size="lg"
          className="w-full h-16 bg-gradient-to-r from-[#00A3BF] to-[#1A365D] hover:from-[#00A3BF]/90 hover:to-[#1A365D]/90 text-white text-xl font-semibold shadow-2xl hover:shadow-3xl transition-all"
        >
          <CheckCircle className="w-6 h-6 mr-3" />
          {isSavingReview ? "Saving Reviewed Data..." : "Confirm and Open Dashboard"}
          <svg className="w-6 h-6 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#00A3BF] to-[#1A365D] rounded-full mb-6 shadow-2xl animate-pulse">
          {error ? (
            <AlertCircle className="w-12 h-12 text-white" />
          ) : (
            <Sparkles className="w-12 h-12 text-white animate-spin" style={{ animationDuration: "3s" }} />
          )}
        </div>
        <h1 className="text-4xl font-bold text-[#1A365D] mb-4">
          {error ? "Processing Needs Attention" : "AI is Processing Your Data"}
        </h1>
        <p className="text-xl text-gray-600">
          {error || "Reading uploaded files and building your demo dashboard."}
        </p>
      </div>

      <div className="mb-12">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00A3BF] to-[#1A365D] transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4 mb-12">
        {processingStages.map((stage) => {
          const StageIcon = stage.icon;
          const isCompleteStage = progress >= stage.threshold;
          const isActive = !isCompleteStage && progress >= stage.threshold - 25;

          return (
            <div
              key={stage.label}
              className={`flex items-center gap-4 p-6 rounded-2xl border-2 transition-all duration-500 ${
                isActive
                  ? "bg-gradient-to-r from-[#00A3BF]/10 to-[#1A365D]/10 border-[#00A3BF] shadow-lg scale-105"
                  : isCompleteStage
                  ? "bg-green-50 border-green-300"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? "bg-gradient-to-br from-[#00A3BF] to-[#1A365D] animate-pulse"
                  : isCompleteStage
                  ? "bg-green-500"
                  : "bg-gray-200"
              }`}>
                {isCompleteStage ? (
                  <CheckCircle className="w-8 h-8 text-white" />
                ) : (
                  <StageIcon className={`w-8 h-8 ${isActive ? "text-white" : "text-gray-400"}`} />
                )}
              </div>
              <div className="flex-1">
                <h3 className={`text-xl font-semibold ${isActive ? "text-[#1A365D]" : isCompleteStage ? "text-green-700" : "text-gray-400"}`}>
                  {stage.label}
                </h3>
                {isActive && <p className="text-sm text-gray-600 mt-1">Processing in progress...</p>}
                {isCompleteStage && <p className="text-sm text-green-600 mt-1">Complete</p>}
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="mb-4 text-sm text-red-700">
            Your uploaded files are still selected in this session. You can retry processing now.
          </p>
          <Button
            type="button"
            onClick={() => setRetryAttempt((attempt) => attempt + 1)}
            disabled={isStarting}
            className="bg-[#1A365D] text-white hover:bg-[#142A49]"
          >
            {isStarting ? "Retrying..." : "Retry Processing"}
          </Button>
        </div>
      )}
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Building;
  value: number | string;
  label: string;
  color: "blue" | "purple" | "green";
}) {
  const colorClasses = {
    blue: "from-blue-50 to-blue-100 border-blue-200 text-blue-700 bg-blue-500",
    purple: "from-purple-50 to-purple-100 border-purple-200 text-purple-700 bg-purple-500",
    green: "from-green-50 to-green-100 border-green-200 text-green-700 bg-green-500",
  }[color];
  const [gradientClasses, textClass, bgClass] = splitColorClasses(colorClasses);

  return (
    <div className={`bg-gradient-to-br ${gradientClasses} rounded-2xl p-8 shadow-xl border-2 transform hover:scale-105 transition-all`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 ${bgClass} rounded-xl flex items-center justify-center shadow-lg`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
        <Sparkles className={`w-6 h-6 ${textClass}`} />
      </div>
      <div className={`text-5xl font-bold ${textClass} mb-2`}>{value}</div>
      <div className={`${textClass} font-semibold text-lg`}>{label}</div>
    </div>
  );
}

function ReviewTable({
  rows,
  onChange,
}: {
  rows: ProcessingPreviewRow[];
  onChange: (rows: ProcessingPreviewRow[]) => void;
}) {
  const updateRow = (index: number, changes: Partial<ProcessingPreviewRow>) => {
    const nextRows = rows.map((row, rowIndex) => {
      if (rowIndex !== index) return row;
      const updated = { ...row, ...changes };
      const balance = Number(updated.balance || 0);
      return {
        ...updated,
        balance,
        status: balance <= 0 ? "paid" : "pending",
      };
    });
    onChange(nextRows);
  };

  return (
    <table className="w-full table-fixed">
      <thead>
        <tr className="border-b-2 border-gray-200">
          <th className="text-left py-3 px-3 font-semibold text-[#1A365D]">Unit</th>
          <th className="text-left py-3 px-3 font-semibold text-[#1A365D]">Owner</th>
          <th className="text-left py-3 px-3 font-semibold text-[#1A365D]">Balance</th>
          <th className="text-center py-3 px-3 font-semibold text-[#1A365D]">Status</th>
          <th className="w-12 py-3 px-2" />
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={`${row.unit}-${index}`} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="py-3 px-3">
              <input
                value={row.unit}
                onChange={(event) => updateRow(index, { unit: event.target.value })}
                className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
              />
            </td>
            <td className="py-3 px-3">
              <input
                value={row.owner}
                onChange={(event) => updateRow(index, { owner: event.target.value })}
                className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
              />
            </td>
            <td className="py-3 px-3">
              <input
                type="number"
                min="0"
                value={row.balance}
                onChange={(event) => updateRow(index, { balance: Number(event.target.value || 0) })}
                className="w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
              />
            </td>
            <td className="py-3 px-3 text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                row.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {row.status === "paid" ? "Paid" : "Pending"}
              </span>
            </td>
            <td className="py-3 px-2">
              <button
                type="button"
                onClick={() => onChange(rows.filter((_, rowIndex) => rowIndex !== index))}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                aria-label="Remove row"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getSummaryFromRows(rows: ProcessingPreviewRow[], documentsFound: number): ProcessingSummary {
  const normalizedRows = rows.filter((row) => row.unit || row.owner);
  const units = new Set(normalizedRows.map((row) => row.unit).filter(Boolean));
  const owners = new Set(normalizedRows.map((row) => row.owner).filter(Boolean));
  const totalBalances = normalizedRows.reduce((sum, row) => sum + Number(row.balance || 0), 0);
  const paidUnits = normalizedRows.filter((row) => Number(row.balance || 0) <= 0).length;

  return {
    unitsFound: units.size,
    ownersFound: owners.size,
    totalBalances,
    collectionRate: normalizedRows.length > 0 ? Math.round((paidUnits / normalizedRows.length) * 100) : 0,
    documentsFound,
    rowsProcessed: normalizedRows.length,
  };
}

function splitColorClasses(classes: string) {
  const parts = classes.split(" ");
  return [
    parts.slice(0, 3).join(" "),
    parts[3],
    parts[4],
  ];
}
