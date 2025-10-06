import { co, z, } from "jazz-tools";
import { rssProgramTemplate } from "./programs/radicallySimpleStrength";

// A single set performed during a workout session.
export const ExerciseSet = co.map({
	weight: z.optional(z.number()),
	percentage: z.optional(z.number()),
	targetReps: z.number(),
	completedReps: z.optional(z.number()),
	completedAt: z.optional(z.date()),
	notes: z.optional(z.string()),
});
export type ExerciseSet = co.loaded<typeof ExerciseSet>;

// The central definition of an exercise (e.g., Squat). Progress is stored here.
export const ExerciseDefinition = co.map({
	name: z.string(),
	incrementWeight: z.number(),
	workingWeight: z.optional(z.number()),
	goalWeight: z.optional(z.number())
});
export type ExerciseDefinition = co.loaded<typeof ExerciseDefinition>;

// An exercise as part of a workout *template*. Defines sets, reps, etc. for that workout.
export const WorkoutExercise = co.map({
	definition: ExerciseDefinition, // Link to the central definition
	sets: co.list(ExerciseSet), // The sets to be performed
	warmup: z.optional(z.boolean()),
	notes: z.optional(z.string()), // Notes for this exercise within the workout
});
export type WorkoutExercise = co.loaded<typeof WorkoutExercise>;

// A workout *template* (e.g., Workout A).
export const Workout = co.map({
	name: z.string(),
	notes: z.optional(z.string()),
	exercises: co.list(WorkoutExercise),
});
export type Workout = co.loaded<typeof Workout>;

// A historical record of a completed workout.
export const WorkoutSession = co.map({
    workout: Workout, // Reference to the workout template performed
    exercises: co.list(WorkoutExercise), // A snapshot of the exercises as performed
    completedAt: z.date(),
    notes: z.optional(z.string())
});
export type WorkoutSession = co.loaded<typeof WorkoutSession>;

// A training program, which is a collection of workout templates.
export const Program = co.map({
	name: z.string(),
	description: z.optional(z.string()),
	isPublic: z.optional(z.boolean()),
	workouts: co.list(Workout),
});
export type Program = co.loaded<typeof Program>;


// PUBLIC SINGLETON: A catalog of publicly available programs.
export const ProgramCatalog = co.map({
    name: z.literal("Public Program Catalog"),
	programs: co.list(Program),
});
export type ProgramCatalog = co.loaded<typeof ProgramCatalog>;
export const PUBLIC_CATALOG_ID = 'public-program-catalog'

export const WeightUnitSchema = z.literal(["lbs", "kg"]);
export type WeightUnit = z.infer<typeof WeightUnitSchema>;

export const Settings = co.map({
	weightUnit: z.optional(WeightUnitSchema),
	barWeight: z.optional(z.number()),
	availablePlates: co.list(z.number())
});

// PUBLIC
export const UserProfile = co.profile({
	name: z.string(),
	templates: co.optional(co.list(Program))
});


// PRIVATE
export const AccountRoot = co.map({
	// Central library of all exercises for this user
	exerciseDefinitions: co.list(ExerciseDefinition),
	// The user's personal collection of programs (copied from catalog or created)
	programs: co.list(Program),
	activeProgram: co.optional(Program),
	// Historical log of all completed workouts
	workoutHistory: co.list(WorkoutSession),
	settings: Settings,
});

export const JazzAccount = co
.account({
	profile: UserProfile,
	root: AccountRoot,
})
.withMigration(async (account, creationProps) => {
	// SECTION 1: NEW USER INITIALIZATION
	// This block runs ONLY when a user creates their account for the very first time.
	if (!account.$jazz.has("root")) {
		console.log("Running migration for new user: Initializing with default program.");

		// 1. Create the central ExerciseDefinition CoValues from our template.
		const squatDef = ExerciseDefinition.create({ name: "Squat", incrementWeight: 5 });
		const benchDef = ExerciseDefinition.create({ name: "Bench Press", incrementWeight: 5 });
		const deadliftDef = ExerciseDefinition.create({ name: "Deadlift", incrementWeight: 10 });
		const ohpDef = ExerciseDefinition.create({ name: "Overhead Press", incrementWeight: 5 });
		
		// Create a map for easy lookup.
		const definitionMap: {[key:string]: ExerciseDefinition} = {
			"Squat": squatDef,
			"Bench Press": benchDef,
			"Deadlift": deadliftDef,
			"Overhead Press": ohpDef,
		} ;

		// 2. Prepare the program data, replacing plain JS definitions with our new CoValue instances.
		const programDataForCreate = {
			...rssProgramTemplate,
			workouts: rssProgramTemplate.workouts.map(workout => ({
				...workout,
				exercises: workout.exercises.map(exercise => ({
					...exercise,
					// This is the crucial step: link to the actual CoValue.
					definition: definitionMap[exercise.definition.name],
				}))
			}))
		};

		// 3. Create the Program CoValue. Jazz will handle creating all the nested
		// Workout and WorkoutExercise CoValues for you.
		const defaultProgram = Program.create(programDataForCreate);
		console.log("Running migration for new user: Initializing AccountRoot.");
		
		// Create all necessary structures for a new user.
		account.$jazz.set("root", {
			exerciseDefinitions: [squatDef, benchDef, deadliftDef, ohpDef],
			programs: [defaultProgram], 
			activeProgram: defaultProgram, // Set it as active by default!
			workoutHistory: [],
			settings: {
				weightUnit: "lbs",
				barWeight: 45,
				availablePlates: [45, 35, 25, 10, 5, 2.5]
			}
		});
	}

	// This block initializes the user's public profile on creation.
	if (!account.$jazz.has("profile")) {
		const profile = UserProfile.create({
			name: creationProps?.name ?? "New Lifter",
		});
		profile.$jazz.owner.makePublic();
		account.$jazz.set("profile", profile);
	}

	// SECTION 2: EXISTING USER PATCHING
	// This block runs for EVERY user on login, including new ones after the above blocks.
	// Its purpose is to add new fields to accounts that were created before the schema changed.
	
	// First, we ensure all top-level fields of the root are loaded.
	const { root } = await account.$jazz.ensureLoaded({
		resolve: { root: true },
	});

	// For each field, check if it's undefined (meaning it doesn't exist on this user's account)
	// and set it to a default empty state if so. This is non-destructive.

	if (root.programs === undefined) {
		console.log("Patching existing user: adding 'programs'.");
		root.$jazz.set("programs", co.list(Program).create([]));
	}
	if (root.settings === undefined) {
		console.log("Patching existing user: adding 'settings'.");
		root.$jazz.set("settings", Settings.create({
			weightUnit: "lbs",
			barWeight: 45, 
			availablePlates: co.list(z.number()).create([45, 35, 25, 10, 5, 2.5])
		}));
	}
	if (root.exerciseDefinitions === undefined) {
		console.log("Patching existing user: adding 'exerciseDefinitions'.");
		root.$jazz.set("exerciseDefinitions", co.list(ExerciseDefinition).create([]));
	}
	if (root.workoutHistory === undefined) {
		console.log("Patching existing user: adding 'workoutHistory'.");
		root.$jazz.set("workoutHistory", co.list(WorkoutSession).create([]));
	}
});
