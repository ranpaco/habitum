import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Building2, Mail, Lock, Globe, DollarSign } from "lucide-react";
import { OnboardingAccountFormData } from "../../types/onboarding";

interface Step1Props {
  isSubmitting?: boolean;
  submitError?: string | null;
  onNext: (data: OnboardingAccountFormData) => void;
}

export function Step1AccountSetup({ isSubmitting = false, submitError, onNext }: Step1Props) {
  const [formData, setFormData] = useState<OnboardingAccountFormData>({
    email: "",
    password: "",
    condoName: "",
    country: "Venezuela",
    baseCurrency: "USD"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#00A3BF] to-[#1A365D] rounded-2xl mb-6 shadow-xl">
          <Building2 className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-[#1A365D] mb-4">
          Welcome to Habitum
        </h1>
        <p className="text-xl text-gray-600">
          Let's set up your account and condominium in seconds
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {submitError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Account Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-[#1A365D] mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00A3BF]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#00A3BF] font-bold">1</span>
            </div>
            Create Your Account
          </h2>
          
          <div className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#00A3BF]" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@yourcondominium.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="h-12 border-gray-300 focus:border-[#00A3BF] focus:ring-[#00A3BF]"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#00A3BF]" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={8}
                className="h-12 border-gray-300 focus:border-[#00A3BF] focus:ring-[#00A3BF]"
              />
            </div>
          </div>
        </div>

        {/* Condo Setup Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h2 className="text-2xl font-semibold text-[#1A365D] mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#00A3BF]/10 rounded-lg flex items-center justify-center">
              <span className="text-[#00A3BF] font-bold">2</span>
            </div>
            Condominium Details
          </h2>
          
          <div className="space-y-5">
            <div>
              <Label htmlFor="condoName" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00A3BF]" />
                Condominium Name
              </Label>
              <Input
                id="condoName"
                type="text"
                placeholder="e.g., Torre Vista Hermosa"
                value={formData.condoName}
                onChange={(e) => setFormData({ ...formData, condoName: e.target.value })}
                required
                className="h-12 border-gray-300 focus:border-[#00A3BF] focus:ring-[#00A3BF]"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="country" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#00A3BF]" />
                  Country
                </Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  required
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20 outline-none transition-all"
                >
                  <option value="Venezuela">Venezuela</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chile">Chile</option>
                  <option value="Peru">Peru</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Mexico">Mexico</option>
                  <option value="United States">United States</option>
                </select>
              </div>

              <div>
                <Label htmlFor="baseCurrency" className="text-gray-700 font-medium mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-[#00A3BF]" />
                  Base Currency
                </Label>
                <select
                  id="baseCurrency"
                  value={formData.baseCurrency}
                  onChange={(e) => setFormData({ ...formData, baseCurrency: e.target.value })}
                  required
                  className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20 outline-none transition-all"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="VES">VES - Bolívar</option>
                  <option value="COP">COP - Colombian Peso</option>
                  <option value="ARS">ARS - Argentine Peso</option>
                  <option value="CLP">CLP - Chilean Peso</option>
                  <option value="PEN">PEN - Peruvian Sol</option>
                  <option value="MXN">MXN - Mexican Peso</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="w-full h-14 bg-gradient-to-r from-[#00A3BF] to-[#1A365D] hover:from-[#00A3BF]/90 hover:to-[#1A365D]/90 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            {isSubmitting ? "Creating Workspace..." : "Continue to Setup"}
            {!isSubmitting && (
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500">
          By continuing, you agree to Habitum's Terms of Service and Privacy Policy
        </p>
      </form>
    </div>
  );
}
