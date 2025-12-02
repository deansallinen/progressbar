import { db, type UserExercise } from '$lib/db';
import { calculateSetPercentage } from './calculateSetPercentage';
import { getSmallestWeight } from './getSmallestWeight';

/**
 * Performs a deload on an exercise by reducing the working weight by 10%.
 *
 * A deload is a short period of lower-volume, moderate-intensity training
 * designed to allow accumulated stress to dissipate. According to the book:
 * - The weight is reduced by 10% from the current working weight
 * - Used for recovery without losing neuromuscular efficiency
 * - Can be triggered manually for injury or sickness
 * - Stall counter is NOT reset (unlike a full reset)
 *
 * @param exerciseId - The ID of the exercise to deload
 * @returns The updated exercise with reduced weight
 */
export async function deloadExercise(exerciseId: number): Promise<UserExercise | undefined> {
  const exercise = await db.exercises.get(exerciseId);
  if (!exercise) throw new Error('Exercise not found');

  const smallestWeight = await getSmallestWeight();
  const newWeight = calculateSetPercentage(0.9, exercise.workingWeight, smallestWeight);

  await db.exercises.update(exerciseId, {
    workingWeight: newWeight,
  });

  return db.exercises.get(exerciseId);
}

/**
 * Performs a deload on all exercises in the database.
 * Useful when returning from injury or sickness.
 *
 * @returns Array of updated exercises
 */
export async function deloadAllExercises(): Promise<UserExercise[]> {
  const exercises = await db.exercises.toArray();
  const smallestWeight = await getSmallestWeight();

  for (const exercise of exercises) {
    if (!exercise.id) continue;
    const newWeight = calculateSetPercentage(0.9, exercise.workingWeight, smallestWeight);
    await db.exercises.update(exercise.id, {
      workingWeight: newWeight,
    });
  }

  return db.exercises.toArray();
}

/**
 * Performs a full reset on an exercise by reducing the working weight by 10%
 * AND resetting the stall counter to 0, incrementing the reset counter.
 *
 * According to the book:
 * - To reset an exercise that has stalled, reduce the weight of your top set by 10%
 * - Reset stall counter to 0 so progression can resume
 * - You should reset each exercise only once in novice phase
 * - After a reset, if you still can't complete at least 3 reps, move to intermediate
 *
 * This is different from a deload:
 * - Reset: Used when you've stalled (missed reps 2-3 consecutive workouts)
 * - Deload: Used for planned recovery or returning from injury/sickness
 *
 * @param exerciseId - The ID of the exercise to reset
 * @returns The updated exercise with reduced weight and reset stall counter
 */
export async function resetExercise(exerciseId: number): Promise<UserExercise | undefined> {
  const exercise = await db.exercises.get(exerciseId);
  if (!exercise) throw new Error('Exercise not found');

  const smallestWeight = await getSmallestWeight();
  const newWeight = calculateSetPercentage(0.9, exercise.workingWeight, smallestWeight);
  const existingResets = exercise.resets || 0;

  await db.exercises.update(exerciseId, {
    workingWeight: newWeight,
    stalls: 0,
    resets: existingResets + 1,
  });

  return db.exercises.get(exerciseId);
}

/**
 * Performs a reset on all exercises in the database.
 * Useful when returning from a long layoff due to injury or sickness.
 *
 * According to the book on layoffs:
 * - If you miss a week of training, try to repeat the previous week's weights
 * - If out for more than a week, back off top-set weight by 5-10 pounds
 * - If out for several weeks, backing off 5%-10% is more appropriate
 *
 * @returns Array of updated exercises
 */
export async function resetAllExercises(): Promise<UserExercise[]> {
  const exercises = await db.exercises.toArray();
  const smallestWeight = await getSmallestWeight();

  for (const exercise of exercises) {
    if (!exercise.id) continue;
    const newWeight = calculateSetPercentage(0.9, exercise.workingWeight, smallestWeight);
    const existingResets = exercise.resets || 0;
    await db.exercises.update(exercise.id, {
      workingWeight: newWeight,
      stalls: 0,
      resets: existingResets + 1,
    });
  }

  return db.exercises.toArray();
}
