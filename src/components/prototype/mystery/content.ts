/**
 * The shared copy deck for The Mystery prototypes.
 * Every variant speaks from this deck so facts and language stay identical.
 * Final app is bilingual ES/EN; prototypes are EN only.
 */

export const EVENT = {
	parents: "Nancy & Francisco",
	baby: "the baby",
	caseNumber: "CASE No. 2026-1010",
	dateLong: "Saturday, October 10, 2026",
	time: "5:00 PM",
	timeRange: "5:00 - 8:00 PM",
	city: "Hoschton, GA",
	// Reveal-only facts (never shown before confirmation)
	venue: "Provisions Boutique",
	address: "60 E Jefferson St Ste A, Hoschton, GA 30548",
	mapsUrl: "https://maps.app.goo.gl/C36KF6Vh7rPCbdss6",
	dressCode: "Wear your theory: pink if you say girl, blue if you say boy.",
	registryNote:
		"Your presence is the gift. If you would still like to bring something, here is our registry.",
	registryUrl: "#registry-to-be-confirmed",
} as const;

export interface Witness {
	id: number;
	name: string;
	role: string;
	detail: string;
}

export const WITNESSES: readonly Witness[] = [
	{
		id: 1,
		name: "The Doctor",
		role: "Witness No. 1",
		detail:
			"Discovered the secret during a routine visit and sealed it inside the Secret Envelope.",
	},
	{
		id: 2,
		name: "The Balloon Store",
		role: "Witness No. 2",
		detail:
			"Opened the envelope, chose the confetti color, and passed the answer on in code.",
	},
	{
		id: 3,
		name: "The Cake Shop",
		role: "Witness No. 3",
		detail:
			"Decoded the message and chose the cake filling. The secret is now baked in.",
	},
] as const;

export interface StoryBeat {
	kicker: string;
	title: string;
	body: string;
}

export const STORY_BEATS: readonly StoryBeat[] = [
	{
		kicker: EVENT.caseNumber,
		title: "There is a case to solve",
		body: "A tiny person is on the way, and one question has everyone talking: what is the gender of Nancy and Francisco’s baby?",
	},
	{
		kicker: "The mystery",
		title: "Girl or boy?",
		body: "Nobody is saying. Not even the parents-to-be know: the answer was sealed away the moment it was discovered.",
	},
	{
		kicker: "The witnesses",
		title: "Only three know the truth",
		body: "The doctor sealed the Secret Envelope. The balloon store chose the confetti. The cake shop chose the filling. No one else knows a thing.",
	},
	{
		kicker: "The reveal",
		title: "The answer comes out at the party",
		body: "One balloon. One cake. One live reveal on October 10. Until then, the secret stays sealed.",
	},
	{
		kicker: "Your assignment",
		title: "Help us crack the case",
		body: `Join the investigation on ${EVENT.dateLong} at ${EVENT.time} in ${EVENT.city}. Study the clues, question the cake, and file your theory.`,
	},
] as const;

export const COPY = {
	rsvpKicker: "Your assignment",
	rsvpTitle: "File your RSVP",
	nameLabel: "Your full name",
	namePlaceholder: "Maria Garcia",
	attendingLabel: "Will you be there?",
	attendingYes: "Yes, I will be there",
	attendingNo: "I cannot make it",
	partySizeLabel: "How many are coming?",
	partySizeOptions: ["Just me", "Me + 1", "Me + 2", "Me + 3"] as const,
	theoryLabel: "Your theory (optional)",
	theoryGirl: "Girl",
	theoryBoy: "Boy",
	submit: "File my RSVP",
	update: "Update my RSVP",
	submitting: "Filing…",
	errorGeneric: "Something went wrong. Please try again.",
	alreadyConfirmedTitle: "You are already on the case",
	alreadyConfirmedBody:
		"We found an RSVP under this name. This is your current response.",
	changeRsvp: "Change my RSVP",
	retrievalLink: "Already confirmed?",
	retrievalLabel: "Enter the name you confirmed with",
	retrievalSubmit: "Find my RSVP",
	retrievalNotFound:
		"We could not find that name. Check the spelling, or file a new RSVP above.",
	declinedTitle: "We will miss you",
	declinedBody:
		"Thank you for your answer. The case will be solved without you, but we will think of you at the reveal.",
	revealKicker: "Case unlocked",
	revealTitle: "Thank you, detective",
	revealBody:
		"Your RSVP is filed. Here is everything you need for the big day.",
	venueLabel: "The scene",
	dateLabel: "Date",
	timeLabel: "Time",
	addressLabel: "Address",
	openInMaps: "Open in Google Maps",
	mapPlaceholder: "Embedded Google Map goes here",
	dressCodeLabel: "Dress code",
	registryLabel: "Gifts",
	registryCta: "View the registry",
} as const;

export const ASSETS = {
	hero: "/assets/couple-portrait-768.webp",
	secondary: "/assets/secondary-landscape-1024.webp",
	ultrasound: "/assets/baby-ultrasound-384.webp",
	venueExterior: "/assets/venue-exterior-640.webp",
	venueInterior: "/assets/venue-interior-640.webp",
} as const;
