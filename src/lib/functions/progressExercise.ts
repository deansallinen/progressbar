import { type ActiveSet, type TemplateSet, type ActiveExercise, type TemplateExercise, db, type UserExercise, } from "$lib/db";
import { calculateSetPercentage } from "./calculateSetPercentage";
import { getSmallestWeight } from "./getSmallestWeight";

function setMeetsProgressionCriteria({completedReps}: ActiveSet, {minReps}: TemplateSet): boolean {
	if (!completedReps) return false;
	return completedReps >= minReps;
}


function allSetsMeetProgressionCriteria(activeExercise: ActiveExercise, templateExercise: TemplateExercise): boolean {
	return activeExercise.sets.every((set, index) =>
		setMeetsProgressionCriteria(set, templateExercise.sets[index])
	);
}

function shouldIncrementWeight(activeExercise: ActiveExercise, templateExercise: TemplateExercise): boolean {
	if (templateExercise.progressionType === 'linear') {
		// Linear increases if working set meets rep target
		const workingSet = activeExercise.sets.find(s => s.initialPercentage === 1.0)
		if (!workingSet) throw new Error('linear exercises should have a initialPercentage')

		const templateTargetSet = templateExercise.sets.find(s => s.targetPercentage === 1.0)
		if (!templateTargetSet) throw new Error('linear exercises should have a targetPercentage')

		return setMeetsProgressionCriteria(workingSet, templateTargetSet)
	} else if (templateExercise.progressionType === 'rep_based') {
		return allSetsMeetProgressionCriteria(activeExercise, templateExercise);
	}
	return false;
}

async function resetExercise(exercise: UserExercise) {
	const smallestWeight = await getSmallestWeight()
	const newWeight = calculateSetPercentage(0.9, exercise.workingWeight, smallestWeight)
	const existingResets = exercise.resets || 0
	await db.exercises.update(exercise.id!, { workingWeight: newWeight, stalls: 0, resets: existingResets + 1});
}

export async function progressExercise(activeExercise: ActiveExercise, templateExercise: TemplateExercise) {
	const userExercise = await db.exercises.get(activeExercise.exerciseId)
	if (!userExercise) throw new Error('exercise not found')

	if (shouldIncrementWeight(activeExercise, templateExercise)) {
		// if working set met target reps, increment weight and reset stall counter
		console.log(`should increment weight for ${activeExercise.name}`)
		const newWeight = userExercise.workingWeight + userExercise.incrementWeight 
		await db.exercises.update(userExercise.id!, { workingWeight: newWeight, stalls: 0 });
		return 
	} else {
		// if target not met, stay at current weight and increment stall counter
		const newStalls = userExercise.stalls + 1
		console.log(`stalled for ${activeExercise.name} with ${newStalls} stalls`)
		await db.exercises.update(userExercise.id!, { stalls: newStalls });
	}

	if (userExercise.stalls >= 2) {
		console.log(`resetting for ${activeExercise.name}`)
		resetExercise(userExercise)
	} 
}
