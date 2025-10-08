import { Entity } from "dexie";
import type { ProgressBarDB } from "../index";
import type { PerformedExercise } from "../types";

export class WorkoutSession extends Entity<ProgressBarDB> {
	id!: number; // Primary key
	programName!: string;
	workoutName!: string;
	completedAt!: Date;
	notes?: string;

	/**
	 * A snapshot array of the exercises as they were performed.
	 * It uses the PerformedExercise interface defined in the types.ts file.
	 */
	exercises!: PerformedExercise[];
}
