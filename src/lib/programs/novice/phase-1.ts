import { type TemplatePhase } from "$lib/db"

export const phase1 = (squatId:number, benchId:number, deadliftId:number, ohpId:number): TemplatePhase => {

	return ({
	name: 'Phase 1',
	duration: 12,
	workouts: [{
		name: "Workout A",
		exercises: [
			{
				exerciseId: squatId,
				progressionType: 'linear',
				sets: [
					{ targetPercentage: 0.6,  minReps: 5, targetReps: 5 },
					{ targetPercentage: 0.7,  minReps: 5, targetReps: 5 },
					{ targetPercentage: 0.8,  minReps: 5, targetReps: 5 },
					{ targetPercentage: 0.9,  minReps: 5, targetReps: 5 },
					{ targetPercentage: 1.0,  minReps: 5, targetReps: 5 },
				],
			},
			{
				exerciseId: benchId,
				progressionType: 'linear',
				sets: [
					{ targetPercentage: 0.6,  minReps: 5, targetReps: 5 },
					{ targetPercentage: 0.7,  minReps: 5, targetReps: 5 },
					{ targetPercentage: 0.8,  minReps: 5, targetReps: 5 },
					{ targetPercentage: 0.9,  minReps: 5, targetReps: 5 },
					{ targetPercentage: 1.0,  minReps: 5, targetReps: 5 },
				],
			},
			{
				exerciseId: deadliftId,
				progressionType: 'linear',
				sets: [
					{ targetPercentage: 0.6,  minReps: 5, targetReps: 5 },
					{ targetPercentage: 0.7,  minReps: 3, targetReps: 3 },
					{ targetPercentage: 0.8,  minReps: 2, targetReps: 2 },
					{ targetPercentage: 0.9,  minReps: 1, targetReps: 1 },
					{ targetPercentage: 1.0,  minReps: 5, targetReps: 5 },
				],
			},
		],
	},
		{
			name: "Workout B",
			exercises: [
				{
					exerciseId: squatId,
					progressionType: 'linear',
					sets: [
						{ targetPercentage: 0.6,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 0.7,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 0.8,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 0.9,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 1.0,  minReps: 5, targetReps: 5 },
					],
				},
				{
					exerciseId: ohpId,
					progressionType: 'linear',
					sets: [
						{ targetPercentage: 0.6,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 0.7,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 0.8,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 0.9,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 1.0,  minReps: 5, targetReps: 5 },
					],
				},
				{
					exerciseId: deadliftId,
					progressionType: 'linear',
					sets: [
						{ targetPercentage: 0.6,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 0.7,  minReps: 3, targetReps: 3 },
						{ targetPercentage: 0.8,  minReps: 2, targetReps: 2 },
						{ targetPercentage: 0.9,  minReps: 1, targetReps: 1 },
						{ targetPercentage: 1.0,  minReps: 5, targetReps: 5 },
					],
				},
			],
		}
	]
} ) }

