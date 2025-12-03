import { db, type ActiveWorkout, type TemplateProgram, type WorkoutHistory } from "$lib/db"

export interface PhaseTransition {
	occurred: boolean;
	fromPhase: number;
	toPhase: number;
	fromPhaseName: string;
	toPhaseName: string;
}

const nextWorkoutInCurrentPhase = (program: TemplateProgram, lastWorkoutIndex: number) => {
	const currentPhase = program.phases[program.currentPhaseIndex]
	const nextWorkoutIndex = (lastWorkoutIndex + 1) % currentPhase.workouts.length;
	db.programs.update(program.id, {
		phaseWorkoutCount: program.phaseWorkoutCount + 1,
		nextWorkoutIndex
	})
}

export const setNextWorkout = async (program: TemplateProgram, lastWorkout: ActiveWorkout | WorkoutHistory): Promise<PhaseTransition | null> => {
	console.log('finding next workout for program id', program.id)
	// Novice program
	if (program.id === 1) {
		const currentPhaseIndex = program.currentPhaseIndex
		const workoutCount = program.workoutCount
		console.log('novice program, phase', currentPhaseIndex)

		if (currentPhaseIndex === 0) {
			console.log('first phase')
			if (workoutCount >= 12) {
				console.log('should progress to phase 2')
				const fromPhaseName = program.phases[0].name;
				const toPhaseName = program.phases[1].name;
				await db.programs.update(program.id, {
					currentPhaseIndex: 1,
					phaseWorkoutCount: 0,
					nextWorkoutIndex: 0
				})
				return {
					occurred: true,
					fromPhase: 0,
					toPhase: 1,
					fromPhaseName,
					toPhaseName
				}
			} else {
				console.log('should do next workout in phase 1')
				nextWorkoutInCurrentPhase(program, lastWorkout.workoutIndex)
			}
		} else if (currentPhaseIndex === 1) {
			console.log('second phase')
			if (workoutCount >= 24) {
				console.log('should progress to phase 3')
				const fromPhaseName = program.phases[1].name;
				const toPhaseName = program.phases[2].name;
				await db.programs.update(program.id, {
					currentPhaseIndex: 2,
					phaseWorkoutCount: 0,
					nextWorkoutIndex: 0
				})
				return {
					occurred: true,
					fromPhase: 1,
					toPhase: 2,
					fromPhaseName,
					toPhaseName
				}
			} else {
				console.log('should do next workout in phase 2')
				nextWorkoutInCurrentPhase(program, lastWorkout.workoutIndex)
			}
		} else if (currentPhaseIndex === 2) {
			console.log('third phase')
			// Rule: Novice phase ends when squat stalls repeatedly.
			const squat = await db.exercises.where('name').equals('Squat').first()
			if (!squat) throw new Error('Squat should exist')

			if (squat.resets! > 2) {
				// if squat reset already and stalled again, progress to intermediate program
				// TODO: Start intermediate program
				// return startIntermediateProgram()
			} else {
				nextWorkoutInCurrentPhase(program, lastWorkout.workoutIndex)
			}
		}
	}
	return null
}
