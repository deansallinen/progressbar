import Dexie, { type EntityTable, type Transaction, } from "dexie";
import { createNoviceProgram } from "./programs/novice";

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
	progressionType: 'linear' | 'rep_based' ;
}

export interface TemplateSet {
	targetReps: number;
	targetWeight?: number;
	targetPercentage?: number;
	minReps: number;
}

export interface UserExercise {
	id?:number;
	name: string;
	workingWeight: number;
	goalWeight?: number;
	incrementWeight: number;
	note?: string;
	resets?: number;
	stalls: number;
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
	minReps: number;
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
		this.version(2).upgrade(async (trans) => {
			const programs = await trans.table("programs").toArray();
			const historyTable = trans.table("workoutHistory");
			for (const program of programs) {
				const count = await historyTable.where('programId').equals(program.id).count();
				await trans.table('programs').update(program.id, { workoutCount: count });
			}
		});

		this.version(3).upgrade(async (trans) => {
			await migrateExercises(trans)
			await migratePrograms(trans)
		});

		this.on("populate", () => this.populate());
	}

	/**
	 * Seeds the database with initial default data. This method is called
	 * automatically by the 'populate' event handler.
	 */
	async populate() {
		const defaultSettings = await this.settings.add({ id: 1, barWeight: 45, availablePlates: [45, 25, 10, 5, 2.5] })
		console.log('Added settings', defaultSettings)

		console.log("Database seeded successfully.");
	}
}

	async function migrateExercises(trans: Transaction) {
		await trans.table("exercises").toCollection().modify(exercise => {
			if (exercise.stalls === undefined) exercise.stalls = 0;
			if (exercise.resets === undefined) exercise.resets = 0;
		});
	}

	async function migratePrograms(trans: Transaction) {
		await trans.table("programs").toCollection().modify(program => {
			if (program.phases) return; 

			const oldWorkouts = program.workouts || [];
			
			// 1. Transform old workouts to match new TemplateWorkout interface
			// (Adding progressionType to exercises, minReps to sets)
			const newWorkouts = oldWorkouts.map((w: any) => ({
				name: w.name,
				exercises: (w.exercises || []).map((e: any) => ({
					exerciseId: e.exerciseId,
					progressionType: 'linear', // Default for existing data
					sets: (e.sets || []).map((s: any) => ({
						...s,
						// Ensure targetReps exists (default to 5 if missing from old data)
						targetReps: s.targetReps ?? 5, 
						// Default minReps to targetReps for existing linear programs
						minReps: s.targetReps ?? 5 
					}))
				}))
			}));

			// 2. Create the Phase structure
			// We wrap the existing workouts into a single "Linear Phase"
			program.phases = [{
				name: "Phase 1", // Generic name or "Linear Progression"
				duration: 0, // 0 implies indefinite/until stall
				workouts: newWorkouts
			}];

			// 3. Set new root properties
			program.currentPhaseIndex = 0;
			// Initialize phaseWorkoutCount based on total count, or 0 if you want to track phase specific progress
			program.phaseWorkoutCount = 0; 

			// 4. Remove old root properties that are no longer in the interface
			delete program.workouts;
		});
	}


export const db = new ProgressBarDB();
