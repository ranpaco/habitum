import { FormEvent, useEffect, useMemo, useState } from "react";
import { Bot, FileCheck2, FileClock, FileText, FileX2, Plus, Trash2 } from "lucide-react";
import { ApiError } from "../../services/apiClient";
import { AgentConfigurationInput, DashboardData, DashboardKnowledgeDocument } from "../../types/dashboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

interface ConfigureAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent: DashboardData["agent"];
  onSubmit: (configuration: AgentConfigurationInput) => Promise<void>;
}

export function ConfigureAgentDialog({
  open,
  onOpenChange,
  agent,
  onSubmit,
}: ConfigureAgentDialogProps) {
  const [rulesText, setRulesText] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const documents = agent.documents || [];
  const sourceCounts = useMemo(() => countSourceStatuses(documents), [documents]);

  useEffect(() => {
    if (!open) return;
    setRulesText(agent.manualRules || "");
    setQuestions(agent.suggestedQuestions.slice(0, 4));
    setError(null);
  }, [agent.manualRules, agent.suggestedQuestions, open]);

  const updateQuestion = (index: number, value: string) => {
    setQuestions((current) => current.map((question, questionIndex) => (
      questionIndex === index ? value : question
    )));
    setError(null);
  };

  const removeQuestion = (index: number) => {
    setQuestions((current) => current.filter((_, questionIndex) => questionIndex !== index));
    setError(null);
  };

  const submitConfiguration = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const normalizedQuestions = questions.map((question) => question.trim()).filter(Boolean);
    const uniqueQuestions = new Set(normalizedQuestions.map((question) => question.toLocaleLowerCase()));

    if (uniqueQuestions.size !== normalizedQuestions.length) {
      setError("Suggested questions must be unique.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ rulesText: rulesText.trim(), suggestedQuestions: normalizedQuestions });
      onOpenChange(false);
    } catch (submissionError) {
      setError(getAgentErrorMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isSubmitting && onOpenChange(nextOpen)}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
            <Bot className="h-6 w-6" />
          </div>
          <DialogTitle className="text-[#1A365D]">Configure agent</DialogTitle>
          <DialogDescription>
            Manage grounded knowledge, manual rules, and dashboard question shortcuts.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitConfiguration}>
          <Tabs defaultValue="sources" className="gap-5">
            <TabsList className="grid h-10 w-full grid-cols-2 rounded-lg bg-gray-100">
              <TabsTrigger value="sources" className="rounded-md">Knowledge sources</TabsTrigger>
              <TabsTrigger value="settings" className="rounded-md">Rules &amp; questions</TabsTrigger>
            </TabsList>

            <TabsContent value="sources" className="space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <SourceMetric label="Ready" value={sourceCounts.ready} tone="text-emerald-700" />
                <SourceMetric label="Pending" value={sourceCounts.pending} tone="text-amber-700" />
                <SourceMetric label="Failed" value={sourceCounts.failed} tone="text-red-700" />
              </div>

              {documents.length > 0 ? (
                <div className="space-y-2">
                  {documents.map((document) => <KnowledgeSource key={document.id} document={document} />)}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                  <FileText className="mx-auto h-7 w-7 text-gray-400" />
                  <p className="mt-3 font-semibold text-[#1A365D]">No knowledge sources</p>
                  <p className="mt-1 text-sm text-gray-600">Manual rules saved in the next tab will become the first source.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-5">
              <label className="block text-sm font-semibold text-[#1A365D]">
                Manual community rules
                <textarea
                  value={rulesText}
                  onChange={(event) => { setRulesText(event.target.value); setError(null); }}
                  disabled={isSubmitting}
                  maxLength={12000}
                  rows={8}
                  placeholder="Pets, quiet hours, parking, reservations, payments, maintenance..."
                  className="mt-2 w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-normal leading-6 outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
                />
                <span className="mt-1 block text-right text-xs font-normal text-gray-500">{rulesText.length}/12000</span>
              </label>

              <fieldset>
                <div className="flex items-center justify-between gap-3">
                  <legend className="text-sm font-semibold text-[#1A365D]">Suggested questions</legend>
                  <button
                    type="button"
                    onClick={() => setQuestions((current) => [...current, ""])}
                    disabled={isSubmitting || questions.length >= 4}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold text-[#1A365D] hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                    Add question
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  {questions.length === 0 && (
                    <p className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">No suggested questions configured.</p>
                  )}
                  {questions.map((question, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <label className="min-w-0 flex-1">
                        <span className="sr-only">Suggested question {index + 1}</span>
                        <input
                          value={question}
                          onChange={(event) => updateQuestion(index, event.target.value)}
                          disabled={isSubmitting}
                          maxLength={160}
                          placeholder={`Suggested question ${index + 1}`}
                          className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        disabled={isSubmitting}
                        aria-label={`Remove suggested question ${index + 1}`}
                        title="Remove question"
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </fieldset>
            </TabsContent>
          </Tabs>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </div>
          )}

          <DialogFooter className="mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-semibold text-[#1A365D] hover:bg-gray-50 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg bg-[#00A3BF] px-5 text-sm font-semibold text-white hover:bg-[#008CA3] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Save configuration"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SourceMetric({ label, value, tone }: { label: string; value: number; tone: string }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-3">
      <div className={`text-xl font-bold ${tone}`}>{value}</div>
      <div className="mt-0.5 text-xs text-gray-600">{label}</div>
    </div>
  );
}

function KnowledgeSource({ document }: { document: DashboardKnowledgeDocument }) {
  const status = document.status === "pending" ? "pending" : document.status === "failed" ? "failed" : "ready";
  const Icon = status === "ready" ? FileCheck2 : status === "pending" ? FileClock : FileX2;
  const styles = status === "ready"
    ? "bg-emerald-50 text-emerald-700"
    : status === "pending"
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-700";

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${styles}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#1A365D]">{document.name}</p>
          <p className="mt-0.5 text-xs text-gray-500">{formatKind(document.kind)} · {document.lineCount} lines</p>
        </div>
      </div>
      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles}`}>{status}</span>
    </div>
  );
}

function countSourceStatuses(documents: DashboardKnowledgeDocument[]) {
  return documents.reduce((counts, document) => {
    if (document.status === "pending") counts.pending += 1;
    else if (document.status === "failed") counts.failed += 1;
    else counts.ready += 1;
    return counts;
  }, { ready: 0, pending: 0, failed: 0 });
}

function formatKind(kind: string) {
  if (kind === "manual") return "Manual rules";
  if (kind === "pdf") return "PDF document";
  if (kind === "image") return "Image document";
  return kind.charAt(0).toUpperCase() + kind.slice(1);
}

function getAgentErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return "We could not save the agent configuration. Please try again.";
  if (error.message === "duplicate_agent_questions") return "Suggested questions must be unique.";
  if (error.message === "agent_configuration_conflict") {
    return "Another dashboard update was saved first. Refresh before saving the agent configuration.";
  }
  if (error.status === 404) return "The community could not be found. Refresh the dashboard and try again.";
  return "We could not save the agent configuration. Review the fields and try again.";
}
