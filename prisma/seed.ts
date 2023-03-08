import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
	const email = "sigbjorn.berdal14@gmail.com";

	// cleanup the existing database
	await prisma.user.delete({ where: { email } }).catch(() => {
		// no worries if it doesn't exist yet
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const hashedPassword = await bcrypt.hash("test_passord", 10);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const user = await prisma.user.create({
		data: {
			email,
			password: {},
		},
	});

	console.log(`prisma/seed.ts (async function seed()): Database has been seeded. 🌱`);
}

seed()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
