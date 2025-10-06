import { WorkoutExercise, JazzAccount, Program, UserExerciseState, UserProgramInstance, Workout } from "$lib/schema";
import type { CoValue } from "jazz-tools";
import { AccountCoState } from "jazz-tools/svelte";

export class ProgramsState {
    private account = new AccountCoState(JazzAccount, {
        resolve: { 
            root: {programs: { $each: { workouts: { $each: { exercises: { $each: true } } } } }, activeProgram: true} 
        },
    });

	me = $derived(this.account.current);

	// For now, we assume the user only has one active program.
	activeProgram = $derived(this.me?.root.activeProgram);
	programs = $derived(this.me?.root.programs ?? []);


	async startProgram(program: Program) {
		console.log('starting program')
		if (!this.me) {
			console.error("Account not loaded.");
			return;
		}

		const programId = program.$jazz.id;
        
		// 1. Determine the first workout id
		const firstWorkout = program.workouts![0];
		if (!firstWorkout || !firstWorkout.id) {
			console.error("Program must contain at least one workout with a id.");
			return;
		}
		const nextWorkoutId = firstWorkout.id;


		// 2. Initialize Exercise States (assuming initial working weight is 0 for simplicity)
		// This is where you would calculate initial working weights based on a 1RM input from the user
        const initialExerciseStates = program.workouts?.flatMap(workout => {
                // Ensure workout is present and exercises list exists
                return workout?.exercises
                    ?.map(exercise => {
                        // Ensure exercise is present
                        if (!exercise) return null; 

                        return UserExerciseState.create({
                            exerciseId: exercise.id,
                            currentWorkingWeight: 45, // Using 45 as the example starting weight
                        });
                    })
                    .filter(Boolean) || []; // Filter out any null/undefined results
            })
            .filter(Boolean) // Filter out any null/undefined results from the outer flatMap
            || [];

		if (!initialExerciseStates.length) {
			throw new Error("No exercises found in the program's workouts.");
		}


        // 3. Create the new UserProgramInstance
        const newProgramInstance = UserProgramInstance.create({
            programDefinitionId: programId,
			exerciseStates: initialExerciseStates as UserExerciseState[],
            lastCompletedWorkoutId: undefined,
            nextWorkoutId: nextWorkoutId,
        });

        // 4. Set the new instance as the active program
        this.me.root.$jazz.set('activeProgram', newProgramInstance);
        
        console.log(`Started program: ${program.name}`);

        // OPTIONAL: Navigate the user to the workout page
        // if (typeof window !== 'undefined') {
        //     window.location.href = `/workout/${nextWorkoutId}`;
        // }
	}
}
