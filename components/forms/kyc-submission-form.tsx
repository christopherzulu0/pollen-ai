"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  CheckCircle,
  Upload,
  Camera,
  FileText,
  User,
  Shield,
  Video,
  Fingerprint,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type KycLevel = 1 | 2 | 3

interface KycFormData {
  // Level 1 - Basic Info
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  nationalId: string
  address: string

  // Level 2 - Documents
  nrcFront: File | null
  nrcBack: File | null
  proofOfAddress: File | null
  selfie: File | null

  // Level 3 - Enhanced
  bankStatement: File | null
  employmentLetter: File | null
  videoKycRecording: Blob | null
  fingerprintData: string | null
}

const kycLevels = [
  {
    level: 1 as KycLevel,
    title: "Basic Verification",
    description: "Basic personal information",
    limits: "Up to ZMW 10,000/month",
    requirements: ["Full name", "Email", "Phone", "National ID", "Address", "Date of Birth"],
  },
  {
    level: 2 as KycLevel,
    title: "Standard Verification",
    description: "Document verification",
    limits: "Up to ZMW 50,000/month",
    requirements: ["Level 1 +", "NRC Front & Back", "Proof of Address", "Live Selfie"],
  },
  {
    level: 3 as KycLevel,
    title: "Enhanced Verification",
    description: "Full compliance verification",
    limits: "Up to ZMW 100,000/month",
    requirements: ["Level 2 +", "Bank Statement", "Employment Letter", "Video KYC", "Biometric Authentication"],
  },
]

