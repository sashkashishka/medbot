/*
  Warnings:

  - Added the required column `orderId` to the `ActivationCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ActivationCode` ADD COLUMN `orderId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ActivationCode` ADD CONSTRAINT `ActivationCode_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Order`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
