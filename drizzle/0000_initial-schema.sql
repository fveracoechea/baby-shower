CREATE TABLE `invitations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`guest_name` text NOT NULL,
	`phone_number` text NOT NULL,
	`additional_guest_allowance` integer NOT NULL,
	`created_at` integer NOT NULL,
	CONSTRAINT "invitations_additional_guest_allowance_range" CHECK("invitations"."additional_guest_allowance" between 0 and 3)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `invitations_phone_number_unique` ON `invitations` (`phone_number`);--> statement-breakpoint
CREATE TABLE `rsvps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`invitation_id` integer NOT NULL,
	`attending` integer NOT NULL,
	`additional_guest_count` integer DEFAULT 0 NOT NULL,
	`theory` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`invitation_id`) REFERENCES `invitations`(`id`) ON UPDATE no action ON DELETE cascade,
	CONSTRAINT "rsvps_attending_boolean" CHECK("rsvps"."attending" in (0, 1)),
	CONSTRAINT "rsvps_additional_guest_count_range" CHECK("rsvps"."additional_guest_count" between 0 and 3),
	CONSTRAINT "rsvps_declined_without_additional_guests" CHECK("rsvps"."attending" = 1 or "rsvps"."additional_guest_count" = 0),
	CONSTRAINT "rsvps_theory_values" CHECK("rsvps"."theory" is null or "rsvps"."theory" in ('girl', 'boy'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rsvps_invitation_id_unique` ON `rsvps` (`invitation_id`);