export function KycSubmissionForm() {
  const [targetLevel, setTargetLevel] = useState<KycLevel>(1)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<KycFormData>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationalId: "",
    address: "",
    nrcFront: null,
    nrcBack: null,
    proofOfAddress: null,
    selfie: null,
    bankStatement: null,
    employmentLetter: null,
    videoKycRecording: null,
    fingerprintData: null,
  })
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const totalSteps = targetLevel === 1 ? 2 : targetLevel === 2 ? 3 : 4
  const progressPercentage = (currentStep / totalSteps) * 100

  const handleInputChange = (field: keyof KycFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: keyof KycFormData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data)
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        handleInputChange("videoKycRecording", blob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)

      // Auto-stop after 60 seconds
      const timer = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 59) {
            stopVideoRecording()
            clearInterval(timer)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error("Error accessing camera:", error)
    }
  }

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingTime(0)
    }
  }

  const simulateFingerprintCapture = () => {
    // Simulate biometric capture
    const mockFingerprint = `FINGERPRINT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    handleInputChange("fingerprintData", mockFingerprint)
  }

  const handleSubmit = async () => {
    // Here you would submit to your backend API
    console.log("Submitting KYC data:", formData)
    alert("KYC Application submitted successfully! Our team will review within 24-48 hours.")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Select Verification Level</h2>
              <p className="text-sm text-muted-foreground">Choose your target KYC level based on your needs</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {kycLevels.map((level) => (
                <Card
                  key={level.level}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    targetLevel === level.level ? "border-primary ring-2 ring-primary" : "border-border"
                  }`}
                  onClick={() => setTargetLevel(level.level)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={targetLevel === level.level ? "default" : "outline"}>Level {level.level}</Badge>
                      {targetLevel === level.level && <CheckCircle className="h-5 w-5 text-primary" />}
                    </div>
                    <CardTitle className="text-lg">{level.title}</CardTitle>
                    <CardDescription className="text-sm">{level.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-1">Transaction Limits</p>
                        <p className="text-sm font-medium text-foreground">{level.limits}</p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground mb-2">Requirements</p>
                        <ul className="space-y-1">
                          {level.requirements.map((req, idx) => (
                            <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                              <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0 text-primary" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                You can start with Level 1 and upgrade later. Higher levels unlock higher transaction limits and
                additional features.
              </AlertDescription>
            </Alert>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Personal Information</h2>
              <p className="text-sm text-muted-foreground">Provide your basic details (Level 1 Requirement)</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+260 977 123 456"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationalId">National ID/NRC Number *</Label>
                <Input
                  id="nationalId"
                  placeholder="123456/78/9"
                  value={formData.nationalId}
                  onChange={(e) => handleInputChange("nationalId", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Residential Address *</Label>
                <Input
                  id="address"
                  placeholder="Plot 123, Independence Ave, Lusaka"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Document Verification</h2>
              <p className="text-sm text-muted-foreground">Upload your identity documents (Level 2 Requirement)</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {[
                { field: "nrcFront", label: "NRC Front", icon: Upload },
                { field: "nrcBack", label: "NRC Back", icon: Upload },
                { field: "proofOfAddress", label: "Proof of Address", icon: Upload },
                { field: "selfie", label: "Live Selfie", icon: Camera },
              ].map(({ field, label, icon: Icon }) => (
                <Card key={field}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(field as keyof KycFormData, e.target.files?.[0] || null)}
                        className="cursor-pointer"
                      />
                      {formData[field as keyof KycFormData] && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <CheckCircle className="h-4 w-4" />
                          <span>File uploaded successfully</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Ensure documents are clear, unobstructed, and all text is readable. Accepted formats: JPG, PNG, PDF (max
                5MB).
              </AlertDescription>
            </Alert>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Enhanced Verification</h2>
              <p className="text-sm text-muted-foreground">
                Complete biometric and video verification (Level 3 Requirement)
              </p>
            </div>

            <div className="space-y-6">
              {/* Additional Documents */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Additional Documents</CardTitle>
                  <CardDescription>Upload supporting financial documents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankStatement">Bank Statement (Last 3 months)</Label>
                    <Input
                      id="bankStatement"
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => handleFileChange("bankStatement", e.target.files?.[0] || null)}
                    />
                    {formData.bankStatement && (
                      <p className="text-sm text-primary flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Uploaded
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employmentLetter">Employment Letter/Payslip</Label>
                    <Input
                      id="employmentLetter"
                      type="file"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => handleFileChange("employmentLetter", e.target.files?.[0] || null)}
                    />
                    {formData.employmentLetter && (
                      <p className="text-sm text-primary flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" /> Uploaded
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Video KYC */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Video KYC Recording
                  </CardTitle>
                  <CardDescription>Record a short video stating your name and purpose</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden relative">
                    {isRecording ? (
                      <>
                        <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" />
                        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                          <span className="animate-pulse">●</span>
                          Recording {recordingTime}s
                        </div>
                      </>
                    ) : formData.videoKycRecording ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <CheckCircle className="h-12 w-12 mx-auto mb-2 text-primary" />
                          <p className="text-sm font-medium">Video recorded successfully</p>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click start to begin recording</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!formData.videoKycRecording && (
                      <>
                        {!isRecording ? (
                          <Button onClick={startVideoRecording} className="flex-1">
                            <Camera className="h-4 w-4 mr-2" />
                            Start Recording
                          </Button>
                        ) : (
                          <Button onClick={stopVideoRecording} variant="destructive" className="flex-1">
                            Stop Recording
                          </Button>
                        )}
                      </>
                    )}
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Please say: "My name is [Your Full Name] and I am applying for KYC verification on [Platform
                      Name]"
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Biometric */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Fingerprint className="h-5 w-5" />
                    Biometric Authentication
                  </CardTitle>
                  <CardDescription>Capture your fingerprint for secure authentication</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      {formData.fingerprintData ? (
                        <div>
                          <CheckCircle className="h-12 w-12 mx-auto mb-3 text-primary" />
                          <p className="text-sm font-medium">Fingerprint captured successfully</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            ID: {formData.fingerprintData.slice(0, 20)}...
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Fingerprint className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-4">Place your finger on the scanner</p>
                          <Button onClick={simulateFingerprintCapture} variant="outline">
                            <Fingerprint className="h-4 w-4 mr-2" />
                            Capture Fingerprint
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div>
            <CardTitle className="text-2xl">KYC Verification</CardTitle>
            <CardDescription className="mt-1">
              Step {currentStep} of {totalSteps} -{" "}
              {targetLevel === 1 ? "Basic" : targetLevel === 2 ? "Standard" : "Enhanced"} Level
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-base px-4 py-2">
            Level {targetLevel}
          </Badge>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-8">
        {renderStepContent()}

        <Separator />

        <div className="flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={() => setCurrentStep((prev) => prev + 1)}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-primary">
              <CheckCircle className="h-4 w-4 mr-2" />
              Submit Application
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
