"use client"

import { KycSubmissionForm } from "@/components/forms/kyc-submission-form"
import { useLanguage } from "@/contexts/LanguageContext"

export default function KycSubmitPage() {
  const { t } = useLanguage()
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t.kyc.submit_title}</h1>
          <p className="text-muted-foreground">{t.kyc.submit_description}</p>
        </div>
        <KycSubmissionForm />
      </div>
    </div>
  )
}
