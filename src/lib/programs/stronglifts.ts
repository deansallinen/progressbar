export const strongLifts = {
	name: "StrongLifts 5x5",
	description:
	"StrongLifts 5x5 is a beginner strength program based on five compound exercises: Squat, Bench Press, Deadlift, Overhead Press, and Barbell Row.",
	workouts: [
		{
			slug: "workout-a",
			name: "Workout A",
			exercises: [
				{
					slug: "squat",
					name: "Squat",
					sets: [
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
					],
				},
				{
					slug: "bench-press",
					name: "Bench Press",
					sets: [
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
					],
				},
				{
					slug: "barbell-row",
					name: "Barbell Row",
					sets: [
						{ weight: 65, targetReps: 5 },
						{ weight: 65, targetReps: 5 },
						{ weight: 65, targetReps: 5 },
						{ weight: 65, targetReps: 5 },
						{ weight: 65, targetReps: 5 },
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
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
					],
				},
				{
					slug: "overhead-press",
					name: "Overhead Press",
					sets: [
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
						{ weight: 45, targetReps: 5 },
					],
				},
				{
					slug: "deadlift",
					name: "Deadlift",
					sets: [{ weight: 135, targetReps: 5 }],
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
			exerciseSlug: "barbell-row",
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
};
