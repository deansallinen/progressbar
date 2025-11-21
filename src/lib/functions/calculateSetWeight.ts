import type { TemplateSet, UserExercise } from "$lib/db";
import { calculateSetPercentage } from "$lib/functions";

export function calculateSetWeight(
	set: TemplateSet,
	exercise: UserExercise,
	smallestWeight: number
) {
	if (set.targetWeight) return set.targetWeight;
	if (set.targetPercentage) {
		return calculateSetPercentage(set.targetPercentage, exercise.workingWeight, smallestWeight);
	}
	return 0
}
