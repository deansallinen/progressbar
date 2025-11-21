import { type ActiveSet, type TemplateSet, type ActiveExercise, type TemplateExercise, db, type UserExercise, } from "$lib/db";

function setMeetsProgressionCriteria({completedReps}: ActiveSet, {minReps}: TemplateSet): boolean {
	if (!completedReps) return false;
	return completedReps >= minReps;
}


function allSetsMeetProgressionCriteria(activeExercise: ActiveExercise, templateExercise: TemplateExercise): boolean {
	return activeExercise.sets.every((set, index) =>
		setMeetsProgressionCriteria(set, templateExercise.sets[index])
	);
}

function shouldIncrementExercise(activeExercise: ActiveExercise, templateExercise: TemplateExercise): boolean {
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
	const newWeight = exercise.workingWeight * 0.9
	const existingResets = exercise.resets || 0
	await db.exercises.update(exercise.id!, { workingWeight: newWeight, stalls: 0, resets: existingResets + 1});
}

export async function progressExercise(activeExercise: ActiveExercise, templateExercise: TemplateExercise) {
	const userExercise = await db.exercises.get(activeExercise.exerciseId)
	if (!userExercise) throw new Error('exercise not found')

	if (shouldIncrementExercise(activeExercise, templateExercise)) {
		// if working set met target reps, increment weight and reset stall counter
		const newWeight = userExercise.workingWeight + userExercise.incrementWeight 
		await db.exercises.update(userExercise.id!, { workingWeight: newWeight, stalls: 0 });
		return 
	} else {
		// if target not met, stay at current weight and increment stall counter
		await db.exercises.update(userExercise.id!, { stalls: userExercise.stalls++ });
	}

	if (userExercise.stalls >= 2) {
		resetExercise(userExercise)
	} 
}
