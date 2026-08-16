import { useState, useCallback } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Upload, FileSpreadsheet, FileText, Camera, Sparkles, ClipboardList, Plus, Trash2 } from "lucide-react";
import { hoaDocumentChecklist } from "../../config/hoaDocumentChecklist";
import { ManualSetupInput, ManualSetupRow, ManualSetupRules } from "../../types/onboarding";

interface Step2Props {
  isUploading?: boolean;
  isSavingManualSetup?: boolean;
  uploadError?: string | null;
  manualSetupError?: string | null;
  onNext: (files: File[]) => void | Promise<void>;
  onManualNext: (input: ManualSetupInput) => void | Promise<void>;
}

type SetupMode = "upload" | "manual";

const emptyManualRow: ManualSetupRow = {
  unit: "",
  owner: "",
  balance: 0,
};

const emptyRules: ManualSetupRules = {
  pets: "",
  quietHours: "",
  parking: "",
  reservations: "",
  maintenance: "",
  payments: "",
  additional: "",
};

export function Step2Upload({
  isUploading = false,
  isSavingManualSetup = false,
  uploadError,
  manualSetupError,
  onNext,
  onManualNext,
}: Step2Props) {
  const [setupMode, setSetupMode] = useState<SetupMode>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [manualRows, setManualRows] = useState<ManualSetupRow[]>([
    { unit: "101", owner: "", balance: 0 },
    { unit: "102", owner: "", balance: 0 },
    { unit: "103", owner: "", balance: 0 },
  ]);
  const [rules, setRules] = useState<ManualSetupRules>({
    ...emptyRules,
    pets: "Residents may keep domestic pets if they do not disturb neighbors. Dogs must remain on leash in common areas.",
    quietHours: "Quiet hours are from 10:00 PM to 7:00 AM Sunday through Thursday and 11:00 PM to 8:00 AM Friday and Saturday.",
    maintenance: "Residents should report leaks, elevator issues, lighting failures, and security concerns to the administrator.",
    payments: "Monthly assessments are due on the first day of each month. Late payments should be reviewed by administration.",
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles(files);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles(files);
    }
  }, []);

  const handleSubmit = () => {
    if (uploadedFiles.length > 0) {
      onNext(uploadedFiles);
    }
  };

  const handleManualSubmit = () => {
    onManualNext({
      rows: manualRows
        .map((row) => ({
          unit: row.unit.trim(),
          owner: row.owner.trim(),
          balance: Number(row.balance) || 0,
        }))
        .filter((row) => row.unit || row.owner),
      rules,
    });
  };

  const updateManualRow = (index: number, changes: Partial<ManualSetupRow>) => {
    setManualRows((rows) => rows.map((row, rowIndex) => (
      rowIndex === index ? { ...row, ...changes } : row
    )));
  };

  const removeManualRow = (index: number) => {
    setManualRows((rows) => rows.length > 1 ? rows.filter((_, rowIndex) => rowIndex !== index) : rows);
  };

  const addManualRow = () => {
    setManualRows((rows) => [...rows, { ...emptyManualRow }]);
  };

  const hasManualRows = manualRows.some((row) => row.unit.trim() || row.owner.trim());
  const hasManualRules = Object.values(rules).some((value) => value.trim());

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#00A3BF] to-[#1A365D] rounded-2xl mb-6 shadow-xl relative">
          <Sparkles className="w-10 h-10 text-white" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-[#1A365D] mb-4">
          Choose Your Setup Path
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Start from existing files or create the first version manually for a brand-new community.
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setSetupMode("upload")}
          className={`rounded-2xl border-2 bg-white p-6 text-left shadow-md transition-all ${
            setupMode === "upload"
              ? "border-[#00A3BF] ring-4 ring-[#00A3BF]/10"
              : "border-gray-100 hover:border-[#00A3BF]/50"
          }`}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#00A3BF]/10">
            <Upload className="h-6 w-6 text-[#00A3BF]" />
          </div>
          <h2 className="text-xl font-bold text-[#1A365D]">Upload existing files</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Use CSV, Excel, PDF, or photos when the association already has records or regulations.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setSetupMode("manual")}
          className={`rounded-2xl border-2 bg-white p-6 text-left shadow-md transition-all ${
            setupMode === "manual"
              ? "border-[#00A3BF] ring-4 ring-[#00A3BF]/10"
              : "border-gray-100 hover:border-[#00A3BF]/50"
          }`}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1A365D]/10">
            <ClipboardList className="h-6 w-6 text-[#1A365D]" />
          </div>
          <h2 className="text-xl font-bold text-[#1A365D]">Manual setup</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Create units, owner balances, and starter rules without uploading any documents.
          </p>
        </button>
      </div>

      {setupMode === "manual" ? (
        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-bold text-[#1A365D]">Units and Owners</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Add the first active units. Balances can stay at zero for a new condominium.
                </p>
              </div>
              <button
                type="button"
                onClick={addManualRow}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#00A3BF] px-4 py-2 text-sm font-semibold text-[#00A3BF] hover:bg-[#00A3BF]/10"
              >
                <Plus className="h-4 w-4" />
                Add Unit
              </button>
            </div>

            <div className="space-y-4">
              {manualRows.map((row, index) => (
                <div key={index} className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-[1fr_2fr_1fr_auto] md:items-end">
                  <div>
                    <Label htmlFor={`manual-unit-${index}`} className="mb-2 block text-sm font-medium text-gray-700">
                      Unit
                    </Label>
                    <Input
                      id={`manual-unit-${index}`}
                      value={row.unit}
                      onChange={(event) => updateManualRow(index, { unit: event.target.value })}
                      placeholder="101"
                      className="h-11 bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`manual-owner-${index}`} className="mb-2 block text-sm font-medium text-gray-700">
                      Owner or Resident
                    </Label>
                    <Input
                      id={`manual-owner-${index}`}
                      value={row.owner}
                      onChange={(event) => updateManualRow(index, { owner: event.target.value })}
                      placeholder="Owner name"
                      className="h-11 bg-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`manual-balance-${index}`} className="mb-2 block text-sm font-medium text-gray-700">
                      Opening Balance
                    </Label>
                    <Input
                      id={`manual-balance-${index}`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={row.balance}
                      onChange={(event) => updateManualRow(index, { balance: Number(event.target.value) || 0 })}
                      className="h-11 bg-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeManualRow(index)}
                    disabled={manualRows.length === 1}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 bg-white text-gray-500 hover:border-red-300 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Remove unit row"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
            <h3 className="text-xl font-bold text-[#1A365D]">Starter Rules for the AI Agent</h3>
            <p className="mt-1 text-sm text-gray-600">
              These notes become the initial knowledge source until formal documents are uploaded later.
            </p>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <RuleTextArea label="Pets" value={rules.pets} onChange={(value) => setRules({ ...rules, pets: value })} />
              <RuleTextArea label="Quiet Hours" value={rules.quietHours} onChange={(value) => setRules({ ...rules, quietHours: value })} />
              <RuleTextArea label="Parking" value={rules.parking} onChange={(value) => setRules({ ...rules, parking: value })} />
              <RuleTextArea label="Reservations" value={rules.reservations} onChange={(value) => setRules({ ...rules, reservations: value })} />
              <RuleTextArea label="Maintenance" value={rules.maintenance} onChange={(value) => setRules({ ...rules, maintenance: value })} />
              <RuleTextArea label="Payments" value={rules.payments} onChange={(value) => setRules({ ...rules, payments: value })} />
              <div className="md:col-span-2">
                <RuleTextArea label="Additional Notes" value={rules.additional} onChange={(value) => setRules({ ...rules, additional: value })} />
              </div>
            </div>
          </div>

          <div>
            {manualSetupError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {manualSetupError}
              </div>
            )}

            <Button
              onClick={handleManualSubmit}
              disabled={!hasManualRows || !hasManualRules || isSavingManualSetup}
              size="lg"
              className="h-14 w-full bg-gradient-to-r from-[#00A3BF] to-[#1A365D] text-lg font-semibold text-white shadow-xl hover:from-[#00A3BF]/90 hover:to-[#1A365D]/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ClipboardList className="mr-2 h-5 w-5" />
              {isSavingManualSetup ? "Saving Manual Setup..." : "Save Manual Setup and Open Dashboard"}
            </Button>
          </div>
        </div>
      ) : (
        <>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-4 border-dashed rounded-3xl p-16 transition-all duration-300 ${
          isDragging
            ? 'border-[#00A3BF] bg-[#00A3BF]/5 scale-[1.02]'
            : uploadedFiles.length > 0
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 bg-white hover:border-[#00A3BF]/50 hover:bg-gray-50'
        }`}
      >
        {/* Floating File Icons Animation */}
        {!uploadedFiles.length && (
          <>
            <div className="absolute top-12 left-1/4 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center shadow-lg transform -rotate-12">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="absolute top-20 right-1/4 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3s' }}>
              <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center shadow-lg transform rotate-12">
                <FileText className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </>
        )}

        <div className="text-center relative z-10">
          {uploadedFiles.length === 0 ? (
            <>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#00A3BF]/10 to-[#1A365D]/10 rounded-2xl mb-6">
                <Upload className="w-12 h-12 text-[#00A3BF]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A365D] mb-3">
                Drag & Drop Your Files Here
              </h3>
              <p className="text-gray-600 mb-6 text-lg">
                CSV/Excel spreadsheets, PDFs, or images - we accept them all
              </p>
              
              <div className="flex flex-col items-center gap-4">
                <label htmlFor="file-upload">
                  <div className="cursor-pointer inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#00A3BF] text-[#00A3BF] rounded-xl font-semibold hover:bg-[#00A3BF] hover:text-white transition-all shadow-lg hover:shadow-xl">
                    <Upload className="w-5 h-5" />
                    Browse Files
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".csv,.xlsx,.xls,.pdf,.jpg,.jpeg,.png"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>

                <div className="flex items-center gap-4 my-2">
                  <div className="h-px w-16 bg-gray-300"></div>
                  <span className="text-gray-500 font-medium">OR</span>
                  <div className="h-px w-16 bg-gray-300"></div>
                </div>

                <label htmlFor="photo-upload">
                  <div className="cursor-pointer inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1A365D] to-[#00A3BF] text-white rounded-xl font-semibold hover:shadow-xl transition-all">
                    <Camera className="w-5 h-5" />
                    Take a Photo of Paper List
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-2xl mb-6">
                <svg className="w-12 h-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-green-700 mb-3">
                Files Ready for Processing
              </h3>
              <div className="space-y-2 mb-6">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-xl shadow-md border border-green-200">
                    {file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? (
                      <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    ) : file.type.includes('pdf') ? (
                      <FileText className="w-6 h-6 text-red-600" />
                    ) : (
                      <Camera className="w-6 h-6 text-blue-600" />
                    )}
                    <span className="font-medium text-gray-700">{file.name}</span>
                    <span className="text-sm text-gray-500">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setUploadedFiles([])}
                disabled={isUploading}
                className="text-[#00A3BF] hover:text-[#1A365D] font-medium underline"
              >
                Upload Different Files
              </button>
            </>
          )}
        </div>
      </div>

      {/* Helper Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
          </div>
          <h4 className="font-semibold text-[#1A365D] mb-2">CSV and Excel Files</h4>
          <p className="text-sm text-gray-600">Unit lists, owner rosters, payment records</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-red-600" />
          </div>
          <h4 className="font-semibold text-[#1A365D] mb-2">PDF Documents</h4>
          <p className="text-sm text-gray-600">Building bylaws, financial reports, contracts</p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <Camera className="w-6 h-6 text-purple-600" />
          </div>
          <h4 className="font-semibold text-[#1A365D] mb-2">Photos</h4>
          <p className="text-sm text-gray-600">Handwritten lists, printed documents</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#1A365D]">Common HOA Documents We Can Receive</h3>
            <p className="mt-1 text-sm text-gray-600">
              For US HOA/COA onboarding, administrators often upload some mix of these records.
            </p>
          </div>
          <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100">
            <FileText className="h-5 w-5 text-red-600" />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {hoaDocumentChecklist.map((category) => (
            <div key={category.title} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h4 className="font-semibold text-[#1A365D]">{category.title}</h4>
              <p className="mt-1 text-xs leading-5 text-gray-600">{category.description}</p>
              <ul className="mt-3 space-y-1.5">
                {category.documents.slice(0, 4).map((document) => (
                  <li key={document} className="flex gap-2 text-sm text-gray-700">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00A3BF]" />
                    <span>{document}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-12">
        {uploadError && (
          <div className="mb-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between">
            <span>{uploadError}</span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploadedFiles.length === 0 || isUploading}
              className="rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploading ? "Retrying..." : "Retry Upload"}
            </button>
          </div>
        )}

        <Button
          onClick={handleSubmit}
          disabled={uploadedFiles.length === 0 || isUploading}
          size="lg"
          className="w-full h-14 bg-gradient-to-r from-[#00A3BF] to-[#1A365D] hover:from-[#00A3BF]/90 hover:to-[#1A365D]/90 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          {isUploading ? "Uploading Files..." : "Upload and Process with AI"}
          {!isUploading && (
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          )}
        </Button>
      </div>
        </>
      )}
    </div>
  );
}

interface RuleTextAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function RuleTextArea({ label, value, onChange }: RuleTextAreaProps) {
  const id = `rule-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <Label htmlFor={id} className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </Label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 outline-none transition-all placeholder:text-gray-400 focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20"
        placeholder={`Add ${label.toLowerCase()} guidance`}
      />
    </div>
  );
}
