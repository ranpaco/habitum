import { useState } from "react";
import { RequestDemo } from "./RequestDemo";
import { DemoSuccess } from "./DemoSuccess";
import { useRegion } from "../context/RegionContext";
import { createDemoRequest } from "../services/demoRequests";
import { DemoRequestFormData, DemoRequestSubmission } from "../types/demo";

export function DemoFlow() {
  const { region } = useRegion();
  const [formData, setFormData] = useState<DemoRequestSubmission | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (data: DemoRequestFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const result = await createDemoRequest({ ...data, region });
      setFormData({ ...data, ...result });
    } catch (error) {
      console.error(error);
      setSubmitError("We could not save your demo request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (formData) {
    return <DemoSuccess formData={formData} />;
  }

  return (
    <RequestDemo
      isSubmitting={isSubmitting}
      submitError={submitError}
      onSubmit={handleSubmit}
    />
  );
}
