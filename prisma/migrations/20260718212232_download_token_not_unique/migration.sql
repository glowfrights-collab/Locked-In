-- DropIndex
DROP INDEX "Download_token_key";

-- CreateIndex
CREATE INDEX "Download_token_idx" ON "Download"("token");
