import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { db } from "$lib/db";
import { setNextWorkout, type PhaseTransition } from "./setNextWorkout";
import { progressExercise } from "./progressExercise";
import { saveWorkoutToHistory } from "./saveWorkoutToHistory";

// Store phase transition info to display on home page
let pendingPhaseTransition: PhaseTransition | null = null;

export const getPendingPhaseTransition = (): PhaseTransition | null => {
	const transition = pendingPhaseTransition;
	pendingPhaseTransition = null; // Clear after reading
	return transition;
}

export const completeWorkout = async () => {
	console.log('completing workout')
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

	const phaseTransition = await setNextWorkout(program, savedWorkout)
	if (phaseTransition?.occurred) {
		pendingPhaseTransition = phaseTransition;
	}

	goto(resolve('/'))
} 

