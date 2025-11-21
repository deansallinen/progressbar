import { db, type ActiveWorkout, type TemplateProgram, type WorkoutHistory } from "$lib/db"

const nextWorkoutInCurrentPhase = (program: TemplateProgram, lastWorkoutIndex:number) => {
	const currentPhase = program.phases[program.currentPhaseIndex]
	const nextWorkoutIndex = (lastWorkoutIndex + 1) % currentPhase.workouts.length;
	db.programs.update(program.id, {
		workoutCount: program.workoutCount++,
		phaseWorkoutCount: program.phaseWorkoutCount++,
		nextWorkoutIndex
	})
}

export const findNextWorkout = async (program: TemplateProgram, lastWorkout: ActiveWorkout | WorkoutHistory ) => {
	// Novice program
	if (program.id === 0 ) {
		const currentPhaseIndex = program.currentPhaseIndex
		const workoutCount = program.workoutCount

		if (currentPhaseIndex === 0) {
			if (workoutCount > 12) {
				// Next phase
				db.programs.update(program.id, {
					currentPhaseIndex: 1,
					phaseWorkoutCount: 0,
					nextWorkoutIndex: 0
				})
			} else {
				nextWorkoutInCurrentPhase(program, lastWorkout.workoutIndex)
			}
		}

		if (currentPhaseIndex === 1) {
			if (workoutCount > 24) {
				db.programs.update(program.id, {currentPhaseIndex: 2, phaseWorkoutCount: 0})
			} else {
				nextWorkoutInCurrentPhase(program, lastWorkout.workoutIndex)
			}
		}

		if (currentPhaseIndex === 2) {
			// Rule: Novice phase ends when squat stalls repeatedly.
			const squat = await db.exercises.where('name').equals('Squat').first()
			if (!squat) throw new Error('Squat should exist')

			if (squat.resets! > 2) {
				// if squat reset already and stalled again, progress to intermediate program
				// TODO: Start intermediate program
				// return startIntermediateProgram()
			} 
		}
	}
}
