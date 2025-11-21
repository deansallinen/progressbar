import { db } from "$lib/db";

export async function getSmallestWeight() {
	const settings = await db.settings.get(1)
	if (!settings) throw new Error('settings not found when calculating percentage')

	const weights = settings.availablePlates
	const smallestWeight = weights.length > 0 ? Math.min(...weights) : 2.5;
	return smallestWeight
}
