-- AlterTable
ALTER TABLE `TelegrafSessions` MODIFY `session` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` MODIFY `name` VARCHAR(191) NULL,
    MODIFY `surname` VARCHAR(191) NULL,
    MODIFY `birthDate` DATETIME(3) NULL,
    MODIFY `topicForumId` INTEGER NULL,
    MODIFY `phone` VARCHAR(191) NULL,
    MODIFY `email` VARCHAR(191) NULL;
