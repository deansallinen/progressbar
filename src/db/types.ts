import type { ExerciseDefinition } from "./entities/ExerciseDefinition";

export type WeightUnit = "lbs" | "kg";

interface BaseSetTemplate {
	targetReps: number | "AMRAP"; // Allow for "As Many Reps As Possible" sets
	notes?: string;
}

/**
 * A "work" set, calculated as 100% of the exercise's workingWeight.
 */
export type WorkSetTemplate = BaseSetTemplate & {
	type: "work";
};

/**
 * A set calculated as a percentage of the exercise's workingWeight.
 * Example: A warm-up set at 60% of your working weight.
 */
export type PercentageSetTemplate = BaseSetTemplate & {
	type: "percentage";
	value: number; // The percentage, e.g., 0.6 for 60%
};

/**
 * A set with a specific, pre-defined weight.
 * Useful for accessory exercises or movements without a "workingWeight".
 * Example: Bicep curls at a fixed 25 lbs.
 */
export type FixedWeightSetTemplate = BaseSetTemplate & {
	type: "fixed";
	weight: number;
};

export type SetTemplate =
	| WorkSetTemplate
	| PercentageSetTemplate
	| FixedWeightSetTemplate;

/**
 * Describes a single exercise within a workout's blueprint.
 * This is stored inside the 'workouts' array of a Program.
 */
export interface ExerciseTemplate {
	exerciseDefinitionId: number;
	sets: SetTemplate[];
	notes?: string;
}

/**
 * Describes the blueprint for a single workout (e.g., "Workout A").
 * This is stored inside the 'workouts' array of a Program.
 */
export interface WorkoutTemplate {
	name: string;
	exercises: ExerciseTemplate[];
}

// --- INTERFACES FOR WORKOUT SESSION LOGS ---

/**
 * A snapshot of a single set as it was performed.
 * This is stored inside the 'exercises' array of a WorkoutSession.
 */
export interface PerformedSet {
	weightUsed: number;
	completedReps: number;
}

/**
 * A snapshot of a single exercise as it was performed.
 * This is stored inside the 'exercises' array of a WorkoutSession.
 */
export interface PerformedExercise {
	exerciseDefinitionId: number; // Foreign key to the ExerciseDefinition table
	exerciseName: string; // Denormalized name for easy display in history
	sets: PerformedSet[];
}

/**
 * Represents a single set in an active workout. It holds the calculated
 * target weight and the user's input.
 */
export interface ActiveSet {
  template: SetTemplate;       // The original blueprint for the set
  targetWeight: number;        // The calculated weight for this set
  completedReps: number | null; // User's input, starts as null
  isComplete: boolean;
}

/**
 * Represents an exercise within the active workout, "hydrated" with
 * its full definition and an array of active sets.
 */
export interface ActiveExercise {
  definition: ExerciseDefinition; // The full ExerciseDefinition object
  sets: ActiveSet[];
}

/**
 * Represents the entire state of the workout currently in progress.
 */
export interface ActiveWorkout {
  programName: string;
  workoutName: string;
  exercises: ActiveExercise[];
  startedAt: Date;
}
