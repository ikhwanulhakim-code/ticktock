-- AlterTable
ALTER TABLE
    "Event"
ADD
    COLUMN "timerMode" TEXT NOT NULL DEFAULT 'duration';