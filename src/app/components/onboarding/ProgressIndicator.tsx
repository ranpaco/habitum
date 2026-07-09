interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="w-full max-w-md mx-auto mb-12">
      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00A3BF] to-[#1A365D] transition-all duration-500 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <div key={step} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step < currentStep 
                  ? 'bg-[#00A3BF] text-white' 
                  : step === currentStep
                  ? 'bg-gradient-to-r from-[#00A3BF] to-[#1A365D] text-white shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {step < currentStep ? '✓' : step}
            </div>
            <span className={`text-xs mt-2 ${step === currentStep ? 'text-[#1A365D] font-semibold' : 'text-gray-400'}`}>
              Step {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
