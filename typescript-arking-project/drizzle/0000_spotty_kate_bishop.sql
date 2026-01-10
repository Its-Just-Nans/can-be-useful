CREATE TABLE `client` (
	`idClient` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`password` text NOT NULL,
	`content` text NOT NULL,
	`payment` text NOT NULL,
	`isAdmin` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `parking` (
	`idParking` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`content` text NOT NULL,
	`schema` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `place` (
	`idPlace` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`time` integer NOT NULL,
	`plaque` text NOT NULL,
	`ip` text NOT NULL,
	`idParking` integer NOT NULL
);
