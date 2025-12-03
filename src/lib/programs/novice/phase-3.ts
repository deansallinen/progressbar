import { type TemplatePhase } from "$lib/db"

export const phase3 = (squatId:number, benchId:number, deadliftId:number, ohpId:number, chinupId: number, curlsId: number, lteId: number): TemplatePhase  => { 

	return {
		name: 'Phase 3',
		duration: Infinity,
		workouts: [{
			name: "Workout A",
			exercises: [
				{
					exerciseId: squatId,
					progressionType: 'linear',
					warmup: true,
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
					warmup: true,
					sets: [
						{ targetPercentage: 0.6,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 0.7,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 0.8,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 0.9,  minReps: 5, targetReps: 5 },
						{ targetPercentage: 1.0,  minReps: 5, targetReps: 5 },
					],
				},
				{
					exerciseId: chinupId,
					progressionType: 'rep_based',
					sets: [
						{  minReps: 10, targetReps: Infinity},
						{  minReps: 0 , targetReps: Infinity},
						{  minReps: 0 , targetReps: Infinity},
					],
				},
			],
		},
			{
				name: "Workout B",
				exercises: [
					{
						exerciseId: ohpId,
						progressionType: 'linear',
						warmup: true,
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
						warmup: true,
						sets: [
							{ targetPercentage: 0.6,  minReps: 5, targetReps: 5 },
							{ targetPercentage: 0.7,  minReps: 5, targetReps: 5 },
							{ targetPercentage: 0.8,  minReps: 5, targetReps: 5 },
							{ targetPercentage: 0.9,  minReps: 5, targetReps: 5 },
							{ targetPercentage: 1.0,  minReps: 5, targetReps: 5 },
						],
					},
					{
						exerciseId: curlsId,
						progressionType: 'rep_based',
						sets: [
							{  minReps: 10, targetReps: 10 },
							{  minReps: 8, targetReps: 10 },
							{  minReps: 8, targetReps: 10 },
						],
					},
					{
						exerciseId: lteId,
						progressionType: 'rep_based',
						sets: [
							{  minReps: 10, targetReps: 10 },
							{  minReps: 8, targetReps: 10 },
							{  minReps: 8, targetReps: 10 },
						],
					}
				],
			}
		]
	} }
