"use client";

import React from "react"

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useUploadThing } from "@/lib/uploadthing-react";
import { useToast } from "@/hooks/use-toast";
import { DocumentUploadCard } from "./document-upload-card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  FileCheck,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles,
  PartyPopper,
} from "lucide-react";

interface DocumentFiles {
  nrcFront: File | null;
  nrcBack: File | null;
  landOwnership: File | null;
  utilityBill: File | null;
  vendorQuotation: File | null;
  subsidyReceipt: File | null;
}

const documentFields = [
  {
    key: "nrcFront" as keyof DocumentFiles,
    title: "NRC Front",
    description: "Front side of your National Registration Card",
    accept: "image/*,.pdf",
    icon: "id" as const,
  },
  {
    key: "nrcBack" as keyof DocumentFiles,
    title: "NRC Back",
    description: "Back side of your National Registration Card",
    accept: "image/*,.pdf",
    icon: "id" as const,
  },
  {
    key: "landOwnership" as keyof DocumentFiles,
    title: "Land Ownership",
    description: "Property deed or land ownership certificate",
    accept: "image/*,.pdf",
    icon: "property" as const,
  },
  {
    key: "utilityBill" as keyof DocumentFiles,
    title: "Utility Bill",
    description: "Recent electricity or water bill (last 3 months)",
    accept: "image/*,.pdf",
    icon: "utility" as const,
  },
  {
    key: "vendorQuotation" as keyof DocumentFiles,
    title: "Vendor Quotation",
    description: "Solar installation quote from approved vendor",
    accept: "image/*,.pdf",
    icon: "quotation" as const,
  },
  {
    key: "subsidyReceipt" as keyof DocumentFiles,
    title: "Subsidy Receipt",
    description: "Government subsidy approval if applicable",
    accept: "image/*,.pdf",
    icon: "receipt" as const,
  },
];

interface UploadedUrls {
  nrcFront: string | null;
  nrcBack: string | null;
  landOwnership: string | null;
  utilityBill: string | null;
  vendorQuotation: string | null;
  subsidyReceipt: string | null;
}

