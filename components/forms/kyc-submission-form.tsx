"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { useUploadThing } from "@/lib/uploadthing-react"
import Webcam from "react-webcam"
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
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Loader2,
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
}

interface KycSubmissionPayload {
  kycLevel: number
  fullName: string
  email: string
  phone: string
  dateOfBirth: string
  nationalId: string
  address: string
  nrcFrontUrl?: string
  nrcBackUrl?: string
  proofOfAddressUrl?: string
  selfieUrl?: string
  bankStatementUrl?: string
  employmentLetterUrl?: string
  videoKycUrl?: string
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
    requirements: ["Level 2 +", "Bank Statement", "Employment Letter", "Video KYC"],
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
  })

  // Fetch existing KYC data to determine which steps to skip
  const {
    data: kycStatus,
    isLoading: isLoadingKycStatus,
    refetch: refetchKycStatus,
  } = useQuery({
    queryKey: ["kyc-status"],
    queryFn: async () => {
      const response = await fetch("/api/kyc/status")
      if (!response.ok) {
        throw new Error("Failed to fetch KYC status")
      }
      return response.json()
    },
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnMount: true, // Refetch when component mounts
    refetchInterval: 5000, // Refetch every 5 seconds to see changes
    staleTime: 0, // Consider data stale immediately
  })

  // Calculate which steps to skip based on existing data
  const getAvailableSteps = useCallback(() => {
    if (!kycStatus) return { step1: true, step2: true, step3: true, step4: true }

    const steps = {
      step1: true, // Level selection - always show
      step2: !kycStatus.hasPersonalInfo, // Personal info - skip if exists
      step3: !kycStatus.hasLevel2Documents, // Documents - skip if exists
      step4: !kycStatus.hasLevel3Documents, // Enhanced - skip if exists
    }

    return steps
  }, [kycStatus])

  const availableSteps = getAvailableSteps()

  // Calculate actual step numbers based on what's available
  const getStepNumber = useCallback(
    (logicalStep: number) => {
      let actualStep = 1 // Step 1 is always level selection
      let currentLogical = 1

      if (currentLogical === logicalStep) return actualStep
      currentLogical++

      // Step 2: Personal Info
      if (availableSteps.step2) {
        actualStep++
        if (currentLogical === logicalStep) return actualStep
      }
      currentLogical++

      // Step 3: Documents
      if (availableSteps.step3) {
        actualStep++
        if (currentLogical === logicalStep) return actualStep
      }
      currentLogical++

      // Step 4: Enhanced
      if (availableSteps.step4) {
        actualStep++
        if (currentLogical === logicalStep) return actualStep
      }

      return actualStep
    },
    [availableSteps]
  )

  // Get logical step from actual step
  const getLogicalStep = useCallback(
    (actualStep: number) => {
      if (actualStep === 1) return 1 // Level selection

      let currentActual = 1
      let logical = 1

      // Step 1 is always shown
      currentActual++
      logical++

      // Check step 2
      if (availableSteps.step2) {
        if (currentActual === actualStep) return 2
        currentActual++
      }
      logical++

      // Check step 3
      if (availableSteps.step3) {
        if (currentActual === actualStep) return 3
        currentActual++
      }
      logical++

      // Check step 4
      if (availableSteps.step4) {
        if (currentActual === actualStep) return 4
        currentActual++
      }

      return logical
    },
    [availableSteps]
  )

  // Update total steps based on available steps and target level
  const totalSteps = useCallback(() => {
    let count = 1 // Step 1 (level selection) is always there
    if (availableSteps.step2) count++
    // Step 3 (documents) only for level 2 or 3
    if (availableSteps.step3 && targetLevel >= 2) count++
    // Step 4 (enhanced) only for level 3
    if (availableSteps.step4 && targetLevel >= 3) count++
    return count
  }, [availableSteps, targetLevel])

  // Pre-populate form with existing data
  useEffect(() => {
    if (kycStatus?.user) {
      setFormData((prev) => ({
        ...prev,
        fullName: kycStatus.user.name || prev.fullName,
        email: kycStatus.user.email || prev.email,
        phone: kycStatus.user.phone || prev.phone,
        dateOfBirth: kycStatus.user.dateOfBirth
          ? new Date(kycStatus.user.dateOfBirth).toISOString().split("T")[0]
          : prev.dateOfBirth,
        nationalId: kycStatus.user.nationalId || prev.nationalId,
        address: kycStatus.user.address || prev.address,
      }))
    }

    // Set target level based on current KYC level
    if (kycStatus?.currentKycLevel) {
      setTargetLevel(kycStatus.currentKycLevel as KycLevel)
    }
  }, [kycStatus])
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadedFileUrls, setUploadedFileUrls] = useState<Record<string, string>>({})
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Live Selfie camera states
  const [isSelfieCameraActive, setIsSelfieCameraActive] = useState(false)
  const selfieWebcamRef = useRef<Webcam>(null)
  
  // Video KYC recording states
  const [isVideoCameraActive, setIsVideoCameraActive] = useState(false)
  const videoWebcamRef = useRef<Webcam>(null)

  const { toast } = useToast()
  const { startUpload: uploadDocument, isUploading: isUploadingDocument } = useUploadThing("kycDocumentUploader")
  const { startUpload: uploadVideo, isUploading: isUploadingVideo } = useUploadThing("kycVideoUploader")

  const progressPercentage = (currentStep / totalSteps()) * 100

  // Auto-set target level to first available level if current target is completed
  useEffect(() => {
    if (isLoadingKycStatus || !kycStatus) return

    // Determine which levels are available
    const availableLevels: KycLevel[] = []
    if (!kycStatus.hasPersonalInfo) {
      availableLevels.push(1)
    }
    if (kycStatus.hasPersonalInfo && !kycStatus.hasLevel2Documents) {
      availableLevels.push(2)
    }
    // Level 3 is available if Level 1 is complete and Level 3 documents don't exist
    // (Level 2 documents may or may not exist)
    if (kycStatus.hasPersonalInfo && !kycStatus.hasLevel3Documents) {
      availableLevels.push(3)
    }

    // If current target level is not available, set it to the first available level
    if (availableLevels.length > 0 && !availableLevels.includes(targetLevel)) {
      setTargetLevel(availableLevels[0])
    }
  }, [kycStatus, isLoadingKycStatus, targetLevel])

  // Auto-advance when steps are skipped
  useEffect(() => {
    if (isLoadingKycStatus) return

    // If all KYC is complete, stay on step 1 (which will show completion message)
    if (kycStatus?.hasPersonalInfo && kycStatus?.hasLevel2Documents && kycStatus?.hasLevel3Documents) {
      setCurrentStep(1)
      return
    }

    const logicalStep = getLogicalStep(currentStep)
    
    // If we're on a step that should be skipped, advance
    if (logicalStep === 2 && !availableSteps.step2) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps()))
    } else if (logicalStep === 3 && !availableSteps.step3) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps()))
    } else if (logicalStep === 4 && !availableSteps.step4) {
      // Last step, can't advance
    }
  }, [currentStep, availableSteps, isLoadingKycStatus, getLogicalStep, kycStatus])

  const handleInputChange = (field: keyof KycFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (field: keyof KycFormData, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }))
  }

  // Video KYC recording functions using react-webcam + MediaRecorder
  const startVideoRecording = useCallback(async () => {
    try {
      // Get the stream from react-webcam's video element
      const videoElement = videoWebcamRef.current?.video
      if (!videoElement) {
        toast({
          title: "Camera Not Ready",
          description: "Please wait for the camera to initialize, then try again.",
          variant: "destructive",
        })
        return
      }

      // Get stream from video element's srcObject
      const stream = (videoElement as HTMLVideoElement).srcObject as MediaStream
      if (!stream || stream.getTracks().length === 0) {
        toast({
          title: "Stream Not Available",
          description: "Unable to access camera stream. Please ensure camera permissions are granted.",
          variant: "destructive",
        })
        return
      }

      const chunks: BlobPart[] = []

      // Try to use webm with opus codec, fallback to default
      let mimeType = "video/webm;codecs=vp8,opus"
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = "video/webm"
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = "" // Use browser default
        }
      }

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined)

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" })
        handleInputChange("videoKycRecording", blob)
        toast({
          title: "Recording Complete",
          description: "Video KYC recording has been captured successfully.",
          variant: "default",
        })
      }

      mediaRecorder.onerror = (e) => {
        console.error("MediaRecorder error:", e)
        toast({
          title: "Recording Error",
          description: "An error occurred while recording. Please try again.",
          variant: "destructive",
        })
        setIsRecording(false)
        if (recordingTimerRef.current) {
          clearInterval(recordingTimerRef.current)
          recordingTimerRef.current = null
        }
      }

      mediaRecorder.start(1000) // Collect data every second
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
      setRecordingTime(0)

      // Auto-stop after 60 seconds
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 59) {
            stopVideoRecording()
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } catch (error) {
      console.error("Error starting video recording:", error)
      toast({
        title: "Recording Failed",
        description: error instanceof Error ? error.message : "Unable to start recording. Please check camera permissions.",
        variant: "destructive",
      })
      setIsRecording(false)
    }
  }, [handleInputChange, toast])

  const stopVideoRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
      setIsRecording(false)
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
        recordingTimerRef.current = null
      }
      setRecordingTime(0)
    }
  }, [isRecording])

  const [videoError, setVideoError] = useState<string | null>(null)

  const startVideoCamera = useCallback(async () => {
    try {
      // Request camera and microphone permission first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: true,
      })
      // Stop the stream immediately - Webcam component will handle it
      stream.getTracks().forEach((track) => track.stop())
      setIsVideoCameraActive(true)
      setVideoError(null)
    } catch (error) {
      console.error("Error accessing video camera:", error)
      setVideoError("Camera/microphone access denied. Please grant permissions.")
      toast({
        title: "Camera Access Denied",
        description: "Please grant camera and microphone permissions to record video.",
        variant: "destructive",
      })
    }
  }, [toast])

  const stopVideoCamera = useCallback(() => {
    // Stop all tracks from the webcam
    if (videoWebcamRef.current?.video?.srcObject) {
      const stream = videoWebcamRef.current.video.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    stopVideoRecording()
    setIsVideoCameraActive(false)
    setVideoError(null)
  }, [stopVideoRecording])

  // Stop camera when leaving the enhanced step (logical step 4)
  useEffect(() => {
    const logicalStep = getLogicalStep(currentStep)
    if (logicalStep !== 4 && isVideoCameraActive) {
      stopVideoCamera()
    }
  }, [currentStep, isVideoCameraActive, stopVideoCamera, getLogicalStep])

  // Live Selfie camera functions using react-webcam
  const [selfieError, setSelfieError] = useState<string | null>(null)

  const startSelfieCamera = useCallback(async () => {
    try {
      // Request camera permission first
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      })
      // Stop the stream immediately - Webcam component will handle it
      stream.getTracks().forEach((track) => track.stop())
      setIsSelfieCameraActive(true)
      setSelfieError(null)
    } catch (error) {
      console.error("Error accessing camera:", error)
      setSelfieError("Camera access denied. Please grant camera permissions.")
      toast({
        title: "Camera Access Denied",
        description: "Please grant camera permissions to capture a selfie.",
        variant: "destructive",
      })
    }
  }, [toast])

  const stopSelfieCamera = useCallback(() => {
    // Stop all tracks from the webcam
    if (selfieWebcamRef.current?.video?.srcObject) {
      const stream = selfieWebcamRef.current.video.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsSelfieCameraActive(false)
    setSelfieError(null)
  }, [])

  const captureSelfie = useCallback(() => {
    if (!selfieWebcamRef.current) {
      toast({
        title: "Camera Not Ready",
        description: "Please wait for the camera to initialize.",
        variant: "destructive",
      })
      return
    }

    const imageSrc = selfieWebcamRef.current.getScreenshot({
      width: 1280,
      height: 720,
    })

    if (!imageSrc) {
      toast({
        title: "Capture Failed",
        description: "Unable to capture selfie. Please try again.",
        variant: "destructive",
      })
      return
    }

    // Convert base64 to File
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: "image/jpeg" })
        handleInputChange("selfie", file)
        stopSelfieCamera()
        
        toast({
          title: "Selfie Captured",
          description: "Your selfie has been captured successfully.",
          variant: "default",
        })
      })
      .catch((error) => {
        console.error("Error converting selfie to file:", error)
        toast({
          title: "Capture Error",
          description: "Failed to process selfie. Please try again.",
          variant: "destructive",
        })
      })
  }, [handleInputChange, stopSelfieCamera, toast])

  // Stop camera when leaving the document step (logical step 3)
  useEffect(() => {
    const logicalStep = getLogicalStep(currentStep)
    if (logicalStep !== 3 && isSelfieCameraActive) {
      stopSelfieCamera()
    }
  }, [currentStep, isSelfieCameraActive, stopSelfieCamera, getLogicalStep])

  // Mutation for submitting KYC data
  const submitKycMutation = useMutation({
    mutationFn: async (payload: KycSubmissionPayload) => {
      const response = await fetch("/api/kyc/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to submit KYC application")
      }

      return response.json()
    },
    onSuccess: async (data, variables) => {
      toast({
        title: "KYC Submission Successful",
        description: `Your KYC Level ${variables.kycLevel} application has been submitted. Our team will review within 24-48 hours.`,
        variant: "default",
      })
      
      // Refetch KYC status to see updated data immediately
      await refetchKycStatus()
      
      // Reset form
      setFormData({
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
      })
      setUploadedFileUrls({})
      setCurrentStep(1)
      setTargetLevel(1)
      // Cleanup cameras and recording
      if (isSelfieCameraActive) {
        stopSelfieCamera()
      }
      if (isVideoCameraActive || isRecording) {
        stopVideoCamera()
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit KYC application. Please try again.",
        variant: "destructive",
      })
    },
  })

  // Handle file upload
  const handleFileUpload = async (file: File | null, fieldName: string): Promise<string | null> => {
    if (!file) return null

    try {
      const uploaded = await uploadDocument([file])
      if (uploaded && uploaded[0]?.url) {
        const url = uploaded[0].url
        setUploadedFileUrls((prev) => ({ ...prev, [fieldName]: url }))
        return url
      }
      return null
    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error)
      throw error
    }
  }

  // Handle video upload
  const handleVideoUpload = async (blob: Blob | null): Promise<string | null> => {
    if (!blob) return null

    try {
      // Convert blob to File
      const videoFile = new File([blob], "kyc-video.webm", { type: "video/webm" })
      const uploaded = await uploadVideo([videoFile])
      if (uploaded && uploaded[0]?.url) {
        return uploaded[0].url
      }
      return null
    } catch (error) {
      console.error("Error uploading video:", error)
      throw error
    }
  }

  const handleSubmit = async () => {
    // Validate Level 1 fields only if they don't exist in database
    if (!kycStatus?.hasPersonalInfo) {
      if (!formData.fullName || !formData.email || !formData.phone || !formData.dateOfBirth || !formData.nationalId || !formData.address) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required Level 1 fields",
          variant: "destructive",
        })
        return
      }
    }

    // Validate Level 2 fields if target level is 2 or 3, and they don't exist in database
    if (targetLevel >= 2) {
      if (!kycStatus?.hasLevel2Documents) {
        if (!formData.nrcFront || !formData.nrcBack || !formData.proofOfAddress || !formData.selfie) {
          toast({
            title: "Validation Error",
            description: "Please upload all required Level 2 documents",
            variant: "destructive",
          })
          return
        }
      }
    }

    // Validate Level 3 fields if target level is 3, and they don't exist in database
    if (targetLevel === 3) {
      if (!kycStatus?.hasLevel3Documents) {
        if (!formData.bankStatement || !formData.employmentLetter || !formData.videoKycRecording) {
          toast({
            title: "Validation Error",
            description: "Please complete all required Level 3 fields",
            variant: "destructive",
          })
          return
        }
      }
    }

    try {
      // Use existing data from database or form data
      const personalInfo = kycStatus?.hasPersonalInfo && kycStatus?.user
        ? {
            fullName: kycStatus.user.name || formData.fullName,
            email: kycStatus.user.email || formData.email,
            phone: kycStatus.user.phone || formData.phone,
            dateOfBirth: kycStatus.user.dateOfBirth 
              ? new Date(kycStatus.user.dateOfBirth).toISOString().split("T")[0]
              : formData.dateOfBirth,
            nationalId: kycStatus.user.nationalId || formData.nationalId,
            address: kycStatus.user.address || formData.address,
          }
        : {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            dateOfBirth: formData.dateOfBirth,
            nationalId: formData.nationalId,
            address: formData.address,
          }

      // Upload all required files
      let nrcFrontUrl = uploadedFileUrls.nrcFront || null
      let nrcBackUrl = uploadedFileUrls.nrcBack || null
      let proofOfAddressUrl = uploadedFileUrls.proofOfAddress || null
      let selfieUrl = uploadedFileUrls.selfie || null
      let bankStatementUrl = uploadedFileUrls.bankStatement || null
      let employmentLetterUrl = uploadedFileUrls.employmentLetter || null
      let videoKycUrl = uploadedFileUrls.videoKycRecording || null

      // Use existing document URLs from database if available, otherwise upload new ones
      if (targetLevel >= 2) {
        if (kycStatus?.hasLevel2Documents && kycStatus?.documents) {
          // Use existing document URLs
          nrcFrontUrl = kycStatus.documents.nrcFrontUrl || nrcFrontUrl
          nrcBackUrl = kycStatus.documents.nrcBackUrl || nrcBackUrl
          proofOfAddressUrl = kycStatus.documents.proofOfAddressUrl || proofOfAddressUrl
          selfieUrl = kycStatus.documents.selfieUrl || selfieUrl
        } else {
          // Upload new documents
          nrcFrontUrl = await handleFileUpload(formData.nrcFront, "nrcFront")
          nrcBackUrl = await handleFileUpload(formData.nrcBack, "nrcBack")
          proofOfAddressUrl = await handleFileUpload(formData.proofOfAddress, "proofOfAddress")
          selfieUrl = await handleFileUpload(formData.selfie, "selfie")
        }
      }

      // Upload Level 3 documents or use existing
      if (targetLevel === 3) {
        if (kycStatus?.hasLevel3Documents && kycStatus?.documents) {
          // Use existing document URLs from database
          bankStatementUrl = kycStatus.documents.bankStatementUrl || null
          employmentLetterUrl = kycStatus.documents.employmentLetterUrl || null
          videoKycUrl = kycStatus.documents.videoKycUrl || null
          
          // If any existing document is missing, try to upload new ones
          if (!bankStatementUrl && formData.bankStatement) {
            bankStatementUrl = await handleFileUpload(formData.bankStatement, "bankStatement")
          }
          if (!employmentLetterUrl && formData.employmentLetter) {
            employmentLetterUrl = await handleFileUpload(formData.employmentLetter, "employmentLetter")
          }
          if (!videoKycUrl && formData.videoKycRecording) {
            videoKycUrl = await handleVideoUpload(formData.videoKycRecording)
          }
          
          // Verify all required Level 3 documents are available
          if (!bankStatementUrl || !employmentLetterUrl || !videoKycUrl) {
            toast({
              title: "Validation Error",
              description: "Some Level 3 documents are missing. Please upload them.",
              variant: "destructive",
            })
            return
          }
        } else {
          // Upload new documents
          if (!formData.bankStatement || !formData.employmentLetter || !formData.videoKycRecording) {
            toast({
              title: "Validation Error",
              description: "Please upload all required Level 3 documents.",
              variant: "destructive",
            })
            return
          }
          
          bankStatementUrl = await handleFileUpload(formData.bankStatement, "bankStatement")
          employmentLetterUrl = await handleFileUpload(formData.employmentLetter, "employmentLetter")
          videoKycUrl = await handleVideoUpload(formData.videoKycRecording)
          
          // Verify all documents were uploaded successfully
          if (!bankStatementUrl || !employmentLetterUrl || !videoKycUrl) {
            toast({
              title: "Upload Error",
              description: "Failed to upload some documents. Please try again.",
              variant: "destructive",
            })
            return
          }
        }
      }

      // Prepare submission payload
      const payload: KycSubmissionPayload = {
        kycLevel: targetLevel,
        fullName: personalInfo.fullName.trim(),
        email: personalInfo.email.trim(),
        phone: personalInfo.phone.trim(),
        dateOfBirth: personalInfo.dateOfBirth,
        nationalId: personalInfo.nationalId.trim(),
        address: personalInfo.address.trim(),
        ...(targetLevel >= 2 && {
          nrcFrontUrl: nrcFrontUrl!,
          nrcBackUrl: nrcBackUrl!,
          proofOfAddressUrl: proofOfAddressUrl!,
          selfieUrl: selfieUrl!,
        }),
        ...(targetLevel === 3 && {
          bankStatementUrl: bankStatementUrl!,
          employmentLetterUrl: employmentLetterUrl!,
          videoKycUrl: videoKycUrl!,
        }),
      }

      // Submit to API
      submitKycMutation.mutate(payload)
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload files. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isSubmitting = submitKycMutation.isPending || isUploadingDocument || isUploadingVideo

  const renderStepContent = () => {
    if (isLoadingKycStatus) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )
    }

    // If all KYC levels are complete, show completion message
    if (kycStatus?.hasPersonalInfo && kycStatus?.hasLevel2Documents && kycStatus?.hasLevel3Documents) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold text-foreground mb-2">KYC Verification Complete</h2>
            <p className="text-sm text-muted-foreground">
              You have successfully completed all KYC verification levels.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Level 1 - Basic Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Personal information verified</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Level 2 - Standard Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Documents verified</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Level 3 - Enhanced Verification
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Enhanced verification complete</p>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your KYC verification is complete. You have access to all transaction limits and features.
            </AlertDescription>
          </Alert>
        </div>
      )
    }

    const logicalStep = getLogicalStep(currentStep)

    switch (logicalStep) {
      case 1:
        // Filter out completed levels
        const availableLevels = kycLevels.filter((level) => {
          if (level.level === 1) {
            // Level 1 is available if personal info doesn't exist
            return !kycStatus?.hasPersonalInfo
          } else if (level.level === 2) {
            // Level 2 is available if Level 2 documents don't exist (but Level 1 must be complete)
            return kycStatus?.hasPersonalInfo && !kycStatus?.hasLevel2Documents
          } else if (level.level === 3) {
            // Level 3 is available if Level 1 is complete and Level 3 documents don't exist
            // (Level 2 documents may or may not exist - user can skip to Level 3)
            return kycStatus?.hasPersonalInfo && !kycStatus?.hasLevel3Documents
          }
          return true
        })

        // If no levels are available, show completion message
        if (availableLevels.length === 0) {
          return (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 text-primary" />
                <h2 className="text-2xl font-bold text-foreground mb-2">All Available Levels Complete</h2>
                <p className="text-sm text-muted-foreground">
                  You have completed all available KYC verification levels.
                </p>
              </div>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Select Verification Level</h2>
              <p className="text-sm text-muted-foreground">Choose your target KYC level based on your needs</p>
            </div>

            <div className={`grid gap-4 ${availableLevels.length === 1 ? "md:grid-cols-1 max-w-md mx-auto" : availableLevels.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {availableLevels.map((level) => (
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
        // Skip if Level 2 documents already exist (handled by useEffect above)
        if (!availableSteps.step3) {
          return null
        }
        // Only show step 3 if target level is 2 or 3
        if (targetLevel < 2) {
          return null
        }
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

              {/* Live Selfie Card with Camera */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Live Selfie
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Capture a live selfie using your device camera
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {formData.selfie ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <CheckCircle className="h-4 w-4" />
                          <span>Selfie captured successfully</span>
                        </div>
                        {formData.selfie && (
                          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(formData.selfie)}
                              alt="Captured selfie"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            handleInputChange("selfie", null)
                            stopSelfieCamera()
                          }}
                          className="w-full"
                        >
                          Retake Selfie
                        </Button>
                      </div>
                    ) : isSelfieCameraActive ? (
                      <div className="space-y-3">
                        {selfieError ? (
                          <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{selfieError}</AlertDescription>
                          </Alert>
                        ) : (
                          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                            <Webcam
                              audio={false}
                              ref={selfieWebcamRef}
                              screenshotFormat="image/jpeg"
                              screenshotQuality={0.92}
                              videoConstraints={{
                                facingMode: "user", // Front-facing camera
                                width: { ideal: 1280 },
                                height: { ideal: 720 },
                              }}
                              mirrored={true}
                              onUserMedia={(stream) => {
                                console.log("Camera stream active:", stream)
                                setSelfieError(null)
                              }}
                              onUserMediaError={(error) => {
                                console.error("Camera error:", error)
                                const errorName = error instanceof DOMException ? error.name : typeof error === "string" ? error : "UnknownError"
                                setSelfieError(
                                  errorName === "NotAllowedError"
                                    ? "Camera permission denied. Please grant camera access."
                                    : errorName === "NotFoundError"
                                    ? "No camera found. Please connect a camera."
                                    : "Failed to access camera. Please try again."
                                )
                                toast({
                                  title: "Camera Error",
                                  description: "Unable to access camera. Please check permissions.",
                                  variant: "destructive",
                                })
                              }}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={captureSelfie}
                            className="flex-1"
                            disabled={!!selfieError}
                          >
                            <Camera className="h-4 w-4 mr-2" />
                            Capture Selfie
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={stopSelfieCamera}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        onClick={startSelfieCamera}
                        variant="outline"
                        className="w-full"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Start Camera
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
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
        // Skip if Level 3 documents already exist (handled by useEffect above)
        if (!availableSteps.step4) {
          return null
        }
        // Only show step 4 if target level is 3
        if (targetLevel < 3) {
          return null
        }
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Shield className="h-12 w-12 mx-auto mb-3 text-primary" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Enhanced Verification</h2>
              <p className="text-sm text-muted-foreground">
                Complete video verification and upload additional documents (Level 3 Requirement)
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
                    {formData.videoKycRecording ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <CheckCircle className="h-12 w-12 mx-auto mb-2 text-primary" />
                          <p className="text-sm font-medium">Video recorded successfully</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Duration: {Math.ceil((formData.videoKycRecording.size / 1024) * 0.01)}s
                          </p>
                        </div>
                      </div>
                    ) : isVideoCameraActive ? (
                      <>
                        {videoError ? (
                          <div className="w-full h-full flex items-center justify-center">
                            <Alert variant="destructive" className="m-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{videoError}</AlertDescription>
                            </Alert>
                          </div>
                        ) : (
                          <>
                            <Webcam
                              audio={true}
                              ref={videoWebcamRef}
                              videoConstraints={{
                                facingMode: "user",
                                width: { ideal: 1280 },
                                height: { ideal: 720 },
                              }}
                              onUserMedia={(stream) => {
                                console.log("Video camera stream active:", stream)
                                setVideoError(null)
                              }}
                              onUserMediaError={(error) => {
                                console.error("Video camera error:", error)
                                const errorName = error instanceof DOMException ? error.name : typeof error === "string" ? error : "UnknownError"
                                setVideoError(
                                  errorName === "NotAllowedError"
                                    ? "Camera/microphone permission denied. Please grant access."
                                    : errorName === "NotFoundError"
                                    ? "No camera/microphone found. Please connect devices."
                                    : "Failed to access camera/microphone. Please try again."
                                )
                                toast({
                                  title: "Camera Error",
                                  description: "Unable to access camera/microphone. Please check permissions.",
                                  variant: "destructive",
                                })
                              }}
                              className="w-full h-full object-cover"
                            />
                            {isRecording && (
                              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 z-10">
                                <span className="animate-pulse">●</span>
                                Recording {recordingTime}s
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">Click start camera to begin</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!formData.videoKycRecording && (
                      <>
                        {!isVideoCameraActive ? (
                          <Button onClick={startVideoCamera} className="flex-1">
                            <Camera className="h-4 w-4 mr-2" />
                            Start Camera
                          </Button>
                        ) : !isRecording ? (
                          <>
                          <Button onClick={startVideoRecording} className="flex-1">
                            <Camera className="h-4 w-4 mr-2" />
                            Start Recording
                          </Button>
                            <Button onClick={stopVideoCamera} variant="outline" className="flex-1">
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <Button onClick={stopVideoRecording} variant="destructive" className="flex-1">
                            Stop Recording
                          </Button>
                        )}
                      </>
                    )}
                    {formData.videoKycRecording && (
                      <Button
                        onClick={() => {
                          handleInputChange("videoKycRecording", null)
                          stopVideoCamera()
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Retake Video
                      </Button>
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
              {kycStatus?.hasPersonalInfo && kycStatus?.hasLevel2Documents && kycStatus?.hasLevel3Documents
                ? "KYC Verification Complete"
                : `Step ${currentStep} of ${totalSteps()} - ${
                    targetLevel === 1 ? "Basic" : targetLevel === 2 ? "Standard" : "Enhanced"
                  } Level`}
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

        {/* Hide navigation buttons if all KYC is complete */}
        {!(kycStatus?.hasPersonalInfo && kycStatus?.hasLevel2Documents && kycStatus?.hasLevel3Documents) && (
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => {
                // Find previous available step
                let prevStep = currentStep - 1
                while (prevStep > 1) {
                  const logical = getLogicalStep(prevStep)
                  if (
                    (logical === 2 && availableSteps.step2) ||
                    (logical === 3 && availableSteps.step3) ||
                    (logical === 4 && availableSteps.step4) ||
                    logical === 1
                  ) {
                    break
                  }
                  prevStep--
                }
                setCurrentStep(Math.max(1, prevStep))
              }}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps() ? (
              <Button
                onClick={() => {
                  // Find next available step
                  let nextStep = currentStep + 1
                  while (nextStep <= totalSteps()) {
                    const logical = getLogicalStep(nextStep)
                    if (
                      (logical === 2 && availableSteps.step2) ||
                      (logical === 3 && availableSteps.step3) ||
                      (logical === 4 && availableSteps.step4) ||
                      logical === 1
                    ) {
                      break
                    }
                    nextStep++
                  }
                  setCurrentStep(Math.min(nextStep, totalSteps()))
                }}
                disabled={isSubmitting}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="bg-primary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {isUploadingDocument || isUploadingVideo ? "Uploading files..." : "Submitting..."}
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
