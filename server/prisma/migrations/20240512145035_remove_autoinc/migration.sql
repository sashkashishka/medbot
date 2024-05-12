-- AlterTable

ALTER TABLE `Order` DROP FOREIGN KEY `Order_userId_fkey`;
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_userId_fkey`;

ALTER TABLE `User` MODIFY `id` INTEGER NOT NULL;

ALTER TABLE `Order` ADD CONSTRAINT `Order_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

