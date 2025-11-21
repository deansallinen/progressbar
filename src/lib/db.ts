import Dexie, { type EntityTable, } from "dexie";
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
				const oldProgram = program
				const newProgram = await createNoviceProgram()
				await db.programs.update(program.id, {...newProgram, workoutCount: oldProgram.workoutCount, nextWorkoutIndex: oldProgram.nextWorkoutIndex })
			}

			const exercises = await db.exercises.toArray()
			for (const exercise of exercises) {
				if (exercise.stalls) continue; // already migrated
				await db.exercises.update(exercise.id, {stalls: 0})
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
