export const createProgram = (squatId: number, benchId: number, ohpId: number, deadliftId: number) =>  ( {
	name: "Radically Simple Strength",
	description:
	"A simple, effective program focusing on compound lifts with percentage-based warm-ups.",
	workouts: [
		{
			name: "Workout A",
			exercises: [
				{
					// Squat
					exerciseDefinitionId: squatId,
					sets: [
						{
							type: "percentage",
							value: 0.6,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.7,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.8,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.9,
							targetReps: 5,
							notes: "Warm-up",
						},
						{ type: "work", targetReps: 5 }, // The 100% working set
					],
				},
				{
					// Bench Press
					exerciseDefinitionId: benchId,
					sets: [
						{
							type: "percentage",
							value: 0.6,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.7,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.8,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.9,
							targetReps: 5,
							notes: "Warm-up",
						},
						{ type: "work", targetReps: 5 }, // The 100% working set
					],
				},
				{
					// Deadlift
					exerciseDefinitionId: deadliftId,
					sets: [
						{
							type: "percentage",
							value: 0.6,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.7,
							targetReps: 3,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.8,
							targetReps: 2,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.9,
							targetReps: 1,
							notes: "Warm-up",
						},
						{ type: "work", targetReps: 5 }, // The 100% working set
					],
				},
			],
		},
		{
			// --- WORKOUT B ---
			name: "Workout B",
			exercises: [
				{
					// Squat (re-used)
					exerciseDefinitionId: squatId,
					sets: [
						{
							type: "percentage",
							value: 0.6,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.7,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.8,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.9,
							targetReps: 5,
							notes: "Warm-up",
						},
						{ type: "work", targetReps: 5 },
					],
				},
				{
					// Overhead Press
					exerciseDefinitionId: ohpId,
					sets: [
						{
							type: "percentage",
							value: 0.6,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.7,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.8,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.9,
							targetReps: 5,
							notes: "Warm-up",
						},
						{ type: "work", targetReps: 5 },
					],
				},
				{
					// Deadlift (re-used)
					exerciseDefinitionId: deadliftId,
					sets: [
						{
							type: "percentage",
							value: 0.6,
							targetReps: 5,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.7,
							targetReps: 3,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.8,
							targetReps: 2,
							notes: "Warm-up",
						},
						{
							type: "percentage",
							value: 0.9,
							targetReps: 1,
							notes: "Warm-up",
						},
						{ type: "work", targetReps: 5 },
					],
				},
			],
		},
	]} )
