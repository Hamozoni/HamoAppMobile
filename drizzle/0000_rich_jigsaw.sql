CREATE TABLE `chatParticipants` (
	`chatId` text NOT NULL,
	`userId` text NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`joinedAt` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	`leftAt` integer,
	PRIMARY KEY(`chatId`, `userId`),
	FOREIGN KEY (`chatId`) REFERENCES `chats`(`clientChatId`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `contacts`(`_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_participantsUser` ON `chatParticipants` (`userId`);--> statement-breakpoint
CREATE TABLE `chats` (
	`clientChatId` text PRIMARY KEY NOT NULL,
	`_id` text,
	`isGroup` integer DEFAULT 0 NOT NULL,
	`peerId` text,
	`groupName` text,
	`groupAvatar` text,
	`lastMessageId` text,
	`lastMessageText` text,
	`lastMessageType` text DEFAULT 'text' NOT NULL,
	`lastMessageAt` integer,
	`lastMessageSenderId` text,
	`lastMessageStatus` text DEFAULT 'sent' NOT NULL,
	`unreadCount` integer DEFAULT 0 NOT NULL,
	`isPinned` integer DEFAULT 0 NOT NULL,
	`isArchived` integer DEFAULT 0 NOT NULL,
	`isMuted` integer DEFAULT 0 NOT NULL,
	`mutedUntil` integer,
	`createdAt` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	`updatedAt` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`peerId`) REFERENCES `contacts`(`_id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `chats__id_unique` ON `chats` (`_id`);--> statement-breakpoint
CREATE INDEX `idx_chats_serverId` ON `chats` (`_id`);--> statement-breakpoint
CREATE INDEX `idx_chatsLastMessage` ON `chats` (`lastMessageAt`);--> statement-breakpoint
CREATE INDEX `idx_chatsPeer` ON `chats` (`peerId`) WHERE "chats"."isGroup" = 0;--> statement-breakpoint
CREATE INDEX `idx_chatsPinned` ON `chats` (`isPinned`);--> statement-breakpoint
CREATE INDEX `idx_chatsArchived` ON `chats` (`isArchived`);--> statement-breakpoint
CREATE TABLE `contacts` (
	`_id` text PRIMARY KEY NOT NULL,
	`phoneNumber` text NOT NULL,
	`countryCode` text,
	`countryISO` text,
	`displayName` text,
	`about` text,
	`profilePicture` text,
	`isRegistered` integer DEFAULT 0 NOT NULL,
	`isInMycontacts` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_phoneNumber_unique` ON `contacts` (`phoneNumber`);--> statement-breakpoint
CREATE INDEX `idx_contacts_phoneNumber` ON `contacts` (`phoneNumber`);--> statement-breakpoint
CREATE INDEX `idx_contacts_isRegistered` ON `contacts` (`isRegistered`);--> statement-breakpoint
CREATE INDEX `idx_contacts_isInMycontacts` ON `contacts` (`isInMycontacts`);--> statement-breakpoint
CREATE TABLE `files` (
	`clientFileId` text PRIMARY KEY NOT NULL,
	`_id` text,
	`onwerId` text NOT NULL,
	`type` text NOT NULL,
	`purpose` text,
	`resourceType` text,
	`secureUrl` text,
	`thumbnailUrl` text,
	`size` integer,
	`mimeType` text,
	`format` text,
	`width` integer,
	`height` integer,
	`duration` integer,
	`pages` integer,
	`metadata` text,
	`localUri` text,
	`thumbnailLocalUri` text,
	`downloaded` integer DEFAULT 0 NOT NULL,
	`downloadedAt` integer,
	`expiresAt` integer,
	`createdAt` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `files__id_unique` ON `files` (`_id`);--> statement-breakpoint
CREATE INDEX `idx_files_id` ON `files` (`_id`);--> statement-breakpoint
CREATE TABLE `messages` (
	`clientMessageId` text PRIMARY KEY NOT NULL,
	`_id` text,
	`chatId` text NOT NULL,
	`senderId` text NOT NULL,
	`receiverId` text,
	`type` text DEFAULT 'text' NOT NULL,
	`status` text DEFAULT 'sent' NOT NULL,
	`text` text,
	`fileId` text,
	`localFileUri` text,
	`latitude` text,
	`longitude` text,
	`locationName` text,
	`link` text,
	`replyToId` text,
	`isDeleted` integer DEFAULT 0 NOT NULL,
	`isEdited` integer DEFAULT 0 NOT NULL,
	`editedAt` integer,
	`isStarred` integer DEFAULT 0 NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`chatId`) REFERENCES `chats`(`clientChatId`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`fileId`) REFERENCES `files`(`clientFileId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `messages__id_unique` ON `messages` (`_id`);--> statement-breakpoint
CREATE INDEX `idx_messages_id` ON `messages` (`_id`);--> statement-breakpoint
CREATE INDEX `idx_messages_chat` ON `messages` (`chatId`);--> statement-breakpoint
CREATE INDEX `idx_messages_createdAt` ON `messages` (`createdAt`);--> statement-breakpoint
CREATE INDEX `idx_messages_status` ON `messages` (`status`);--> statement-breakpoint
CREATE TABLE `outbox` (
	`clientMessageId` text PRIMARY KEY NOT NULL,
	`chatId` text NOT NULL,
	`receiverId` text,
	`payload` text NOT NULL,
	`asset` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`lastError` text,
	`nextAttemptAt` integer,
	`createdAt` integer DEFAULT (strftime('%s', 'now') * 1000) NOT NULL,
	FOREIGN KEY (`chatId`) REFERENCES `chats`(`clientChatId`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sync_state` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text
);
