import Dexie, { type EntityTable, } from "dexie";

export interface TemplateProgram {
	id: number;
	name: string;
	description?: string;
	phases: TemplatePhase[];
	currentPhaseIndex: number;
	nextWorkoutIndex: number;
	workoutCount: number;
	phaseWorkoutCount: number;
}

export interface TemplatePhase {
	name: string;
	duration: number;
	workouts: TemplateWorkout[];
}

export interface TemplateWorkout {
	name: string;
	exercises: TemplateExercise[]
}

export interface TemplateExercise {
	exerciseId: number; // index
	sets: TemplateSet[]
}

export interface TemplateSet {
	targetReps?: number;
	targetWeight?: number;
	targetPercentage?: number;
}

export interface UserExercise {
	id?:number;
	name: string;
	workingWeight: number;
	goalWeight: number;
	incrementWeight: number;
}

export interface ActiveWorkout {
	id: number; // fixed
	programId: number; 
	workoutIndex: number; 
	name: string;
	createdAt: Date;
	updatedAt: Date;
	exercises: ActiveExercise[];
}

export interface ActiveExercise {
	exerciseId: number; // Links to UserExercise
	name: string; // Denormalized for convenience
	sets: ActiveSet[];
}

export interface ActiveSet {
	setIndex: number;
	targetReps: number;
	targetWeight: number; // Calculated weight for this set
	initialPercentage: number; // for recalculating weight
	completedReps?: number; // Reps actually done
	completedWeight?: number; // Weight actually used
	completedAt?: Date;
}

export interface WorkoutHistory {
	id?: number;
	programId: number;
	workoutIndex: number;
	completedAt?: Date;
}

export interface SetHistory {
	id?: number;
	workoutHistoryId: number;
	exerciseId: number;
	setIndex: number;
	completedReps: number;
	completedWeight: number;
	completedAt: Date;
}

export interface UserSettings {
	id?: number;
	userName?: string;
	userWeight?: number;
	activeProgramId?: number;
	weightUnit?: string;
	barWeight: number;
	availablePlates: number[];
}

export class ProgressBarDB extends Dexie {
	programs!: EntityTable<TemplateProgram, "id">;
	exercises!: EntityTable<UserExercise, "id">;
	settings!: EntityTable<UserSettings, "id">;
	activeWorkout!: EntityTable<ActiveWorkout, "id">; 
	recordedSets!: EntityTable<SetHistory, "id">
	workoutHistory!: EntityTable<WorkoutHistory, "id">

	constructor() {
		super("ProgressBarDB");

		this.version(1).stores({
			exercises: "++id, &name", // '++id' for auto-incrementing, '&name' for unique name
			programs: "++id, &name",
			settings: "id", // singleton table
			activeWorkout: "id", // singleton table
			workoutHistory: "++id, programId",
			recordedSets: "++id, exerciseId, workoutHistoryId"
		});

		// Setting workoutCount for users with existing workouts
		this.version(2).upgrade(async () => {
			const programs = await db.programs.toArray();
			for (const program of programs) {
				const count = await db.workoutHistory.where('programId').equals(program.id).count();
				await db.programs.update(program.id, { workoutCount: count });
			}
		});

		this.version(3).upgrade(async () => {
			const programs = await db.programs.toArray();
			for (const program of programs) {
				if (program.phases) continue; // already migrated
				// Assume old program has workouts
				const oldProgram = program as any;
				if (oldProgram.workouts) {
					await db.programs.update(program.id, {
						phases: [{ name: "Phase 1", duration: 1000, workouts: oldProgram.workouts }],
						currentPhaseIndex: 0,
						phaseWorkoutCount: 0
					});
				}
			}
		});

		this.on("populate", () => this.populate());
	}

