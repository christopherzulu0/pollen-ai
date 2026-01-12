import { KycSubmissionForm } from "@/components/forms/kyc-submission-form"

export default function KycSubmitPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Identity Verification</h1>
          <p className="text-muted-foreground">Complete your KYC verification to unlock full platform features</p>
        </div>
        <KycSubmissionForm />
      </div>
    </div>
  )
}
