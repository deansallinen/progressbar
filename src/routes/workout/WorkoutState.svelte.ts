import { goto } from "$app/navigation";
import { resolve } from "$app/paths";
import { liveQuery } from "dexie";
import { type ActiveExercise, type ActiveSet, type ActiveWorkout, type AppSettings, db, Program } from "../../db";

export class WorkoutStateClass {
	private _program: Program | undefined;
	private _settings: AppSettings | undefined;

	activeWorkout = $state<ActiveWorkout>();

	test = liveQuery(()=> db.appSettings.get(1))


	async loadWorkout() {
		console.log('load workout start')
		try {
			const settings = await db.appSettings.get(1);
			if (!settings || !settings.activeProgramId) {
				throw new Error("No active program set.");
			}            
			this._settings = settings

			const program = await db.programs.get(settings.activeProgramId);
			if (!program) {
				throw new Error("Active program not found in the database.");
			}
			this._program = program

			const workoutTemplate = program.workouts[settings.nextWorkoutIndex];

			const hydratedExercises = await Promise.all(
				workoutTemplate.exercises.map(async (exerciseTemplate): Promise<ActiveExercise> => {
					const definition = await db.exerciseDefinitions.get(exerciseTemplate.exerciseDefinitionId);
					if (!definition) {
						throw new Error(`Exercise definition with ID ${exerciseTemplate.exerciseDefinitionId} not found.`);
					}

					const workingWeight = definition.workingWeight || settings.barWeight

					// Calculate target weights for each set
					const activeSets = exerciseTemplate.sets.map((setTemplate): ActiveSet => {
						let targetWeight = 0;
						switch (setTemplate.type) {
							case 'work':
								targetWeight = workingWeight;
								break;
							case 'percentage':
								// Here you would add logic to round to the nearest available plate
								targetWeight = workingWeight * setTemplate.value;
								break;
							case 'fixed':
								targetWeight = setTemplate.weight;
								break;
						}
						return {
							template: setTemplate,
							targetWeight: Math.round(targetWeight / 5) * 5, // Simple rounding for now
							completedReps: null,
							isComplete: false,
						};
					});

					return { definition, sets: activeSets };
				})
			);

			console.log(hydratedExercises)

			this.activeWorkout = {
				programName: program.name,
				workoutName: workoutTemplate.name,
				exercises: hydratedExercises,
				startedAt: new Date(),
			};
		} catch(error) {
			console.error(error)
		}

	}

	// 	// Use the programDefinitionId to get the program data from Jazz.
	// 	programDefinition = $derived.by(() => {
	// 		if (!this.activeProgram || !this.me?.root.programs) return undefined;
	//
	// 		// Find the program by its CoValue ID
	// 		for (const program of this.me.root.programs) {
	// 			if (program && program.$jazz.id === this.activeProgram.programDefinitionId) {
	// 				return program;
	// 			}
	// 		}
	//
	// 		return undefined;
	// 	});
	//
	// 	// Determine the current workout from the program definition.
	// 	currentWorkout = $derived(
	// 		this.programDefinition?.workouts?.find(
	// 			(w) => w?.id === this.activeProgram?.nextWorkoutId,
	// 		),
	// 	);
	//
	// 	// Create a state object to hold the user's completed reps for this session.
	// 	completedWorkoutState = $state<CompletedWorkoutState>({});
	//
	// 	getWorkingWeight = (exerciseId: string): number => {
	// 		return (
	// 			this.activeProgram?.exerciseStates.find(
	// 				(s) => s?.exerciseId === exerciseId,
	// 			)?.currentWorkingWeight ?? 0
	// 		);
	// 	};
	//
	// 	calculateSetWeight = (
	// 		set: ExerciseSet | undefined,
	// 		workingWeight: number,
	// 	): number => {
	// 		if (!set) return 0;
	// 		if (set.percentage) {
	// 			// Round to the nearest 5 for simplicity, a common practice.
	// 			return Math.round((set.percentage * workingWeight) / 5) * 5;
	// 		}
	// 		return set.weight ?? 0;
	// 	};
	//
	// 	updateCompletedReps = (
	// 		exerciseId: string,
	// 		setIndex: number,
	// 		valueAsNumber: number,
	// 	) => {
	// 		if (!this.completedWorkoutState[exerciseId]) {
	// 			this.completedWorkoutState[exerciseId] = {};
	// 		}
	// 		this.completedWorkoutState[exerciseId][setIndex] = valueAsNumber;
	// 		console.log(JSON.stringify(this.completedWorkoutState))
	// 	};
	//
	// 	updateWorkingWeight = (exerciseId: string, newWeight: number) => {
	// 		if (!this.activeProgram) return;
	//
	// 		const exerciseState = this.activeProgram.exerciseStates.find(
	// 			(s) => s?.exerciseId === exerciseId,
	// 		);
	//
	// 		if (exerciseState) {
	// 			exerciseState.$jazz.set("currentWorkingWeight", newWeight);
	// 		}
	// 	};
	//
	// 	completeWorkout = () => {
	// 		if (!this.activeProgram || !this.programDefinition || !this.currentWorkout)
	// 			return;
	//
	// 		// --- Apply Progression Logic ---
	// 		if (this.currentWorkout.exercises) {
	// 			for (const exercise of this.currentWorkout.exercises) {
	// 				if (!exercise) continue;
	// 				const progressionRule = this.programDefinition.progression?.find(
	// 					(p) => p?.exerciseId === exercise.id,
	// 				);
	// 				if (!progressionRule || !exercise.sets) continue;
	//
	// 				const lastSetIndex = exercise.sets.length - 1;
	// 				const lastSet = exercise.sets[lastSetIndex];
	// 				const completedReps =
	// 					this.completedWorkoutState[exercise.id]?.[lastSetIndex];
	//
	// 				// Simple success condition: did the user meet or beat the target reps on the final set?
	// 				if (lastSet && completedReps >= lastSet.targetReps) {
	// 					const exerciseState = this.activeProgram.exerciseStates.find(
	// 						(s) => s?.exerciseId === exercise.id,
	// 					);
	// 					if (exerciseState) {
	// 						exerciseState.$jazz.set(
	// 							"currentWorkingWeight",
	// 							exerciseState.currentWorkingWeight + progressionRule.increment,
	// 						);
	// 					}
	// 				}
	// 			}
	// 		}
	//
	// 		// --- Determine Next Workout ---
	// 		const currentWorkoutIndex =
	// 			this.programDefinition.workouts?.findIndex(
	// 				(w) => w?.id === this.currentWorkout?.id,
	// 			) ?? -1;
	//
	// 		if (currentWorkoutIndex === -1 || !this.programDefinition.workouts) return;
	//
	// 		const nextWorkoutIndex =
	// 			(currentWorkoutIndex + 1) % this.programDefinition.workouts.length;
	// 		const nextWorkout = this.programDefinition.workouts[nextWorkoutIndex];
	//
	// 		if (nextWorkout) {
	// 			this.activeProgram.$jazz.set(
	// 				"lastCompletedWorkoutId",
	// 				this.currentWorkout.id,
	// 			);
	// 			this.activeProgram.$jazz.set("nextWorkoutId", nextWorkout.id);
	// 		}
	//
	// 		goto(resolve('/'))
	// 	};
}