	/**
	 * Seeds the database with initial default data. This method is called
	 * automatically by the 'populate' event handler.
	 */
	async populate() {
		console.log("Database is being created. Seeding with initial data...");

		const [squatId, benchId, deadliftId, ohpId] = await Promise.all([
			this.exercises.add({
				name: "Squat",
				incrementWeight: 5,
				workingWeight: 45,
				goalWeight: 315
			}),
			this.exercises.add({
				name: "Bench Press",
				incrementWeight: 5,
				workingWeight: 45,
				goalWeight: 225
			}),
			this.exercises.add({
				name: "Deadlift",
				incrementWeight: 10,
				workingWeight: 45,
				goalWeight: 405
			}),
			this.exercises.add({
				name: "Overhead Press",
				incrementWeight: 5,
				workingWeight: 45,
				goalWeight: 135
			}),
		]);
		console.log("added exercises")

		if (!squatId || !benchId || !deadliftId || !ohpId) {
			throw new Error("Couldn't seed exercises")
		}

		const workoutA = {
			name: "Workout A",
			exercises: [
				{
					exerciseId: squatId,
					sets: [
						{ targetPercentage: 0.6, targetReps: 5, },
						{ targetPercentage: 0.7, targetReps: 5, },
						{ targetPercentage: 0.8, targetReps: 5, },
						{ targetPercentage: 0.9, targetReps: 5, },
						{ targetPercentage: 1.0, targetReps: 5 }, 
					],
				},
				{
					exerciseId: benchId,
					sets: [
						{ targetPercentage: 0.6, targetReps: 5, },
						{ targetPercentage: 0.7, targetReps: 5, },
						{ targetPercentage: 0.8, targetReps: 5, },
						{ targetPercentage: 0.9, targetReps: 5, },
						{ targetPercentage: 1.0, targetReps: 5 }, 
					],
				},
				{
					exerciseId: deadliftId,
					sets: [
						{ targetPercentage: 0.6, targetReps: 5, },
						{ targetPercentage: 0.7, targetReps: 3, },
						{ targetPercentage: 0.8, targetReps: 2, },
						{ targetPercentage: 0.9, targetReps: 1, },
						{ targetPercentage: 1.0, targetReps: 5 }, 
					],
				},
			],

		}

		const workoutB = {
			name: "Workout B",
			exercises: [
				{
					exerciseId: squatId,
					sets: [
						{ targetPercentage: 0.6, targetReps: 5, },
						{ targetPercentage: 0.7, targetReps: 5, },
						{ targetPercentage: 0.8, targetReps: 5, },
						{ targetPercentage: 0.9, targetReps: 5, },
						{ targetPercentage: 1.0, targetReps: 5 },
					],
				},
				{
					exerciseId: ohpId,
					sets: [
						{ targetPercentage: 0.6, targetReps: 5, },
						{ targetPercentage: 0.7, targetReps: 5, },
						{ targetPercentage: 0.8, targetReps: 5, },
						{ targetPercentage: 0.9, targetReps: 5, },
						{ targetPercentage: 1.0, targetReps: 5 },
					],
				},
				{
					exerciseId: deadliftId,
					sets: [
						{ targetPercentage: 0.6, targetReps: 5, },
						{ targetPercentage: 0.7, targetReps: 3, },
						{ targetPercentage: 0.8, targetReps: 2, },
						{ targetPercentage: 0.9, targetReps: 1, },
						{ targetPercentage: 1.0, targetReps: 5 },
					],
				},
			],
		}

		const defaultProgram = await this.programs.add({name: 'Radically Simple Strength',
			description: "A simple, effective program focusing on compound lifts with percentage-based warm-ups.",
			phases: [
				{ name: "Phase 1", duration: 12, workouts: [workoutA, workoutB] },
				{ name: "Phase 2", duration: 12, workouts: [workoutA, workoutB] },
				{ name: "Phase 3", duration: 0, workouts: [workoutA, workoutB] },
			],
			currentPhaseIndex: 0,
			nextWorkoutIndex: 0,
			workoutCount: 0,
			phaseWorkoutCount: 0
		});
		console.log('Added program', defaultProgram)

		const defaultSettings = await this.settings.add({ id: 1, barWeight: 45, availablePlates: [45, 25, 10, 5, 2.5] })
		console.log('Added settings', defaultSettings)

		console.log("Database seeded successfully.");
	}
}

export const db = new ProgressBarDB();
