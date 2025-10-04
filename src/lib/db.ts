import Dexie, { type EntityTable } from 'dexie';

export interface ExerciseSet {
	weight?: number;
	percentage?: number;
	targetReps: number;
	completedReps?: number;
	notes?: string;
}

// e.g. for squat add 5lbs per workout
export interface Progression {
	type: "linear";
	increment: number;
	exerciseSlug: string;
}

// e.g. Squat
export interface Exercise {
	id?: number; 
	slug: string; 
	name: string;
	sets: ExerciseSet[]; 
	warmup?: boolean;
}

// e.g. Workout A  and Workout B
export interface Workout {
	id?: number;
	slug: string; 
	name: string;
	notes?: string;
	exerciseSlugs: string[]; 
}

// e.g. Radically simple strength
export interface Program {
	id: string;
	name: string;
	description?: string;
	workoutSlugs: string[]; 
	progression: Progression[];
	isPublic?: boolean;
}

export type WeightUnit = "lbs" | "kg";

export interface UserSettings {
	id: 'userSettings'; 
	name?: string;
	weightUnit: WeightUnit; // Changed to required/defaulted in migration
	barWeight: number;      // Changed to required/defaulted in migration
	availablePlates: number[];
}

export interface UserExerciseState {
	id?: number; // Dexie primary key
	exerciseSlug: string;
	currentWorkingWeight: number;
	programInstanceId: string;
}

export interface UserProgramInstance {
	id: string;
	programDefinitionId: string;
	userExerciseStateIds: number[]; 
	lastCompletedWorkoutSlug?: string;
	nextWorkoutSlug: string;
}

class WeightliftingDB extends Dexie {
    // Dexie EntityTable for type-safe interaction
    programs!: EntityTable<Program, 'id'>;
    workouts!: EntityTable<Workout, 'id'>;
    exercises!: EntityTable<Exercise, 'id'>;
    userSettings!: EntityTable<UserSettings, 'id'>;
    userExerciseStates!: EntityTable<UserExerciseState, 'id'>;
    userProgramInstances!: EntityTable<UserProgramInstance, 'id'>;
    
    constructor() {
        super('WeightliftingDB');
        this.version(1).stores({
            // &id: string primary key (unique), name: index, *workoutSlugs: multi-entry index
            programs: '&id, name, *workoutSlugs', 
            
            // ++id: auto-increment primary key, &slug: unique string index, *exerciseSlugs: multi-entry index
            workouts: '++id, &slug, *exerciseSlugs', 
            
            // ++id: auto-increment primary key, &slug: unique string index
            exercises: '++id, &slug', 
            
            // &id: string primary key ('userSettings' constant)
            userSettings: '&id', 
            
            // ++id: auto-increment primary key, exerciseSlug: index, programInstanceId: index
            userExerciseStates: '++id, exerciseSlug, programInstanceId', 
            
            // &id: string primary key, programDefinitionId: index
            userProgramInstances: '&id, programDefinitionId',
        });

        // Mimic Jazz migration by running initial data seeding
        this.on('ready', () => this.seedInitialData());
    }

    async seedInitialData() {
        // NOTE: Dexie's initial seeding needs to handle the creation 
        // of Program, Workout, and Exercise records, and link them via slugs.

        // Mimic Jazz's initial program loading (radicallySimpleStrength)
        if ((await this.programs.count()) === 0) {
            // This is where you would call a function to translate and insert
            // the `radicallySimpleStrength` JS object into the programs, workouts, 
            // and exercises tables.
            // Example: await insertRadicallySimpleStrengthData(); 

            // Dexie equivalent of Jazz's initial settings
             await this.userSettings.put({
                id: 'userSettings',
                weightUnit: "lbs",
                barWeight: 45,
                availablePlates: [45, 35, 25, 10, 5, 2.5]
            });
        }
    }
}

export const db = new WeightliftingDB();
