import { db, type ActiveExercise, type ActiveSet, type ActiveWorkout } from "$lib/db";
import { getActiveProgram } from "$lib/state/program.svelte";
import { calculateSetWeight } from "./calculateSetWeight";
import { getSmallestWeight } from "./getSmallestWeight";
import { handleLayoff, type LayoffInfo } from "./handleLayoff";

export interface CreateWorkoutResult {
	workout: ActiveWorkout | undefined;
	layoffInfo: LayoffInfo | null;
}

export const createActiveWorkout = async (): Promise<CreateWorkoutResult | undefined> => {
	const existingActiveWorkout = await db.activeWorkout.get(1); 
	if (existingActiveWorkout) {
		console.log("Existing workout.");
		return { workout: existingActiveWorkout, layoffInfo: null };
	}

	// No existing workout, check for an active program to start a new one
	const program = await getActiveProgram();
	if (!program) {
		// No active program, so there's no workout to start
		console.log("no program")
		return undefined;
	}

	// Check for layoff and apply any necessary weight adjustments
	// This must happen BEFORE we calculate set weights
	const layoffInfo = await handleLayoff();

	const currentPhase = program.phases[program.currentPhaseIndex];
	const workoutTemplate = currentPhase.workouts[program.nextWorkoutIndex];
	if (!workoutTemplate) {
		throw new Error(`Workout index ${program.nextWorkoutIndex} not found in phase ${currentPhase.name} of program ${program.name}`);
	}

	const activeExercises: ActiveExercise[] = [];
	const allUserExercises = await db.exercises.toArray();

	const smallestWeight = await getSmallestWeight()

	for (const templateExercise of workoutTemplate.exercises) {
		const userExercise = allUserExercises.find(e => e.id === templateExercise.exerciseId);

		if (!userExercise) {
			throw new Error(`Exercise with ID ${templateExercise.exerciseId} not found.`);
		}

		let activeSets: ActiveSet[] = [];

		// Add warmup set if warmup is enabled for this exercise
		if (templateExercise.warmup) {
			const settings = await db.settings.get(1);
			const barWeight = settings?.barWeight || 45; // Default to 45lbs if not set

			activeSets.push({
				setIndex: -1, // Special index for warmup set
				minReps: 0, // No minimum for warmup
				targetReps: 10, // 10 reps as mentioned in the book
				targetWeight: barWeight,
				initialPercentage: 0, // Not a percentage-based set
			});
		}

		// Add the regular sets
		templateExercise.sets.forEach((set, index) => {
			// if the exercise is in a reset, the working set is AMRAP a.k.a. Infinity
			const targetReps = userExercise.resets && set.targetPercentage === 1.0 ? Infinity : set.targetReps;
			const targetWeight = calculateSetWeight(set, userExercise, smallestWeight)

			activeSets.push({
				setIndex: index,
				minReps: set.minReps,
				targetReps,
				targetWeight,
				initialPercentage: set.targetPercentage || 1
			});
		});

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
	return { workout: newActiveWorkout, layoffInfo };
}
