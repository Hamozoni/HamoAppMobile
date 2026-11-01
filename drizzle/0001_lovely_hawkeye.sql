PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_contacts` (
	`_id` text NOT NULL,
	`phoneNumber` text PRIMARY KEY NOT NULL,
	`countryCode` text,
	`countryISO` text,
	`displayName` text,
	`about` text,
	`profilePicture` text,
	`isRegistered` integer DEFAULT 0 NOT NULL,
	`isInMycontacts` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_contacts`("_id", "phoneNumber", "countryCode", "countryISO", "displayName", "about", "profilePicture", "isRegistered", "isInMycontacts") SELECT "_id", "phoneNumber", "countryCode", "countryISO", "displayName", "about", "profilePicture", "isRegistered", "isInMycontacts" FROM `contacts`;--> statement-breakpoint
DROP TABLE `contacts`;--> statement-breakpoint
ALTER TABLE `__new_contacts` RENAME TO `contacts`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `contacts__id_unique` ON `contacts` (`_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `contacts_phoneNumber_unique` ON `contacts` (`phoneNumber`);--> statement-breakpoint
CREATE INDEX `idx_contacts_id` ON `contacts` (`_id`);--> statement-breakpoint
CREATE INDEX `idx_contacts_isRegistered` ON `contacts` (`isRegistered`);--> statement-breakpoint
CREATE INDEX `idx_contacts_isInMycontacts` ON `contacts` (`isInMycontacts`);