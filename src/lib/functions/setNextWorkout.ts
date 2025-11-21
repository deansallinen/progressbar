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

export const setNextWorkout = async (program: TemplateProgram, lastWorkout: ActiveWorkout | WorkoutHistory ) => {
	console.log('finding next workout for program id', program.id)
	// Novice program
	if (program.id === 1 ) {
		const currentPhaseIndex = program.currentPhaseIndex
		const workoutCount = program.workoutCount
		console.log('novice program, phase', currentPhaseIndex)

		if (currentPhaseIndex === 0) {
			console.log('first phase')
			if (workoutCount >= 12) {
				console.log('should progress to phase 2')
				// Next phase
				db.programs.update(program.id, {
					currentPhaseIndex: 1,
					phaseWorkoutCount: 0,
					nextWorkoutIndex: 0
				})
			} else {
				console.log('should do next workout in phase 1')
				nextWorkoutInCurrentPhase(program, lastWorkout.workoutIndex)
			}
		}

		if (currentPhaseIndex === 1) {
			console.log('second phase')
			if (workoutCount >= 24) {
				console.log('should progress to phase 3')
				db.programs.update(program.id, {currentPhaseIndex: 2, phaseWorkoutCount: 0})
			} else {
				console.log('should do next workout in phase 2')
				nextWorkoutInCurrentPhase(program, lastWorkout.workoutIndex)
			}
		}

		if (currentPhaseIndex === 2) {
			console.log('third phase')
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
