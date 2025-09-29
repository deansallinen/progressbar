import { co, z } from "jazz-tools";

/**
 * A single set within an exercise.
 * This is the most basic unit of work tracked.
 */
export const ExerciseSet = co.map({
	// The weight used for this set (e.g., in lbs or kg)
	weight: z.number(),
	// The target number of repetitions for this set
	targetReps: z.number(),
	// The actual number of repetitions completed by the user.
	// This is optional because it's filled in during the workout.
	completedReps: z.optional(z.number()),
	// Optional notes for this specific set
	notes: z.optional(z.string()),
});

/**
 * An exercise, which consists of a name
 * and a list of sets to be performed.
 */
export const Exercise = co.map({
	// The name of the exercise, e.g., "Squat", "Bench Press"
	name: z.string(),
	// A collaborative list of sets for this exercise.
	sets: co.list(ExerciseSet),
});

/**
 * A workout session, which is a collection of exercises.
 */
export const Workout = co.map({
	// The name of the workout, e.g., "Leg Day", "Push Day"
	name: z.string(),
	// Optional notes for the entire workout session
	notes: z.optional(z.string()),
	// A collaborative list of exercises for this workout.
	exercises: co.list(Exercise),
});

/**
 * A training program, which is a structured collection of workouts.
 */
export const Program = co.map({
	// The name of the program, e.g., "Starting Strength", "5/3/1"
	name: z.string(),
	// An optional description of the program's goals or structure.
	description: z.optional(z.string()),
	// A collaborative list of workouts that make up this program.
	workouts: co.list(Workout),
});

/** The account profile is an app-specific per-user public `CoMap`
 *  where you can store top-level objects for that user */
export const UserProfile = co.profile({
	name: z.string(),

	// Add public fields here
	//
});

const WeightUnitSchema = z.literal(["lbs", "kg"]);
export const WeightUnit = z.infer<typeof WeightUnitSchema>;

export const Settings = co.map({
	weightUnit: z.optional(WeightUnitSchema),
	// You can easily add more settings here in the future!
	// theme: z.optional(z.enum(["light", "dark"])),
});

/** The account root is an app-specific per-user PRIVATE `CoMap`
 *  where you can store top-level objects for that user */
export const AccountRoot = co.map({
	programs: co.list(Program),
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
				programs: [], // Initialize with an empty list of programs
				settings: {
					weightUnit: "lbs",
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
			resolve: { root: true },
		});

		// Now, we can safely check if the 'programs' field is missing on the loaded root
		// We check for `undefined` because a field that is simply not loaded yet would be `null`.
		// `undefined` means the field truly doesn't exist in the data.
		if (root.programs === undefined) {
			root.$jazz.set("programs", []);
		}
		// If the 'settings' map itself doesn't exist, create it.
		if (root.settings === undefined) {
			// We create a new instance of the Settings CoMap and set it on the root.
			root.$jazz.set("settings", Settings.create({ weightUnit: "lbs" }));
		}
	});
