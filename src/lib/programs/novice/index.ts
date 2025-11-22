import { db, type TemplateProgram } from "$lib/db";
import { insertExercise } from "$lib/functions/insertExercise";
import { phase1 } from "./phase-1";
import { phase2 } from "./phase-2";
import { phase3 } from "./phase-3";

export const noviceExercises = [
	{ name: "Squat", incrementWeight: 5, workingWeight: 45, goalWeight: 315, stalls: 0 },
	{ name: "Bench Press", incrementWeight: 5, workingWeight: 45, goalWeight: 225, stalls: 0 },
	{ name: "Deadlift", incrementWeight: 5, workingWeight: 45, goalWeight: 405, stalls: 0 },
	{ name: "Overhead Press", incrementWeight: 5, workingWeight: 45, goalWeight: 135, stalls: 0 },
	{ name: "Chin-up", incrementWeight: 2.5, workingWeight: 0, stalls: 0 },
	{ name: "Lying Tricep Extensions", incrementWeight: 2.5, workingWeight: 0, stalls: 0 },
	{ name: "Curls", incrementWeight: 2.5, workingWeight: 0, stalls: 0 }
];

export const createNoviceProgram = (getId: (name: string) => number | undefined) => {
	const getExerciseId = (name: string) => {
		const id = getId(name);
		if (id === undefined) throw new Error(`Exercise ID not found for: ${name}`);
		return id;
	};

	const squatId = getExerciseId("Squat");
	const benchId = getExerciseId("Bench Press");
	const deadliftId = getExerciseId("Deadlift");
	const ohpId = getExerciseId("Overhead Press");
	const chinupId = getExerciseId("Chin-up");
	const lteId = getExerciseId("Lying Tricep Extensions");
	const curlsId = getExerciseId("Curls");

	const noviceProgram = {
		id: 1,
		name: 'Radically Simple Strength - Novice',
		description: "A simple, effective program focusing on compound lifts with percentage-based warm-ups.",
		phases: [
			phase1(squatId, benchId, deadliftId, ohpId),
			phase2(squatId, benchId, deadliftId, ohpId, chinupId),
			phase3(squatId, benchId, deadliftId, ohpId, chinupId, curlsId, lteId),
		],
		currentPhaseIndex: 0,
		nextWorkoutIndex: 0,
		workoutCount: 0,
		phaseWorkoutCount: 0
	};
	return noviceProgram
}

export const startNoviceProgram = async () => {
	const exerciseIds = new Map<string, number>();

	for (const exercise of noviceExercises) {
		const id = await insertExercise(exercise);
		if (!id) throw new Error(`Could not add ${exercise.name}`);
		exerciseIds.set(exercise.name, id);
	}

	const noviceProgram = createNoviceProgram((name) => exerciseIds.get(name))
	const id = await db.programs.add(noviceProgram)
	await db.settings.update(1, {activeProgramId: id})
	return { ...noviceProgram, id } as TemplateProgram
}
