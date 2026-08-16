type Derivative = {
	source: string;
	destination: string;
	width: number;
};

export {};

const derivatives: Derivative[] = [
	{
		source: "assets/primary-portraid.jpg",
		destination: "public/assets/couple-portrait-384.webp",
		width: 384,
	},
	{
		source: "assets/primary-portraid.jpg",
		destination: "public/assets/couple-portrait-768.webp",
		width: 768,
	},
	{
		source: "assets/secondary-landscape.jpeg",
		destination: "public/assets/secondary-landscape-512.webp",
		width: 512,
	},
	{
		source: "assets/secondary-landscape.jpeg",
		destination: "public/assets/secondary-landscape-1024.webp",
		width: 1024,
	},
	{
		source: "assets/baby-first-ultrasound.JPG",
		destination: "public/assets/baby-ultrasound-384.webp",
		width: 384,
	},
	{
		source: "assets/venue-exterior.jpg",
		destination: "public/assets/venue-exterior-640.webp",
		width: 640,
	},
	{
		source: "assets/venue-interior.jpg",
		destination: "public/assets/venue-interior-640.webp",
		width: 640,
	},
];

for (const { source, destination, width } of derivatives) {
	await Bun.file(source)
		.image()
		.resize(width, undefined, { filter: "lanczos3", withoutEnlargement: true })
		.webp({ quality: 82 })
		.write(destination);
}
