/*
  Warnings:

  - Made the column `productId` on table `ActivationCode` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Appointment` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `ActivationCode` DROP FOREIGN KEY `ActivationCode_productId_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Order` DROP FOREIGN KEY `Order_productId_fkey`;

-- AlterTable
ALTER TABLE `ActivationCode` MODIFY `productId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Appointment` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Order` MODIFY `productId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivationCode` ADD CONSTRAINT `ActivationCode_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
