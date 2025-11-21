import type { TemplateSet, UserExercise } from "$lib/db";
import { calculateSetPercentage } from "$lib/functions";

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
