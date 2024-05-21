/*
  Warnings:

  - You are about to alter the column `namespace` on the `I18n` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `I18n` MODIFY `namespace` ENUM('medbot', 'webapp') NOT NULL;
