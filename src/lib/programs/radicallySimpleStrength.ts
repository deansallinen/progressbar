export const radicallySimpleStrength = {
	name: "Radically Simple Strength",
	description:
	"A simple, effective program focusing on compound lifts with percentage-based warm-ups.",
	workouts: [
		{
			id: "workout-a",
			name: "Workout A",
			exercises: [
				{
					id: "squat",
					name: "Squat",
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
					id: "bench-press",
					name: "Bench Press",
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
					id: "deadlift",
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
			id: "workout-b",
			name: "Workout B",
			exercises: [
				{
					id: "squat",
					name: "Squat",
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
					id: "overhead-press",
					name: "Overhead Press",
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
					id: "deadlift",
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
			exerciseId: "squat",
		},
		{
			type: "linear",
			increment: 5,
			exerciseId: "bench-press",
		},
		{
			type: "linear",
			increment: 5,
			exerciseId: "overhead-press",
		},
		{
			type: "linear",
			increment: 10,
			exerciseId: "deadlift",
		},
	],
} as const