export function KycUploadForm() {
  const [files, setFiles] = useState<DocumentFiles>({
    nrcFront: null,
    nrcBack: null,
    landOwnership: null,
    utilityBill: null,
    vendorQuotation: null,
    subsidyReceipt: null,
  });
  const [uploadedUrls, setUploadedUrls] = useState<UploadedUrls>({
    nrcFront: null,
    nrcBack: null,
    landOwnership: null,
    utilityBill: null,
    vendorQuotation: null,
    subsidyReceipt: null,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { toast } = useToast();
  const { startUpload, isUploading } = useUploadThing("solarDocumentUploader");

  // Check if documents already exist
  const {
    data: existingDocuments,
    isLoading: isLoadingDocuments,
    refetch: refetchDocuments,
  } = useQuery({
    queryKey: ["solar-documents"],
    queryFn: async () => {
      const response = await fetch("/api/user-documents?serviceType=Solar Equipment");
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      return response.json();
    },
  });

  // Set submitted state if documents exist
  useEffect(() => {
    if (existingDocuments?.hasDocuments) {
      setIsSubmitted(true);
    }
  }, [existingDocuments]);

  const handleFileSelect = (key: keyof DocumentFiles, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    // Clear uploaded URL when file changes
    setUploadedUrls((prev) => ({ ...prev, [key]: null }));
  };

  const uploadedCount = Object.values(files).filter(Boolean).length;
  const totalCount = documentFields.length;
  const progress = (uploadedCount / totalCount) * 100;
  const isComplete = uploadedCount === totalCount;

  // Handle file upload
  const handleFileUpload = async (file: File | null, fieldName: keyof UploadedUrls): Promise<string | null> => {
    if (!file) return null;

    try {
      const uploaded = await startUpload([file]);
      if (uploaded && uploaded[0]?.url) {
        const url = uploaded[0].url;
        setUploadedUrls((prev) => ({ ...prev, [fieldName]: url }));
        return url;
      }
      return null;
    } catch (error) {
      console.error(`Error uploading ${fieldName}:`, error);
      throw error;
    }
  };

  // Mutation for submitting solar documents
  const submitSolarDocumentsMutation = useMutation({
    mutationFn: async (payload: {
      serviceType: string;
      nrcFront: string;
      nrcBack: string;
      landOwnership: string;
      utilityBill: string;
      vendorQuotation: string;
      subsidyReceipt: string;
    }) => {
      const response = await fetch("/api/user-documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit solar documents");
      }

      return response.json();
    },
    onSuccess: async () => {
      toast({
        title: "Documents Submitted Successfully",
        description: "Your solar loan documents have been received. Our team will review them within 2-3 business days.",
        variant: "default",
      });
      // Refetch documents to update the UI
      await refetchDocuments();
      setIsSubmitted(true);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit documents. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) {
      toast({
        title: "Incomplete Documents",
        description: "Please upload all required documents before submitting.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload all files first
      const nrcFrontUrl = uploadedUrls.nrcFront || await handleFileUpload(files.nrcFront, "nrcFront");
      const nrcBackUrl = uploadedUrls.nrcBack || await handleFileUpload(files.nrcBack, "nrcBack");
      const landOwnershipUrl = uploadedUrls.landOwnership || await handleFileUpload(files.landOwnership, "landOwnership");
      const utilityBillUrl = uploadedUrls.utilityBill || await handleFileUpload(files.utilityBill, "utilityBill");
      const vendorQuotationUrl = uploadedUrls.vendorQuotation || await handleFileUpload(files.vendorQuotation, "vendorQuotation");
      const subsidyReceiptUrl = uploadedUrls.subsidyReceipt || await handleFileUpload(files.subsidyReceipt, "subsidyReceipt");

      // Verify all URLs are available
      if (!nrcFrontUrl || !nrcBackUrl || !landOwnershipUrl || !utilityBillUrl || !vendorQuotationUrl || !subsidyReceiptUrl) {
        toast({
          title: "Upload Error",
          description: "Failed to upload some documents. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Submit to API
      submitSolarDocumentsMutation.mutate({
        serviceType: "Solar Equipment",
        nrcFront: nrcFrontUrl,
        nrcBack: nrcBackUrl,
        landOwnership: landOwnershipUrl,
        utilityBill: utilityBillUrl,
        vendorQuotation: vendorQuotationUrl,
        subsidyReceipt: subsidyReceiptUrl,
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isSubmitting = submitSolarDocumentsMutation.isPending || isUploading;

  // Show loading state while checking for existing documents
  if (isLoadingDocuments) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Checking existing documents...</p>
      </div>
    );
  }

  // Show submitted state if documents already exist or were just submitted
  if (isSubmitted || existingDocuments?.hasDocuments) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 md:p-12 text-center">
        <div className="relative inline-block mb-6">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -top-2 -right-2">
            <PartyPopper className="w-6 h-6 text-primary animate-bounce" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
          {existingDocuments?.hasDocuments && !isSubmitted
            ? "Documents Already Submitted"
            : "Documents Submitted Successfully"}
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
          {existingDocuments?.hasDocuments && !isSubmitted
            ? "Your solar loan documents have already been submitted. Our team will review them and notify you within 2-3 business days."
            : "Your solar loan documents have been received. Our team will review them and notify you within 2-3 business days."}
        </p>
        {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setFiles({
                nrcFront: null,
                nrcBack: null,
                landOwnership: null,
                utilityBill: null,
                vendorQuotation: null,
                subsidyReceipt: null,
              });
              setUploadedUrls({
                nrcFront: null,
                nrcBack: null,
                landOwnership: null,
                utilityBill: null,
                vendorQuotation: null,
                subsidyReceipt: null,
              });
            }}
            variant="secondary"
            className="w-full sm:w-auto"
          >
           Go Home
          </Button>
        </div> */}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Progress Card */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <FileCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-foreground">Upload Progress</p>
              <p className="text-sm text-muted-foreground">
                {uploadedCount} of {totalCount} documents uploaded
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary">
              {Math.round(progress)}%
            </p>
          </div>
        </div>
        
        {/* Custom Progress Bar */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Document Status Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {documentFields.map((field) => (
            <div
              key={field.key}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                files[field.key]
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {files[field.key] ? (
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {field.title}
                </span>
              ) : (
                field.title
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Document Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documentFields.map((field) => (
          <DocumentUploadCard
            key={field.key}
            title={field.title}
            description={field.description}
            accept={field.accept}
            file={files[field.key]}
            onFileSelect={(file) => handleFileSelect(field.key, file)}
            icon={field.icon}
          />
        ))}
      </div>

      {/* Submit Section */}
      <div className="bg-card rounded-2xl border border-border p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                isComplete ? "bg-primary/10" : "bg-muted"
              }`}
            >
              {isComplete ? (
                <Sparkles className="w-6 h-6 text-primary" />
              ) : (
                <FileCheck className="w-6 h-6 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">
                {isComplete ? "Ready to Submit" : "Complete All Uploads"}
              </p>
              <p className="text-sm text-muted-foreground">
                {isComplete
                  ? "All documents uploaded. Review and submit your application."
                  : `Upload ${totalCount - uploadedCount} more document${totalCount - uploadedCount > 1 ? "s" : ""} to continue.`}
              </p>
            </div>
          </div>
          <Button
            type="submit"
            disabled={!isComplete || isSubmitting}
            size="lg"
            className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Submit Application
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-muted/50">
        <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Your data is secure
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            All documents are encrypted using AES-256 and stored in compliance with 
            international data protection regulations.
          </p>
        </div>
      </div>
    </form>
  );
}
