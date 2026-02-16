-- AlterTable
ALTER TABLE
    "Event"
ADD
    COLUMN "durationMs" BIGINT NOT NULL DEFAULT 0;