export const strongLifts = {
	name: "StrongLifts 5x5",
	description:
	"StrongLifts 5x5 is a beginner strength program based on five compound exercises: Squat, Bench Press, Deadlift, Overhead Press, and Barbell Row.",
	workouts: [
		{
			id: "workout-a",
			name: "Workout A",
			exercises: [
				{
					id: "squat",
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
					id: "bench-press",
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
					id: "barbell-row",
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
			id: "workout-b",
			name: "Workout B",
			exercises: [
				{
					id: "squat",
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
					id: "overhead-press",
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
					id: "deadlift",
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
			exerciseId: "barbell-row",
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
};
