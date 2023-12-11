/*
  Warnings:

  - You are about to drop the column `topicForumId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `topicForumId`,
    ADD COLUMN `botChatId` INTEGER NULL,
    ADD COLUMN `messageThreadId` INTEGER NULL;
