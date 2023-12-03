-- CreateTable
CREATE TABLE `TelegrafSessions` (
    `key` VARCHAR(191) NOT NULL,
    `session` MEDIUMTEXT NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
