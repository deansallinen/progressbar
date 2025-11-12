import { goto } from "$app/navigation";
import { db, type ActiveExercise, type ActiveSet, type ActiveWorkout, type TemplateSet, type UserExercise, type WorkoutHistory, type SetHistory  } from "$lib/db";
import { getActiveProgram } from "./program.svelte";
import { liveQuery } from "dexie";
import { resolve } from "$app/paths";

export const activeWorkoutStore = liveQuery(() => db.activeWorkout.get(1));

export const calculateSetPercentage = (percentage: number, weight: number) => {
			return Math.round((percentage * weight) / 5) * 5
}

export function calculateSetWeight(
	set: TemplateSet,
	exercise: UserExercise,
): number {
	if (set.targetWeight) return set.targetWeight;
	if (set.targetPercentage) {
		return calculateSetPercentage(set.targetPercentage, exercise.workingWeight);
	}
	throw new Error("Unable to calculate weight");
}

export const createActiveWorkout = async () => {
	const existingActiveWorkout = await db.activeWorkout.get(1); 
	if (existingActiveWorkout) {
		console.log("Existing workout.");
		return;
	}

	// No existing workout, check for an active program to start a new one
	const program = await getActiveProgram();
	if (!program) {
		// No active program, so there's no workout to start
		console.log("no program")
		return undefined;
	}

	const currentPhase = program.phases[program.currentPhaseIndex];
	const workoutTemplate = currentPhase.workouts[program.nextWorkoutIndex];
	if (!workoutTemplate) {
		throw new Error(`Workout index ${program.nextWorkoutIndex} not found in phase ${currentPhase.name} of program ${program.name}`);
	}

	const activeExercises: ActiveExercise[] = [];
	const allUserExercises = await db.exercises.toArray();

	for (const templateExercise of workoutTemplate.exercises) {
		const userExercise = allUserExercises.find(e => e.id === templateExercise.exerciseId);

		if (!userExercise) {
			throw new Error(`Exercise with ID ${templateExercise.exerciseId} not found.`);
		}

		const activeSets: ActiveSet[] = templateExercise.sets.map((set, index) => ({
			setIndex: index,
			targetReps: set.targetReps || 0, // Assume 0 if not defined, or adjust logic
			targetWeight: calculateSetWeight(set, userExercise),
			initialPercentage: set.targetPercentage || 1
		}));

		activeExercises.push({
			exerciseId: userExercise.id!,
			name: userExercise.name, 
			sets: activeSets,
		});
	}

	const newActiveWorkout: ActiveWorkout = {
		id: 1, // Singleton ID
		createdAt: new Date(),
		updatedAt: new Date(),
		programId: program.id!,
		workoutIndex: program.nextWorkoutIndex,
		name: workoutTemplate.name,
		exercises: activeExercises,
	};

	await db.activeWorkout.put(newActiveWorkout);
	await db.programs.update(program.id, {workoutCount: program.workoutCount + 1})

	console.log("Started new workout and saved to ActiveWorkout table.");
	return newActiveWorkout;
}

export const getWorkoutSnapshot = async () => await db.activeWorkout.get(1)

export const updateActiveWorkoutSets = async (exerciseId: number, newWorkingWeight: number) => {
	const workout = await getWorkoutSnapshot();
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

export const completeWorkout = async () => {
	const activeWorkout = await getWorkoutSnapshot();
	if (!activeWorkout) throw new Error("No active workout to complete");

	// Progression logic: Update working weight for all exercises in the completed workout
	for (const activeExercise of activeWorkout.exercises) {
		const userExercise = await db.exercises.get(activeExercise.exerciseId);
		if (userExercise) {
			const newWeight = userExercise.workingWeight + userExercise.incrementWeight;
			await db.exercises.update(userExercise.id!, { workingWeight: newWeight });
		}
	}

	const workout = await saveActiveWorkoutToHistory();

	// Set the next workout index on the program
	const program = await db.programs.get(workout.programId)
	if (!program) throw new Error('workout program not found')
	const currentPhase = program.phases[program.currentPhaseIndex];
	const nextWorkoutIndex = (workout.workoutIndex + 1) % currentPhase.workouts.length;
	const newPhaseWorkoutCount = program.phaseWorkoutCount + 1;
	let updates: any = { nextWorkoutIndex, workoutCount: program.workoutCount + 1, phaseWorkoutCount: newPhaseWorkoutCount };
	if (newPhaseWorkoutCount >= currentPhase.duration) {
		updates.currentPhaseIndex = program.currentPhaseIndex + 1;
		updates.phaseWorkoutCount = 0;
		updates.nextWorkoutIndex = 0;
	}
	await db.programs.update(workout.programId, updates)

	goto(resolve('/'))
} 

export const completeSet = async (exerciseIndex: number, setIndex: number, reps: number) => {
	const workout = await getWorkoutSnapshot();
	if (!workout) throw new Error("No active workout");

	const exercise = workout.exercises[exerciseIndex];
	if (!exercise) throw new Error("Exercise not found");

	const set = exercise.sets[setIndex];
	if (!set) throw new Error("Set not found");

	set.completedReps = reps;
	set.completedWeight = set.targetWeight;
	set.completedAt = new Date();

	await db.activeWorkout.put(workout);
}

export const saveActiveWorkoutToHistory = async () => {
	const workout = await getWorkoutSnapshot();
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
