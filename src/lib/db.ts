import Dexie, { type EntityTable } from "dexie";
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
			// 1. Prepare ID lookup for the factory
			const exercises = await trans.table("exercises").toArray();
			const getId = (name: string) => exercises.find(e => e.name === name)?.id;

			// 2. Batch update exercises
			await trans.table("exercises").toCollection().modify(ex => {
				ex.stalls = ex.stalls ?? 0;
				ex.resets = ex.resets ?? 0;
				ex.note = ex.note ?? "";
			});

			// 3. Generate template WITHOUT global DB access
			const newNoviceTemplate = createNoviceProgram(getId);

			// 4. Migrate Programs using PUT to replace structure
			const programs = await trans.table("programs").toArray();
			for (const oldProgram of programs) {
				if (oldProgram.phases) continue; // Already migrated

				const migratedProgram = {
					...newNoviceTemplate,
					id: oldProgram.id,
					workoutCount: oldProgram.workoutCount ?? 0,
					nextWorkoutIndex: oldProgram.nextWorkoutIndex ?? 0,
					currentPhaseIndex: 0,
					phaseWorkoutCount: 0,
				};

				await trans.table("programs").put(migratedProgram);
			}
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

export const db = new ProgressBarDB();
