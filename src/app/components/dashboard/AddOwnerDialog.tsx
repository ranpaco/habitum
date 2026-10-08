import { FormEvent, useEffect, useState } from "react";
import { UserPlus } from "lucide-react";
import { ApiError } from "../../services/apiClient";
import { CreateOwnerInput, DashboardUnit } from "../../types/dashboard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

interface AddOwnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  units: DashboardUnit[];
  currency: string;
  onSubmit: (owner: CreateOwnerInput) => Promise<void>;
}

export function AddOwnerDialog({
  open,
  onOpenChange,
  units,
  currency,
  onSubmit,
}: AddOwnerDialogProps) {
  const [unit, setUnit] = useState("");
  const [owner, setOwner] = useState("");
  const [contact, setContact] = useState("");
  const [balance, setBalance] = useState("0");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setUnit("");
    setOwner("");
    setContact("");
    setBalance("0");
    setNotes("");
    setError(null);
  }, [open]);

  const submitOwner = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const trimmedUnit = unit.trim();
    const trimmedOwner = owner.trim();
    const numericBalance = Number(balance);

    if (!trimmedUnit || !trimmedOwner) {
      setError("Unit and owner name are required.");
      return;
    }

    if (units.some((existingUnit) => existingUnit.unit.trim().toLocaleLowerCase() === trimmedUnit.toLocaleLowerCase())) {
      setError("This unit already exists in the community.");
      return;
    }

    if (!Number.isFinite(numericBalance) || numericBalance < 0) {
      setError("Initial balance must be zero or greater.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        unit: trimmedUnit,
        owner: trimmedOwner,
        contact: contact.trim() || undefined,
        balance: numericBalance,
        currency,
        notes: notes.trim() || undefined,
      });
      onOpenChange(false);
    } catch (submissionError) {
      setError(getOwnerErrorMessage(submissionError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !isSubmitting && onOpenChange(nextOpen)}>
      <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-cyan-100 text-cyan-700">
            <UserPlus className="h-6 w-6" />
          </div>
          <DialogTitle className="text-[#1A365D]">Add owner &amp; unit</DialogTitle>
          <DialogDescription>
            Add a community member and make the unit available for dashboard operations.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitOwner} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#1A365D]">
              Unit
              <input
                value={unit}
                onChange={(event) => { setUnit(event.target.value); setError(null); }}
                disabled={isSubmitting}
                maxLength={50}
                placeholder="A-101"
                autoFocus
                required
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
              />
            </label>

            <label className="block text-sm font-semibold text-[#1A365D]">
              Owner / resident
              <input
                value={owner}
                onChange={(event) => { setOwner(event.target.value); setError(null); }}
                disabled={isSubmitting}
                maxLength={120}
                placeholder="Full name"
                required
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#1A365D]">
              Contact <span className="font-normal text-gray-500">(optional)</span>
              <input
                value={contact}
                onChange={(event) => { setContact(event.target.value); setError(null); }}
                disabled={isSubmitting}
                maxLength={160}
                placeholder="Email or phone"
                className="mt-2 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm font-normal outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
              />
            </label>

            <label className="block text-sm font-semibold text-[#1A365D]">
              Initial balance
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">{currency}</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={balance}
                  onChange={(event) => { setBalance(event.target.value); setError(null); }}
                  disabled={isSubmitting}
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-14 pr-3 text-sm font-normal outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
                />
              </div>
            </label>
          </div>

          <label className="block text-sm font-semibold text-[#1A365D]">
            Administrative notes <span className="font-normal text-gray-500">(optional)</span>
            <textarea
              value={notes}
              onChange={(event) => { setNotes(event.target.value); setError(null); }}
              disabled={isSubmitting}
              maxLength={500}
              rows={3}
              placeholder="Move-in context or internal follow-up"
              className="mt-2 w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
            />
          </label>

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
              {isSubmitting ? "Adding..." : "Add owner"}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function getOwnerErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) return "We could not add the owner. Please try again.";
  if (error.message === "unit_already_exists") return "This unit already exists in the community.";
  if (error.message === "unit_create_conflict") {
    return "Another dashboard update was saved first. Refresh and verify the unit list before trying again.";
  }
  if (error.status === 404) return "The community could not be found. Refresh the dashboard and try again.";
  return "We could not add the owner. Review the fields and try again.";
}
