import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { NextResponse } from "next/server";

const f = createUploadthing();

export const uploadRouter = {
  // Example "profile picture upload" route - these can be named whatever you want!
//  groupLogo: f(["image"])
//     .middleware(({ req }) => auth(req))
//     .onUploadComplete((data) => console.log("file", data)),

  // This route takes an attached image OR video
  // messageAttachment: f(["image", "video"])
  //   .middleware(({ req }) => auth(req))
  //   .onUploadComplete((data) => console.log("file", data)),

  // Takes exactly ONE image up to 2MB
  // strictImageAttachment: f({
  //   image: { maxFileSize: "2MB", maxFileCount: 1, minFileCount: 1 },
  // })
  //   .middleware(({ req }) => auth(req))
  //   .onUploadComplete((data) => console.log("file", data)),

  // Takes up to 4 2mb images and/or 1 256mb video
  // mediaPost: f({
  //   image: { maxFileSize: "2MB", maxFileCount: 4 },
  //   video: { maxFileSize: "256MB", maxFileCount: 1 },
  // })
  //   .middleware(({ req }) => auth(req))
  //   .onUploadComplete((data) => console.log("file", data)),

  // Takes up to 4 2mb images, and the client will not resolve
  // the upload until the `onUploadComplete` resolved.
  groupLogo: f(
    { image: { maxFileSize: "4MB", maxFileCount: 1 } },
    { awaitServerData: true },
  )
    .middleware(async () => {
      try {
        const session = await auth();
        
        if (!session || !session?.userId) {
          throw new Error("Unauthorized");
        }
        
        // Return metadata object with userId
        return { userId: session.userId };
      } catch (error) {
        console.error("Error in groupLogo middleware:", error);
        throw new Error("Unauthorized");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        if (!file.url) {
          console.error("No URL returned from upload");
          return;
        }
        
        console.log("Upload complete for user:", metadata.userId);
        console.log("File URL:", file.url);
        
        // Explicitly return void by not returning anything
        return;
      } catch (error) {
        console.error("Error in onUploadComplete:", error);
        // Don't throw here, just return void
        return;
      }
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
