import { useState } from "react";
import { ProgressIndicator } from "./ProgressIndicator";
import { Step1AccountSetup } from "./Step1AccountSetup";
import { Step2Upload } from "./Step2Upload";
import { Step3Processing } from "./Step3Processing";
import { ArrowLeft } from "lucide-react";
import { useRegion } from "../../context/RegionContext";
import { completeOnboardingAccount, createOnboardingSession, uploadOnboardingFiles } from "../../services/onboarding";
import { OnboardingAccountFormData } from "../../types/onboarding";

const SESSION_STORAGE_KEY = "habitum.onboardingSessionId";
const COMMUNITY_STORAGE_KEY = "habitum.communityId";

export function OnboardingFlow() {
  const { region } = useRegion();
  const [currentStep, setCurrentStep] = useState(1);
  const [sessionId, setSessionId] = useState(() => sessionStorage.getItem(SESSION_STORAGE_KEY));
  const [communityId, setCommunityId] = useState(() => sessionStorage.getItem(COMMUNITY_STORAGE_KEY));
  const [isSubmittingAccount, setIsSubmittingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleStep1Complete = async (data: OnboardingAccountFormData) => {
    setIsSubmittingAccount(true);
    setAccountError(null);

    try {
      let activeSessionId = sessionId;

      if (!activeSessionId) {
        const session = await createOnboardingSession({
          source: "onboarding_cta",
          region,
        });
        activeSessionId = session.sessionId;
        setSessionId(activeSessionId);
        sessionStorage.setItem(SESSION_STORAGE_KEY, activeSessionId);
      }

      const account = await completeOnboardingAccount(activeSessionId, data);
      setCommunityId(account.communityId);
      sessionStorage.setItem(COMMUNITY_STORAGE_KEY, account.communityId);
      setCurrentStep(2);
    } catch (error) {
      console.error(error);
      setAccountError("We could not create your demo workspace. Please try again.");
    } finally {
      setIsSubmittingAccount(false);
    }
  };

  const handleStep2Complete = async (files: File[]) => {
    if (!sessionId) {
      setUploadError("The onboarding session is missing. Please go back and create the workspace again.");
      return;
    }

    setIsUploadingFiles(true);
    setUploadError(null);

    try {
      await uploadOnboardingFiles(sessionId, files);
      setCurrentStep(3);
    } catch (error) {
      console.error(error);
      setUploadError("We could not upload your files. Please check the file type and try again.");
    } finally {
      setIsUploadingFiles(false);
    }
  };

  const handleOnboardingComplete = () => {
    window.location.href = communityId ? `#dashboard?communityId=${communityId}` : "#dashboard";
  };

  const handleBack = () => {
    if (currentStep > 1 && currentStep < 3) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              {currentStep > 1 && currentStep < 3 && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-[#1A365D] hover:text-[#00A3BF] transition-colors font-medium"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="text-3xl font-bold bg-gradient-to-r from-[#00A3BF] to-[#1A365D] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                Habitum
              </a>
            </div>
          </div>

          <ProgressIndicator currentStep={currentStep} totalSteps={3} />
        </div>

        {/* Step Content */}
        <div className="animate-in fade-in duration-500">
          {currentStep === 1 && (
            <Step1AccountSetup
              isSubmitting={isSubmittingAccount}
              submitError={accountError}
              onNext={handleStep1Complete}
            />
          )}
          {currentStep === 2 && (
            <Step2Upload
              isUploading={isUploadingFiles}
              uploadError={uploadError}
              onNext={handleStep2Complete}
            />
          )}
          {currentStep === 3 && (
            <Step3Processing sessionId={sessionId} onComplete={handleOnboardingComplete} />
          )}
        </div>
      </div>
    </div>
  );
}
