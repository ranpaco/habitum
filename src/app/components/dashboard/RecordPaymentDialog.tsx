import { FormEvent, useEffect, useMemo, useState } from "react";
import { CheckCircle2, DollarSign } from "lucide-react";
import { ApiError } from "../../services/apiClient";
import { DashboardUnit, RecordPaymentInput } from "../../types/dashboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  units: DashboardUnit[];
  currency: string;
  onSubmit: (payment: RecordPaymentInput) => Promise<void>;
}

const paymentMethods: Array<{ value: RecordPaymentInput["method"]; label: string }> = [
  { value: "bank_transfer", label: "Bank transfer" },
  { value: "cash", label: "Cash" },
  { value: "card", label: "Card" },
  { value: "check", label: "Check" },
  { value: "zelle", label: "Zelle" },
  { value: "other", label: "Other" },
];

export function RecordPaymentDialog({
  open,
  onOpenChange,
  units,
  currency,
  onSubmit,
}: RecordPaymentDialogProps) {
  const payableUnits = useMemo(() => units.filter((unit) => unit.balance > 0), [units]);
  const [unitName, setUnitName] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<RecordPaymentInput["method"]>("bank_transfer");
  const [paidAt, setPaidAt] = useState(getLocalDateInput());
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedUnit = payableUnits.find((unit) => unit.unit === unitName);
  const numericAmount = Number(amount);
  const balanceAfterPayment = selectedUnit && Number.isFinite(numericAmount)
    ? Math.max(0, selectedUnit.balance - numericAmount)
    : selectedUnit?.balance;

  useEffect(() => {
    if (!open) return;
    const firstUnit = payableUnits[0];
    setUnitName(firstUnit?.unit || "");
    setAmount(firstUnit ? String(firstUnit.balance) : "");
    setMethod("bank_transfer");
    setPaidAt(getLocalDateInput());
    setReference("");
    setError(null);
  }, [open, payableUnits]);

  const selectUnit = (nextUnitName: string) => {
    const nextUnit = payableUnits.find((unit) => unit.unit === nextUnitName);
    setUnitName(nextUnitName);
    setAmount(nextUnit ? String(nextUnit.balance) : "");
    setError(null);
  };

  const submitPayment = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!selectedUnit) {
      setError("Select a unit with an outstanding balance.");
      return;
    }

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError("Enter a payment amount greater than zero.");
      return;
    }

    if (numericAmount > selectedUnit.balance) {
      setError(`The payment cannot exceed ${formatMoney(selectedUnit.balance, currency)}.`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        unit: selectedUnit.unit,
        amount: numericAmount,
        currency,
        method,
        paidAt,
        reference: reference.trim() || undefined,
      });
      onOpenChange(false);
    } catch (submissionError) {
      setError(getPaymentErrorMessage(submissionError, currency));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isSubmitting && onOpenChange(nextOpen)}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <DollarSign className="h-6 w-6" />
          </div>
          <DialogTitle className="text-[#1A365D]">Record payment</DialogTitle>
          <DialogDescription>
            Apply a manual payment and update the unit balance immediately.
          </DialogDescription>
        </DialogHeader>

        {payableUnits.length === 0 ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-5 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 className="h-5 w-5" />
              All listed units are current
            </div>
            <p className="mt-1">There are no outstanding balances available for payment.</p>
          </div>
        ) : (
          <form onSubmit={submitPayment} className="space-y-5">
            <label className="block text-sm font-semibold text-[#1A365D]">
              Unit
              <select
                value={unitName}
                onChange={(event) => selectUnit(event.target.value)}
                disabled={isSubmitting}
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
              >
                {payableUnits.map((unit) => (
                  <option key={unit.id} value={unit.unit}>
                    {unit.unit} · {unit.owner} · {formatMoney(unit.balance, currency)}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-[#1A365D]">
                Amount
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">{currency}</span>
                  <input
                    type="number"
                    min="0.01"
                    max={selectedUnit?.balance}
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    disabled={isSubmitting}
                    required
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-14 pr-3 text-sm font-normal outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
                  />
                </div>
              </label>

              <label className="block text-sm font-semibold text-[#1A365D]">
                Payment date
                <input
                  type="date"
                  value={paidAt}
                  onChange={(event) => setPaidAt(event.target.value)}
                  disabled={isSubmitting}
                  required
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-[#1A365D]">
                Method
                <select
                  value={method}
                  onChange={(event) => setMethod(event.target.value as RecordPaymentInput["method"])}
                  disabled={isSubmitting}
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
                >
                  {paymentMethods.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>

              <label className="block text-sm font-semibold text-[#1A365D]">
                Reference <span className="font-normal text-gray-500">(optional)</span>
                <input
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  disabled={isSubmitting}
                  maxLength={100}
                  placeholder="Receipt or transfer ID"
                  className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
                />
              </label>
            </div>

            {selectedUnit && (
              <dl className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 px-4 py-3 text-sm">
                <div>
                  <dt className="text-gray-500">Current balance</dt>
                  <dd className="mt-1 font-bold text-[#1A365D]">{formatMoney(selectedUnit.balance, currency)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Balance after payment</dt>
                  <dd className="mt-1 font-bold text-emerald-700">{formatMoney(balanceAfterPayment || 0, currency)}</dd>
                </div>
              </dl>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                {error}
              </div>
            )}

            <DialogFooter>
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
                {isSubmitting ? "Recording..." : "Record payment"}
              </button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

function getLocalDateInput() {
  const now = new Date();
  const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

function getPaymentErrorMessage(error: unknown, currency: string) {
  if (!(error instanceof ApiError)) return "We could not record the payment. Please try again.";
  if (error.message === "unit_balance_already_paid") return "This unit no longer has an outstanding balance.";
  if (error.message === "payment_conflict") {
    return "Another dashboard update was saved first. Refresh and verify the balance before trying again.";
  }
  if (error.message === "payment_exceeds_balance") {
    const balance = (error.details as { currentBalance?: number } | undefined)?.currentBalance;
    return typeof balance === "number"
      ? `The payment cannot exceed ${formatMoney(balance, currency)}.`
      : "The payment exceeds the current unit balance.";
  }
  if (error.status === 404) return "The selected unit could not be found. Refresh the dashboard and try again.";
  return "We could not record the payment. The dashboard data may have changed; refresh and try again.";
}
