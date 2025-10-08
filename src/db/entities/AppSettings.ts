import { Entity } from "dexie";
import type { ProgressBarDB } from "../index";
import type { WeightUnit } from "../types";

export class AppSettings extends Entity<ProgressBarDB> {
	/**
	 * The primary key is a constant, known value. This ensures
	 * the table only ever has one row.
	 */
	id!: 1;

	// User Profile Properties
	userName!: string;

	// App Preference Properties
	weightUnit!: WeightUnit;
	barWeight!: number;

	// App State Properties
	activeProgramId!: number;
	nextWorkoutIndex!: number;
}

export const defaultAppSettings = {
			id: 1,
			userName: "New Lifter",
			weightUnit: "lbs",
			barWeight: 45,
			activeProgramId: 1,
			nextWorkoutIndex: 0, // Start with the first workout ("Workout A")
		} as const
