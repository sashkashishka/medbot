/*
  Warnings:

  - You are about to drop the column `timeZone` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `timezoneOffset` on the `Appointment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Appointment` DROP COLUMN `timeZone`,
    DROP COLUMN `timezoneOffset`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `timeZone` VARCHAR(191) NULL,
    ADD COLUMN `timezoneOffset` INTEGER NOT NULL DEFAULT 0;
