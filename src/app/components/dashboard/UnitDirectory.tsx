import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown, ChevronRight, CircleDollarSign, Search, UserRound, X } from "lucide-react";
import { DashboardBalanceStatus, DashboardUnit } from "../../types/dashboard";

interface UnitDirectoryProps {
  units: DashboardUnit[];
  defaultCurrency: string;
}

type UnitSort = "unit" | "owner" | "balance-desc" | "balance-asc";

const statusOptions: Array<{ value: "all" | DashboardBalanceStatus; label: string }> = [
  { value: "all", label: "All" },
  { value: "current", label: "Current" },
  { value: "pending", label: "Pending" },
  { value: "overdue", label: "Overdue" },
];

export function UnitDirectory({ units, defaultCurrency }: UnitDirectoryProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | DashboardBalanceStatus>("all");
  const [sort, setSort] = useState<UnitSort>("unit");
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const filteredUnits = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return units
      .filter((unit) => {
        const matchesQuery = !normalizedQuery
          || unit.unit.toLocaleLowerCase().includes(normalizedQuery)
          || unit.owner.toLocaleLowerCase().includes(normalizedQuery);
        const matchesStatus = statusFilter === "all" || unit.status === statusFilter;
        return matchesQuery && matchesStatus;
      })
      .sort((left, right) => {
        if (sort === "owner") return left.owner.localeCompare(right.owner);
        if (sort === "balance-desc") return right.balance - left.balance;
        if (sort === "balance-asc") return left.balance - right.balance;
        return left.unit.localeCompare(right.unit, undefined, { numeric: true });
      });
  }, [query, sort, statusFilter, units]);

  const selectedUnit = units.find((unit) => unit.id === selectedUnitId) || null;

  useEffect(() => {
    if (selectedUnitId && !units.some((unit) => unit.id === selectedUnitId)) {
      setSelectedUnitId(null);
    }
  }, [selectedUnitId, units]);

  return (
    <section className="mb-8 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm" aria-labelledby="unit-directory-title">
      <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="unit-directory-title" className="text-xl font-bold text-[#1A365D]">Units &amp; owners</h2>
            <p className="mt-1 text-sm text-gray-600">{filteredUnits.length} of {units.length} units</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block min-w-0 sm:w-64">
              <span className="sr-only">Search units or owners</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search unit or owner"
                className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
              />
            </label>

            <label className="relative block sm:w-48">
              <span className="sr-only">Sort units</span>
              <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as UnitSort)}
                className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white pl-9 pr-8 text-sm text-gray-700 outline-none focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
              >
                <option value="unit">Sort by unit</option>
                <option value="owner">Sort by owner</option>
                <option value="balance-desc">Highest balance</option>
                <option value="balance-asc">Lowest balance</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter units by balance status">
          {statusOptions.map((option) => {
            const count = option.value === "all" ? units.length : units.filter((unit) => unit.status === option.value).length;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatusFilter(option.value)}
                aria-pressed={statusFilter === option.value}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  statusFilter === option.value
                    ? "bg-[#1A365D] text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-[#00A3BF] hover:text-[#1A365D]"
                }`}
              >
                {option.label} {count}
              </button>
            );
          })}
        </div>
      </div>

      {filteredUnits.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <Search className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-3 font-semibold text-[#1A365D]">No matching units</p>
          <p className="mt-1 text-sm text-gray-500">Adjust the search or balance filter.</p>
          <button
            type="button"
            onClick={() => { setQuery(""); setStatusFilter("all"); }}
            className="mt-4 text-sm font-semibold text-[#00A3BF] hover:text-[#008CA3]"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full table-fixed text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="w-[18%] px-6 py-3 font-semibold">Unit</th>
                  <th className="w-[30%] px-6 py-3 font-semibold">Owner / resident</th>
                  <th className="w-[20%] px-6 py-3 font-semibold">Balance</th>
                  <th className="w-[20%] px-6 py-3 font-semibold">Status</th>
                  <th className="w-[12%] px-6 py-3"><span className="sr-only">Open detail</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUnits.map((unit) => (
                  <tr key={unit.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-[#1A365D]">{unit.unit}</td>
                    <td className="truncate px-6 py-4 text-gray-700">{unit.owner}</td>
                    <td className="px-6 py-4 font-semibold text-gray-800">{formatMoney(unit.balance, unit.currency || defaultCurrency)}</td>
                    <td className="px-6 py-4"><StatusBadge status={unit.status} /></td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedUnitId(unit.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-[#00A3BF]/10 hover:text-[#00A3BF]"
                        aria-label={`Open ${unit.unit} details`}
                        title="Open unit details"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-gray-100 md:hidden">
            {filteredUnits.map((unit) => (
              <button
                key={unit.id}
                type="button"
                onClick={() => setSelectedUnitId(unit.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1A365D]">{unit.unit}</span>
                    <StatusBadge status={unit.status} />
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-600">{unit.owner}</p>
                  <p className="mt-1 text-sm font-semibold text-gray-800">{formatMoney(unit.balance, unit.currency || defaultCurrency)}</p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-gray-400" />
              </button>
            ))}
          </div>
        </>
      )}

      {selectedUnit && (
        <div className="border-t border-[#00A3BF]/20 bg-[#F4FBFC] px-5 py-5 sm:px-6" role="region" aria-label={`${selectedUnit.unit} detail`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-[#1A365D]">{selectedUnit.unit}</h3>
                <StatusBadge status={selectedUnit.status} />
              </div>
              <p className="mt-1 text-sm text-gray-600">Last activity {formatDate(selectedUnit.lastActivityAt)}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedUnitId(null)}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-white hover:text-[#1A365D]"
              aria-label="Close unit details"
              title="Close details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500"><UserRound className="h-4 w-4" /> Owner / resident</dt>
              <dd className="mt-1 text-sm font-semibold text-[#1A365D]">{selectedUnit.owner}</dd>
              {selectedUnit.contact && <dd className="mt-1 text-sm text-gray-600">{selectedUnit.contact}</dd>}
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase text-gray-500"><CircleDollarSign className="h-4 w-4" /> Current balance</dt>
              <dd className="mt-1 text-lg font-bold text-[#1A365D]">{formatMoney(selectedUnit.balance, selectedUnit.currency || defaultCurrency)}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase text-gray-500">Administrative notes</dt>
              <dd className="mt-1 text-sm text-gray-700">{selectedUnit.notes || "No notes recorded."}</dd>
            </div>
          </dl>
        </div>
      )}
    </section>
  );
}

function StatusBadge({ status }: { status: DashboardBalanceStatus }) {
  const styles = status === "current"
    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
    : status === "overdue"
      ? "bg-red-50 text-red-700 ring-red-600/20"
      : "bg-amber-50 text-amber-700 ring-amber-600/20";

  const label = status === "current" ? "Current" : status === "overdue" ? "Overdue" : "Pending";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles}`}>{label}</span>;
}

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value?: string) {
  if (!value) return "not available";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "not available";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}
