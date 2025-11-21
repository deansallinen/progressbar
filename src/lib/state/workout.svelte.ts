import { db } from "$lib/db";
import { calculateSetPercentage } from "$lib/functions";

export const updateActiveWorkoutSets = async (exerciseId: number, newWorkingWeight: number) => {
	const workout = await db.activeWorkout.get(1)
	if (!workout) return;

	const activeExercise = workout.exercises.find(e => e.exerciseId === exerciseId);
	if (!activeExercise) return;

	for (const set of activeExercise.sets) {
		// Only recalculate if the set hasn't been completed
		if (!set.completedAt) {
			set.targetWeight = calculateSetPercentage(set.initialPercentage, newWorkingWeight);
		}
	}

	await db.activeWorkout.put(workout);
}

