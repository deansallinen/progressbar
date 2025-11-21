import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { db } from "$lib/db";
import { progressExercise } from "./progressExercise";
import { saveWorkoutToHistory } from "./saveWorkoutToHistory";

export const completeWorkout = async () => {
	const activeWorkout = await db.activeWorkout.get(1);
	if (!activeWorkout) throw new Error("No active workout to complete");

	const savedWorkout = await saveWorkoutToHistory(activeWorkout);

	// Update working weights based on progression
	const program = await db.programs.get(activeWorkout.programId);
	if (!program) throw new Error('workout program not found');
	const currentPhase = program.phases[program.currentPhaseIndex];
	const templateWorkout = currentPhase.workouts[activeWorkout.workoutIndex];

	for (const activeExercise of activeWorkout.exercises) {
		const templateExercise = templateWorkout.exercises.find(e => e.exerciseId === activeExercise.exerciseId);
		if (!templateExercise) continue;
		progressExercise(activeExercise, templateExercise)
	}

	// Set the next workout index on the program

	// const nextWorkoutIndex = (savedWorkout.workoutIndex + 1) % currentPhase.workouts.length;
	// const newPhaseWorkoutCount = program.phaseWorkoutCount + 1;

	let updates: any = { nextWorkoutIndex, workoutCount: program.workoutCount + 1, phaseWorkoutCount: newPhaseWorkoutCount };
	if (newPhaseWorkoutCount >= currentPhase.duration) {
		updates.currentPhaseIndex = program.currentPhaseIndex + 1;
		updates.phaseWorkoutCount = 0;
		updates.nextWorkoutIndex = 0;
	}
	await db.programs.update(savedWorkout.programId, updates)

	goto(resolve('/'))
} 

