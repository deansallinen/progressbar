import { db } from "$lib/db";
import { calculateSetPercentage } from "./calculateSetPercentage";
import { getSmallestWeight } from "./getSmallestWeight";

export const updateActiveWorkoutSets = async (exerciseId: number, newWorkingWeight: number) => {
	console.log('updating active workout sets')
	const workout = await db.activeWorkout.get(1)
	if (!workout) return;

	const activeExercise = workout.exercises.find(e => e.exerciseId === exerciseId);
	if (!activeExercise) return;

	const smallestWeight = await getSmallestWeight()

	for (const set of activeExercise.sets) {
		// Only recalculate if the set hasn't been completed
		if (!set.completedAt) {
			set.targetWeight = calculateSetPercentage(set.initialPercentage, newWorkingWeight, smallestWeight);
			console.log(set.targetWeight)
		}
	}

	await db.activeWorkout.put(workout);
}

