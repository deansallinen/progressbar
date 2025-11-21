import { db, type ActiveExercise, type ActiveSet, type ActiveWorkout } from "$lib/db";
import { getActiveProgram } from "$lib/state/program.svelte";
import { calculateSetWeight } from "./calculateSetWeight";
import { getSmallestWeight } from "./getSmallestWeight";

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

	const smallestWeight = await getSmallestWeight()

	for (const templateExercise of workoutTemplate.exercises) {
		const userExercise = allUserExercises.find(e => e.id === templateExercise.exerciseId);

		if (!userExercise) {
			throw new Error(`Exercise with ID ${templateExercise.exerciseId} not found.`);
		}

		let activeSets: ActiveSet[] = templateExercise.sets.map((set, index) => { 
			// if the exercise is in a reset, the working set is AMRAP a.k.a. Infinity
			const targetReps = userExercise.resets && set.targetPercentage === 1.0 ? Infinity : set.targetReps;
			const targetWeight = calculateSetWeight(set, userExercise, smallestWeight)

			return {
				setIndex: index,
				targetReps, 
				targetWeight,
				initialPercentage: set.targetPercentage || 1
			} 
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
	return newActiveWorkout;
}
