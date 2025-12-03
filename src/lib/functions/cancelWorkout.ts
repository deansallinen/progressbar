import { db } from "$lib/db";
import { goto } from "$app/navigation";

export async function cancelWorkout() {
	await db.activeWorkout.delete(1);
	goto("/");
}