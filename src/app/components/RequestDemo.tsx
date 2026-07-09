import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CheckCircle, Building2, Phone, Mail, User, Briefcase } from "lucide-react";
import { DemoRequestFormData } from "../types/demo";

const LATAM_COUNTRIES = [
  { code: "+58", country: "Venezuela", flag: "🇻🇪" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
];

interface RequestDemoProps {
  isSubmitting?: boolean;
  submitError?: string | null;
  onSubmit: (formData: DemoRequestFormData) => void;
}

export function RequestDemo({ isSubmitting = false, submitError, onSubmit }: RequestDemoProps) {
  const [formData, setFormData] = useState<DemoRequestFormData>({
    name: "",
    email: "",
    countryCode: "+58",
    phone: "",
    condoName: "",
    condoSize: "",
    role: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid work email";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.condoName.trim()) newErrors.condoName = "Condominium name is required";
    if (!formData.condoSize) newErrors.condoSize = "Please select size";
    if (!formData.role) newErrors.role = "Please select your role";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors and submit
    setErrors({});
    onSubmit(formData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1766791783611-b1c6a7ad86bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjByZXNpZGVudGlhbCUyMGFwYXJ0bWVudCUyMGJ1aWxkaW5nJTIwZXh0ZXJpb3J8ZW58MXx8fHwxNzc1Njk3MjAzfDA&ixlib=rb-4.1.0&q=80&w=1080')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1A365D]/95 to-[#1A365D]/85" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00A3BF] to-white rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-[#1A365D]" />
              </div>
              <span className="text-xl font-bold text-white">Habitum</span>
            </a>
            <a href="#" className="text-white/80 hover:text-white transition-colors">
              ← Back to Home
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Side - The Hook */}
            <div className="text-white space-y-8">
              <div>
                <h1 className="text-5xl font-bold mb-6 leading-tight">
                  Discover how AI transforms your Condo Management
                </h1>
                <p className="text-xl text-white/80">
                  See firsthand how Habitum streamlines operations and saves you 20+ hours every week.
                </p>
              </div>

              {/* Benefits List */}
              <div className="space-y-5">
                {[
                  {
                    title: "Personalized walkthrough of features",
                    description: "We'll tailor the demo to your specific needs and challenges"
                  },
                  {
                    title: "See your own rules in action with our AI agent",
                    description: "Watch how Habitum adapts to your building's unique requirements"
                  },
                  {
                    title: "Discuss specific integration needs",
                    description: "Connect with your existing systems seamlessly"
                  },
                  {
                    title: "Custom pricing for large portfolio administrators",
                    description: "Managing multiple buildings? We have special packages for you"
                  }
                ].map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-[#00A3BF] rounded-full flex items-center justify-center mt-1">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                      <p className="text-white/70">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Testimonial */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
                <div className="flex gap-4">
                  <div className="text-[#00A3BF] text-5xl leading-none">"</div>
                  <div>
                    <p className="text-lg mb-4 italic">
                      Our demo with Habitum showed us it was possible to save 20 hours a week. 
                      We went from skeptical to believers in 30 minutes.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#00A3BF] to-white rounded-full flex items-center justify-center font-bold text-[#1A365D]">
                        MR
                      </div>
                      <div>
                        <p className="font-semibold">María Rodríguez</p>
                        <p className="text-sm text-white/70">Administrator, Edificio Central, Caracas</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-[#00A3BF]">500+</div>
                  <div className="text-white/70 text-sm">Buildings Trust Us</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#00A3BF]">98%</div>
                  <div className="text-white/70 text-sm">Customer Satisfaction</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-[#00A3BF]">20hrs</div>
                  <div className="text-white/70 text-sm">Average Time Saved</div>
                </div>
              </div>
            </div>

            {/* Right Side - The Form */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#1A365D] mb-3">
                  Get Your Free Demo
                </h2>
                <p className="text-gray-600">
                  Fill in your details and we'll reach out within 24 hours to schedule your personalized demo.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {submitError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                {/* Name */}
                <div>
                  <Label htmlFor="name" className="text-gray-700 mb-2 flex items-center gap-2">
                    <User className="w-4 h-4 text-[#00A3BF]" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`h-12 ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:border-[#00A3BF] focus:ring-[#00A3BF]`}
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email" className="text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#00A3BF]" />
                    Work Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="juan@micondominio.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`h-12 ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:border-[#00A3BF] focus:ring-[#00A3BF]`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Phone with Country Code */}
                <div>
                  <Label htmlFor="phone" className="text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#00A3BF]" />
                    Phone Number *
                  </Label>
                  <div className="flex gap-2">
                    <select
                      value={formData.countryCode}
                      onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                      className="h-12 px-3 border border-gray-300 rounded-lg focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20 outline-none bg-white"
                    >
                      {LATAM_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="412-1234567"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`h-12 flex-1 ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:border-[#00A3BF] focus:ring-[#00A3BF]`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Condo Name */}
                <div>
                  <Label htmlFor="condoName" className="text-gray-700 mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#00A3BF]" />
                    Condominium Name *
                  </Label>
                  <Input
                    id="condoName"
                    type="text"
                    placeholder="Torre Vista Hermosa"
                    value={formData.condoName}
                    onChange={(e) => setFormData({ ...formData, condoName: e.target.value })}
                    className={`h-12 ${errors.condoName ? 'border-red-500' : 'border-gray-300'} focus:border-[#00A3BF] focus:ring-[#00A3BF]`}
                  />
                  {errors.condoName && <p className="text-red-500 text-sm mt-1">{errors.condoName}</p>}
                </div>

                {/* Condo Size */}
                <div>
                  <Label htmlFor="condoSize" className="text-gray-700 mb-2">
                    Number of Units *
                  </Label>
                  <select
                    id="condoSize"
                    value={formData.condoSize}
                    onChange={(e) => setFormData({ ...formData, condoSize: e.target.value })}
                    className={`w-full h-12 px-4 border ${errors.condoSize ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20 outline-none bg-white`}
                  >
                    <option value="">Select size...</option>
                    <option value="1-50">1-50 units</option>
                    <option value="51-200">51-200 units</option>
                    <option value="200+">200+ units</option>
                  </select>
                  {errors.condoSize && <p className="text-red-500 text-sm mt-1">{errors.condoSize}</p>}
                </div>

                {/* Role */}
                <div>
                  <Label htmlFor="role" className="text-gray-700 mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-[#00A3BF]" />
                    Your Role *
                  </Label>
                  <select
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className={`w-full h-12 px-4 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:border-[#00A3BF] focus:ring-2 focus:ring-[#00A3BF]/20 outline-none bg-white`}
                  >
                    <option value="">Select role...</option>
                    <option value="admin">Condominium Administrator</option>
                    <option value="board">Board Member</option>
                    <option value="manager">Property Manager</option>
                    <option value="owner">Unit Owner</option>
                  </select>
                  {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-[#00A3BF] to-[#1A365D] hover:from-[#00A3BF]/90 hover:to-[#1A365D]/90 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition-all mt-8"
                >
                  {isSubmitting ? "Saving Request..." : "Schedule My Free Demo"}
                  {!isSubmitting && (
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </Button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  No credit card required • 30-minute personalized demo • Available in English & Spanish
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
