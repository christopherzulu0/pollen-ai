-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "engagement" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "BlogBookmark" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "blog_post_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogBookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogLike" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "blog_post_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlogLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserFollow" (
    "id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "author_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserFollow_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BlogBookmark_user_id_idx" ON "BlogBookmark"("user_id");

-- CreateIndex
CREATE INDEX "BlogBookmark_blog_post_id_idx" ON "BlogBookmark"("blog_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "BlogBookmark_user_id_blog_post_id_key" ON "BlogBookmark"("user_id", "blog_post_id");

-- CreateIndex
CREATE INDEX "BlogLike_user_id_idx" ON "BlogLike"("user_id");

-- CreateIndex
CREATE INDEX "BlogLike_blog_post_id_idx" ON "BlogLike"("blog_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "BlogLike_user_id_blog_post_id_key" ON "BlogLike"("user_id", "blog_post_id");

-- CreateIndex
CREATE INDEX "UserFollow_follower_id_idx" ON "UserFollow"("follower_id");

-- CreateIndex
CREATE INDEX "UserFollow_author_name_idx" ON "UserFollow"("author_name");

-- CreateIndex
CREATE UNIQUE INDEX "UserFollow_follower_id_author_name_key" ON "UserFollow"("follower_id", "author_name");

-- AddForeignKey
ALTER TABLE "BlogBookmark" ADD CONSTRAINT "BlogBookmark_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BlogLike" ADD CONSTRAINT "BlogLike_blog_post_id_fkey" FOREIGN KEY ("blog_post_id") REFERENCES "BlogPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
