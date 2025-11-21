import { db, type ActiveWorkout, type SetHistory, type WorkoutHistory } from "$lib/db";

export const saveWorkoutToHistory = async (workout: ActiveWorkout) => {
	if (!workout) throw new Error("No active workout");

	const history: WorkoutHistory = {
		programId: workout.programId,
		workoutIndex: workout.workoutIndex,
		completedAt: new Date(),
	};
	const historyId = await db.workoutHistory.add(history);
	if (!historyId) throw new Error("Failed to save workout history");

	const sets: SetHistory[] = [];
	for (const exercise of workout.exercises) {
		for (const set of exercise.sets) {
			if (set.completedReps && set.completedWeight && set.completedAt) {
				sets.push({
					workoutHistoryId: historyId,
					exerciseId: exercise.exerciseId,
					setIndex: set.setIndex,
					completedReps: set.completedReps,
					completedWeight: set.completedWeight,
					completedAt: set.completedAt,
				});
			}
		}
	}
	await db.recordedSets.bulkAdd(sets);

	await db.activeWorkout.delete(1);

	return history;
}
