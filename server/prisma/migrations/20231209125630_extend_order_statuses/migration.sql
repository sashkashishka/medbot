-- AlterTable
ALTER TABLE `Order` MODIFY `status` ENUM('WAITING_FOR_PAYMENT', 'ACTIVE', 'DONE') NOT NULL;