"use client";

import { KycUploadForm } from "@/components/kyc-upload-form";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sun, Shield, Zap, Clock, ChevronRight, Leaf } from "lucide-react";
import { useState } from "react";

export default function KycPage() {
  const { t } = useLanguage();
  const copy = t.kyc;
  const [currentStep] = useState(1);
  const steps = [
    { number: 1, label: copy.step_upload, active: true },
    { number: 2, label: copy.step_verification, active: false },
    { number: 3, label: copy.step_approval, active: false },
  ];
  const stats = [
    { value: "2-3", label: copy.stat_days, sublabel: copy.stat_days_sub },
    { value: "98%", label: copy.stat_rate, sublabel: copy.stat_rate_sub },
    { value: "0%", label: copy.stat_fee, sublabel: copy.stat_fee_sub },
  ];

  return (
    <div className="min-h-screen bg-background">
 

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Leaf className="w-4 h-4" />
                {copy.solar_badge}
                <ChevronRight className="w-4 h-4" />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground tracking-tight text-balance">
                {copy.solar_title}
                <span className="block text-primary">{copy.solar_highlight}</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                {copy.solar_description}
              </p>
              
              {/* Step Indicator */}
              <div className="flex items-center gap-2 pt-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        step.number === currentStep
                          ? "bg-primary text-primary-foreground"
                          : step.number < currentStep
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-current/20 flex items-center justify-center text-xs">
                        {step.number}
                      </span>
                      <span className="hidden sm:inline">{step.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-8 h-px bg-border mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 lg:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="group relative bg-card rounded-2xl p-4 lg:p-6 border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {stat.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {stat.sublabel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-12 text-sm">
            {[
              { icon: Shield, text: "Bank-Level Security" },
              { icon: Zap, text: "Instant Upload" },
              { icon: Clock, text: "24/7 Processing" },
            ].map((feature) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 text-muted-foreground"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">1</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground">
                Upload Required Documents
              </h2>
            </div>
            <p className="text-muted-foreground ml-11">
              Please upload clear, legible copies of the following documents. 
              Accepted formats: JPG, PNG, PDF (max 10MB each).
            </p>
          </div>

          {/* KYC Form */}
          <KycUploadForm />
        </div>
      </main>

   
    </div>
  );
}
