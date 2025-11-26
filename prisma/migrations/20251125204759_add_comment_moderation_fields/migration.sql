-- AlterTable
ALTER TABLE "BlogComment" ADD COLUMN     "moderatedAt" TIMESTAMP(3),
ADD COLUMN     "moderatedBy" TEXT,
ADD COLUMN     "moderationFlags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "moderationScore" DOUBLE PRECISION,
ADD COLUMN     "moderationStatus" TEXT DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "BlogComment_blog_post_id_idx" ON "BlogComment"("blog_post_id");

-- CreateIndex
CREATE INDEX "BlogComment_parent_id_idx" ON "BlogComment"("parent_id");

-- CreateIndex
CREATE INDEX "BlogComment_comment_by_idx" ON "BlogComment"("comment_by");

-- CreateIndex
CREATE INDEX "BlogComment_comment_at_idx" ON "BlogComment"("comment_at");

-- CreateIndex
CREATE INDEX "BlogComment_moderationStatus_idx" ON "BlogComment"("moderationStatus");
