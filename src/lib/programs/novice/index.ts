import { db, type TemplateProgram } from "$lib/db";
import { insertExercise } from "$lib/functions/insertExercise";
import { phase1 } from "./phase-1";
import { phase2 } from "./phase-2";
import { phase3 } from "./phase-3";

 export async function createNoviceProgram() {
	const squatId = await insertExercise({
		name: "Squat",
		incrementWeight: 5,
		workingWeight: 45,
		goalWeight: 315,
		stalls: 0
	})
	if (!squatId) throw new Error("could not add squat exercise")

	const benchId =  await insertExercise({
		name: "Bench Press",
		incrementWeight: 5,
		workingWeight: 45,
		goalWeight: 225,
		stalls: 0
	})
	if (!benchId) throw new Error("could not add bench exercise")

	const deadliftId =  await insertExercise({
		name: "Deadlift",
		incrementWeight: 5,
		workingWeight: 45,
		goalWeight: 405,
		stalls: 0
	})
	if (!deadliftId) throw new Error("could not add deadlift exercise")

	const ohpId =  await insertExercise({
		name: "Overhead Press",
		incrementWeight: 5,
		workingWeight: 45,
		goalWeight: 135,
		stalls: 0
	})
	if (!ohpId) throw new Error("could not add ohp exercise")

	const chinupId = await insertExercise({
		name: "Chin-up",
		incrementWeight: 2.5,
		workingWeight: 0,
		stalls: 0
	})

	if (!chinupId) throw new Error("could not add chinup exercise")

	const lteId = await insertExercise({
		name: "Lying Tricep Extensions",
		incrementWeight: 2.5,
		workingWeight: 0,
		stalls: 0
	})
	if (!lteId) throw new Error("could not add lte exercise")

	const curlsId = await insertExercise({
		name: "Curls",
		incrementWeight: 2.5,
		workingWeight: 0,
		stalls: 0
	})
	if (!curlsId) throw new Error("could not add curls")

	const noviceProgram = {
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
	const noviceProgram = await createNoviceProgram()
	const id = await db.programs.add(noviceProgram)
	await db.settings.update(1, {activeProgramId: id})
	return { id, ...noviceProgram } as TemplateProgram
}
