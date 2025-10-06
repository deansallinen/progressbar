const rssDefinitions = {
	squat: { name: "Squat", incrementWeight: 5 },
	bench: { name: "Bench Press", incrementWeight: 5 },
	deadlift: { name: "Deadlift", incrementWeight: 10 },
	ohp: { name: "Overhead Press", incrementWeight: 5 },
};

export const rssProgramTemplate = {
	name: "Radically Simple Strength",
	description: "A simple, effective program focusing on compound lifts with percentage-based warm-ups.",
	workouts: [
		{
			name: "Workout A",
			exercises: [
				{
					definition: rssDefinitions.squat, // Reference to the definition
					warmup: true,
					sets: [
						{ percentage: 0.6, targetReps: 5 },
						{ percentage: 0.7, targetReps: 5 },
						{ percentage: 0.8, targetReps: 5 },
						{ percentage: 0.9, targetReps: 5 },
						{ percentage: 1.0, targetReps: 5 },
					],
				},
				{
					definition: rssDefinitions.bench, // Reference
					warmup: true,
					sets: [
						{ percentage: 0.6, targetReps: 5 },
						{ percentage: 0.7, targetReps: 5 },
						{ percentage: 0.8, targetReps: 5 },
						{ percentage: 0.9, targetReps: 5 },
						{ percentage: 1.0, targetReps: 5 },
					],
				},
				{
					definition: rssDefinitions.deadlift, // Reference
					sets: [
						{ percentage: 0.6, targetReps: 5 },
						{ percentage: 0.7, targetReps: 3 },
						{ percentage: 0.8, targetReps: 2 },
						{ percentage: 0.9, targetReps: 1 },
						{ percentage: 1.0, targetReps: 5 },
					],
				},
			],
		},
		{
			name: "Workout B",
			exercises: [
				{
					definition: rssDefinitions.squat, // Reference (re-using the same definition)
					warmup: true,
					sets: [
						{ percentage: 0.6, targetReps: 5 },
						{ percentage: 0.7, targetReps: 5 },
						{ percentage: 0.8, targetReps: 5 },
						{ percentage: 0.9, targetReps: 5 },
						{ percentage: 1.0, targetReps: 5 },
					],
				},
				{
					definition: rssDefinitions.ohp, // Reference
					warmup: true,
					sets: [
						{ percentage: 0.6, targetReps: 5 },
						{ percentage: 0.7, targetReps: 5 },
						{ percentage: 0.8, targetReps: 5 },
						{ percentage: 0.9, targetReps: 5 },
						{ percentage: 1.0, targetReps: 5 },
					],
				},
				{
					definition: rssDefinitions.deadlift, // Reference (re-using the same definition)
					sets: [
						{ percentage: 0.6, targetReps: 5 },
						{ percentage: 0.7, targetReps: 3 },
						{ percentage: 0.8, targetReps: 2 },
						{ percentage: 0.9, targetReps: 1 },
						{ percentage: 1.0, targetReps: 5 },
					],
				},
			],
		},
	],
} as const;
