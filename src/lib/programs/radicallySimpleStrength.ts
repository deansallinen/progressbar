export const radicallySimpleStrength = {
	name: "Radically Simple Strength",
	description:
	"A simple, effective program focusing on compound lifts with percentage-based warm-ups.",
	workouts: [
		{
			slug: "workout-a",
			name: "Workout A",
			exercises: [
				{
					slug: "squat",
					name: "Squat",
					sets: [
						{ percentage: 0.6, targetReps: 5 },
						{ percentage: 0.7, targetReps: 5 },
						{ percentage: 0.8, targetReps: 5 },
						{ percentage: 0.9, targetReps: 5 },
						{ percentage: 1.0, targetReps: 5 },
					],
				},
				{
					slug: "bench-press",
					name: "Bench Press",
					sets: [
						{ percentage: 0.6, targetReps: 5 },
						{ percentage: 0.7, targetReps: 5 },
						{ percentage: 0.8, targetReps: 5 },
						{ percentage: 0.9, targetReps: 5 },
						{ percentage: 1.0, targetReps: 5 },
					],
				},
				{
					slug: "deadlift",
					name: "Deadlift",
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
			slug: "workout-b",
			name: "Workout B",
			exercises: [
				{
					slug: "squat",
					name: "Squat",
					sets: [
						{ percentage: 0.6, targetReps: 5 },
						{ percentage: 0.7, targetReps: 5 },
						{ percentage: 0.8, targetReps: 5 },
						{ percentage: 0.9, targetReps: 5 },
						{ percentage: 1.0, targetReps: 5 },
					],
				},
				{
					slug: "overhead-press",
					name: "Overhead Press",
					sets: [
						{ percentage: 0.6, targetReps: 5 },
						{ percentage: 0.7, targetReps: 5 },
						{ percentage: 0.8, targetReps: 5 },
						{ percentage: 0.9, targetReps: 5 },
						{ percentage: 1.0, targetReps: 5 },
					],
				},
				{
					slug: "deadlift",
					name: "Deadlift",
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
	progression: [
		{
			type: "linear",
			increment: 5,
			exerciseSlug: "squat",
		},
		{
			type: "linear",
			increment: 5,
			exerciseSlug: "bench-press",
		},
		{
			type: "linear",
			increment: 5,
			exerciseSlug: "overhead-press",
		},
		{
			type: "linear",
			increment: 10,
			exerciseSlug: "deadlift",
		},
	],
} as const
