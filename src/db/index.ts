import Dexie, { type EntityTable } from "dexie";
import { ExerciseDefinition } from "./entities/ExerciseDefinition";
import { Program } from "./entities/Program";
import { WorkoutSession } from "./entities/WorkoutSession";
import { AppSettings, defaultAppSettings } from "./entities/AppSettings";
import type { WorkoutTemplate } from "./types";
import { createProgram } from "$lib/programs/radicallySimpleStrength";

export class ProgressBarDB extends Dexie {
	exerciseDefinitions!: EntityTable<ExerciseDefinition, "id">;
	programs!: EntityTable<Program, "id">;
	workoutSessions!: EntityTable<WorkoutSession, "id">;
	appSettings!: EntityTable<AppSettings, "id">;

	constructor() {
		super("ProgressBarDB");

		this.version(1).stores({
			exerciseDefinitions: "++id, &name", // '++id' for auto-incrementing, '&name' for unique name
			programs: "++id, name",
			workoutSessions: "++id, completedAt", // Index 'completedAt' for fast history sorting
			appSettings: "id", // Primary key is the static number 1
		});

		this.exerciseDefinitions.mapToClass(ExerciseDefinition);
		this.programs.mapToClass(Program);
		this.workoutSessions.mapToClass(WorkoutSession);
		this.appSettings.mapToClass(AppSettings);

		this.on("populate", () => this.populate());
	}

	/**
	 * Seeds the database with initial default data. This method is called
	 * automatically by the 'populate' event handler.
	 */
	async populate() {
		console.log("Database is being created. Seeding with initial data...");

		await this.appSettings.add(defaultAppSettings);

		// 1. Create the master Exercise Definitions
		const [squatId, benchId, deadliftId, ohpId] = await Promise.all([
			this.exerciseDefinitions.add({
				name: "Squat",
				incrementWeight: 5,
				workingWeight: 45,
			}),
			this.exerciseDefinitions.add({
				name: "Bench Press",
				incrementWeight: 5,
				workingWeight: 45,
			}),
			this.exerciseDefinitions.add({
				name: "Deadlift",
				incrementWeight: 10,
				workingWeight: 45,
			}),
			this.exerciseDefinitions.add({
				name: "Overhead Press",
				incrementWeight: 5,
				workingWeight: 45,
			}),
		]);

		const defaultProgramId = await this.programs.add(createProgram(squatId, benchId, ohpId, deadliftId));

		this.appSettings.update(1, {activeProgramId: defaultProgramId})

		console.log("Database seeded successfully.");
	}
}

export const db = new ProgressBarDB();

export * from "./entities/ExerciseDefinition";
export * from "./entities/Program";
export * from "./entities/WorkoutSession";
export * from "./entities/AppSettings";
export * from "./types";
