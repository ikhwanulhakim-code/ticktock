-- DropIndex
DROP INDEX "Event_boardId_idx";

-- AlterTable
ALTER TABLE "Board" ADD COLUMN     "isShared" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sharedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "Board_isShared_createdAt_idx" ON "Board"("isShared", "createdAt");

-- CreateIndex
CREATE INDEX "Event_boardId_order_idx" ON "Event"("boardId", "order");
