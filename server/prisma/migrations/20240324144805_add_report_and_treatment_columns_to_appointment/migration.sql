-- AlterTable
ALTER TABLE `Appointment` ADD COLUMN `report` MEDIUMTEXT NULL,
    ADD COLUMN `treatment` MEDIUMTEXT NULL,
    MODIFY `complaints` MEDIUMTEXT NOT NULL,
    MODIFY `complaintsStarted` MEDIUMTEXT NOT NULL,
    MODIFY `medicine` MEDIUMTEXT NOT NULL,
    MODIFY `chronicDiseases` MEDIUMTEXT NOT NULL;
