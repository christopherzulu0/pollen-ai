import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // You can add authentication logic here if needed
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId)
      console.log("file url", file.ufsUrl)

      // Return the file URL for use in your application
      return { url: file.ufsUrl }
    }),

  profileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Profile image uploaded for userId:", metadata.userId)
      console.log("Profile image url:", file.ufsUrl)
      return { url: file.ufsUrl }
    }),

  cvUploader: f({
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    "application/msword": { maxFileSize: "8MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "8MB",
    },
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("CV uploaded for userId:", metadata.userId)
      console.log("CV url:", file.ufsUrl)
      return { url: file.ufsUrl }
    }),

  projectUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Project image uploaded for userId:", metadata.userId)
      console.log("Project image url:", file.ufsUrl)
      return { url: file.ufsUrl }
    }),


  groupLogo: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Project image uploaded for userId:", metadata.userId)
      console.log("Project image url:", file.ufsUrl)
      return { url: file.ufsUrl }
    }),

  blogImageUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      // You can add authentication logic here if needed
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Blog image uploaded for userId:", metadata.userId)
      console.log("Blog image url", file.url)

      // Return the file URL for use in your application
      return { url: file.url }
    }),

  voiceCommentUploader: f({
    audio: { maxFileSize: "8MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Voice comment uploaded for userId:", metadata.userId)
      console.log("Voice comment url", file.url)
      return { url: file.url }
    }),

  serviceImageUploader: f({
    image: { maxFileSize: "16MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Service image uploaded for userId:", metadata.userId)
      console.log("Service image url", file.url)
      return { url: file.url }
    }),

  loanDocumentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Loan document uploaded for userId:", metadata.userId)
      console.log("Loan document url", file.url)
      return { url: file.url }
    }),

  kycDocumentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("KYC document uploaded for userId:", metadata.userId)
      console.log("KYC document url", file.url)
      return { url: file.url }
    }),

  kycVideoUploader: f({
    video: { maxFileSize: "8GB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("KYC video uploaded for userId:", metadata.userId)
      console.log("KYC video url", file.url)
      return { url: file.url }
    }),

  solarDocumentUploader: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Solar document uploaded for userId:", metadata.userId)
      console.log("Solar document url", file.url)
      return { url: file.url }
    }),

  insuranceDocumentUploader: f({
    image: { maxFileSize: "10MB", maxFileCount: 10 },
    pdf: { maxFileSize: "10MB", maxFileCount: 10 }
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Insurance document uploaded for userId:", metadata.userId)
      console.log("Insurance document url", file.url)
      return { url: file.url }
    }),

  memberProfileImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 }
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url }
    }),

  meetingMinutesUploader: f({
    pdf: { maxFileSize: "10MB", maxFileCount: 1 },
    "application/msword": { maxFileSize: "10MB" },
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "10MB",
    },
  })
    .middleware(async ({ req }) => {
      return { userId: "user-id" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.url ?? file.ufsUrl }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

