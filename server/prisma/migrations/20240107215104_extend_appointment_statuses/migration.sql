-- AlterTable
ALTER TABLE `Appointment` MODIFY `status` ENUM('ACTIVE', 'DELETED', 'DONE') NOT NULL;
