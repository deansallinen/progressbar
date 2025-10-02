import { co, z, Group } from "jazz-tools";
import { radicallySimpleStrength } from "./programs/radicallySimpleStrength";

/**
 * A single set within an exercise.
 * This is the most basic unit of work tracked.
 */
export const ExerciseSet = co.map({
	weight: z.optional(z.number()),
	percentage: z.optional(z.number()),
	targetReps: z.number(),
	completedReps: z.optional(z.number()),
	notes: z.optional(z.string()),
});
export type ExerciseSet = co.loaded<typeof ExerciseSet>;

/**
 * An exercise, which consists of a name
 * and a list of sets to be performed.
 */
export const Exercise = co.map({
	slug: z.string(),
	name: z.string(),
	sets: co.list(ExerciseSet),
	warmup: z.optional(z.boolean()),
});
export type Exercise = co.loaded<typeof Exercise>;

/**
 * A workout session, which is a collection of exercises.
 */
export const Workout = co.map({
	slug: z.string(),
	name: z.string(),
	notes: z.optional(z.string()),
	exercises: co.list(Exercise),
});
export type Workout = co.loaded<typeof Workout>;

/**
 * A rule for progressing in a program.
 * For now, only linear progression is supported.
 */
export const Progression = co.map({
	type: z.literal("linear"),
	increment: z.number(),
	exerciseSlug: z.string(),
});
export type Progression = co.loaded<typeof Progression>;

/**
 * A training program, which is a structured collection of workouts.
 */
export const Program = co.map({
	name: z.string(),
	description: z.optional(z.string()),
	workouts: co.list(Workout),
	progression: co.list(Progression),
	isPublic: z.optional(z.boolean())
});
export type Program = co.loaded<typeof Program>;
export const ProgramTemplate = Program.partial();
export type ProgramTemplate = co.loaded<typeof ProgramTemplate>;

// PUBLIC
export const UserProfile = co.profile({
	name: z.string(),
});

export const WeightUnitSchema = z.literal(["lbs", "kg"]);
export type WeightUnit = z.infer<typeof WeightUnitSchema>;

export const Settings = co.map({
	weightUnit: z.optional(WeightUnitSchema),
	barWeight: z.optional(z.number()),
	availablePlates: co.list(z.number())
	// theme: z.optional(z.enum(["light", "dark"])),
});

export const UserExerciseState = co.map({
	exerciseSlug: z.string(),
	currentWorkingWeight: z.number(),
});
export type UserExerciseState = co.loaded<typeof UserExerciseState>;

export const UserProgramInstance = co.map({
	programDefinitionId: z.string(),
	exerciseStates: co.list(UserExerciseState),
	lastCompletedWorkoutSlug: z.optional(z.string()),
	nextWorkoutSlug: z.string(),
	// Could also track start date, etc.
});
export type UserProgramInstance = co.loaded<typeof UserProgramInstance>;

// PRIVATE
export const AccountRoot = co.map({
	programs: co.list(Program),
	activeProgram: co.optional(UserProgramInstance),
	settings: Settings,
});

export const JazzAccount = co
.account({
	profile: UserProfile,
	root: AccountRoot,
})
.withMigration(async (account, creationProps) => {
	// This migration runs automatically when a user creates their account.
	// It ensures that the necessary data structures are initialized.
	if (!account.$jazz.has("root")) {
		account.$jazz.set("root", {
			programs: co.list(Program).create([
				radicallySimpleStrength
			]), 
			activeProgram: undefined,
			settings: {
				weightUnit: "lbs",
				barWeight: 45,
				availablePlates: [45, 35, 25, 10, 5, 2.5]
			},
		});
	}

	if (!account.$jazz.has("profile")) {
		// When creating a new profile, we use our custom UserProfile schema
		const profile = UserProfile.create({
			name: creationProps?.name ?? "New Lifter",
		});
		// Make the profile public so others can see the name/bio
		profile.$jazz.owner.makePublic();
		account.$jazz.set("profile", profile);
	}

	// This new part handles existing accounts that might be missing 'programs'
	// First, we need to make sure the root object itself is loaded
	const { root } = await account.$jazz.ensureLoaded({
		resolve: { root: { programs: true, activeProgram: true, settings: true } },
	});

	if (root.programs === undefined) {
		root.$jazz.set("programs", []);
	}
	if (root.activeProgram === undefined) {
		root.$jazz.set("activeProgram", undefined);
	}
	if (root.settings === undefined) {
		root.$jazz.set("settings", Settings.create({
			weightUnit: "lbs",
			barWeight: 45, 
				availablePlates: [45, 35, 25, 10, 5, 2.5]
		}));
	}

});

