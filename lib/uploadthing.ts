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
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

