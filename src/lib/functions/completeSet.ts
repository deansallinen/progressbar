import { db } from "$lib/db";

export const completeSet = async (exerciseIndex: number, setIndex: number, reps: number, completedWeight?: number) => {
	const workout = await db.activeWorkout.get(1);
	if (!workout) throw new Error("No active workout");

	const exercise = workout.exercises[exerciseIndex];
	if (!exercise) throw new Error("Exercise not found");

	const set = exercise.sets[setIndex];
	if (!set) throw new Error("Set not found");

	set.completedReps = reps;
	set.completedWeight = completedWeight || set.targetWeight;
	set.completedAt = new Date();

	await db.activeWorkout.put(workout);
}

export const updateCompletedReps = async (exerciseIndex: number, setIndex: number, reps: number) => {
	const workout = await db.activeWorkout.get(1);
	if (!workout) throw new Error("No active workout");

	const exercise = workout.exercises[exerciseIndex];
	if (!exercise) throw new Error("Exercise not found");

	const set = exercise.sets[setIndex];
	if (!set) throw new Error("Set not found");

	set.completedReps = reps;

	await db.activeWorkout.put(workout);
}

