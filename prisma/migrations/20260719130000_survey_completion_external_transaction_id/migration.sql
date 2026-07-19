-- AlterTable
ALTER TABLE "SurveyCompletion" ADD COLUMN "externalTransactionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SurveyCompletion_externalTransactionId_key" ON "SurveyCompletion"("externalTransactionId");
