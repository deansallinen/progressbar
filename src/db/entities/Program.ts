import { Entity } from "dexie";
import type { ProgressBarDB } from "../index";
import type { WorkoutTemplate } from "../types";

export class Program extends Entity<ProgressBarDB> {
	id!: number; // Primary key
	name!: string;
	description?: string;

	/**
	 * An array of workout blueprints. It uses the WorkoutTemplate interface
	 * defined in the types.ts file.
	 */
	workouts!: WorkoutTemplate[];
}
