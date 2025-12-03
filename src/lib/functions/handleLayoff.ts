import { db } from '$lib/db';
import { calculateSetPercentage } from './calculateSetPercentage';
import { getSmallestWeight } from './getSmallestWeight';

/**
 * Layoff handling based on the book "Radically Simple Strength":
 *
 * From the appendix "Dealing with Injuries and Layoffs" (pages 3056-3068):
 * - If you miss a week of training, try to repeat the previous week's weights
 * - If out for more than a week, back off top-set weight by 5-10 pounds
 * - If out for several weeks, backing off 5%-10% is more appropriate
 *
 * Implementation:
 * - ~1 week (7 days): No change - repeat previous workout's weights
 * - More than 1 week (8-14 days): Take about 10lbs off all exercises
 * - More than 2 weeks (14+ days): Do a deload (10% off)
 */

export type LayoffType = 'none' | 'repeat' | 'minor' | 'deload';

export interface LayoffInfo {
  type: LayoffType;
  daysSinceLastWorkout: number;
  lastWorkoutDate: Date | null;
  adjustmentMade: string;
}

/**
 * Gets the most recent completed workout date from history.
 */
export async function getLastWorkoutDate(): Promise<Date | null> {
  const history = await db.workoutHistory
    .orderBy('completedAt')
    .reverse()
    .first();

  return history?.completedAt ?? null;
}

/**
 * Calculates the number of days since the last completed workout.
 * Returns null if no workout history exists.
 */
export function calculateDaysSinceLastWorkout(lastWorkoutDate: Date | null): number | null {
  if (!lastWorkoutDate) return null;

  const now = new Date();
  const diffTime = now.getTime() - lastWorkoutDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

/**
 * Determines what type of layoff adjustment is needed based on days since last workout.
 */
export function determineLayoffType(daysSinceLastWorkout: number | null): LayoffType {
  if (daysSinceLastWorkout === null) {
    // No workout history - first workout ever
    return 'none';
  }

  if (daysSinceLastWorkout <= 7) {
    // Within normal range, no adjustment needed
    return 'none';
  }

  if (daysSinceLastWorkout <= 14) {
    // More than 1 week but less than 2 weeks - minor adjustment (10lbs off)
    return 'minor';
  }

  // More than 2 weeks - full deload (10% off)
  return 'deload';
}

/**
 * Applies a minor layoff adjustment by reducing each exercise's working weight
 * by approximately 10 pounds, rounded to the nearest loadable weight.
 */
async function applyMinorLayoffAdjustment(): Promise<void> {
  const exercises = await db.exercises.toArray();
  const smallestWeight = await getSmallestWeight();
  const roundingIncrement = smallestWeight * 2;

  for (const exercise of exercises) {
    if (!exercise.id) continue;

    // Reduce by 10lbs, but ensure we don't go below the bar weight
    const reduction = 10;
    const newWeight = Math.max(
      Math.round((exercise.workingWeight - reduction) / roundingIncrement) * roundingIncrement,
      45 // Minimum is typically bar weight
    );

    await db.exercises.update(exercise.id, {
      workingWeight: newWeight,
    });
  }
}

/**
 * Applies a deload adjustment by reducing each exercise's working weight by 10%.
 * This is used for layoffs of more than 2 weeks.
 */
async function applyDeloadAdjustment(): Promise<void> {
  const exercises = await db.exercises.toArray();
  const smallestWeight = await getSmallestWeight();

  for (const exercise of exercises) {
    if (!exercise.id) continue;

    const newWeight = calculateSetPercentage(0.9, exercise.workingWeight, smallestWeight);

    await db.exercises.update(exercise.id, {
      workingWeight: newWeight,
    });
  }
}

/**
 * Checks for a layoff condition and applies the appropriate weight adjustment
 * based on the book's guidelines.
 *
 * @returns LayoffInfo object with details about the layoff and any adjustments made
 */
export async function handleLayoff(): Promise<LayoffInfo> {
  const lastWorkoutDate = await getLastWorkoutDate();
  const daysSinceLastWorkout = calculateDaysSinceLastWorkout(lastWorkoutDate);
  const layoffType = determineLayoffType(daysSinceLastWorkout);

  let adjustmentMade = '';

  switch (layoffType) {
    case 'minor':
      await applyMinorLayoffAdjustment();
      adjustmentMade = 'Reduced all exercise weights by ~10 lbs due to 1-2 week layoff';
      break;

    case 'deload':
      await applyDeloadAdjustment();
      adjustmentMade = 'Applied 10% deload to all exercises due to 2+ week layoff';
      break;

    case 'repeat':
    case 'none':
    default:
      adjustmentMade = '';
      break;
  }

  return {
    type: layoffType,
    daysSinceLastWorkout: daysSinceLastWorkout ?? 0,
    lastWorkoutDate,
    adjustmentMade,
  };
}

/**
 * Checks if a layoff adjustment is needed without applying it.
 * Useful for showing a warning/confirmation to the user before starting a workout.
 */
export async function checkForLayoff(): Promise<LayoffInfo> {
  const lastWorkoutDate = await getLastWorkoutDate();
  const daysSinceLastWorkout = calculateDaysSinceLastWorkout(lastWorkoutDate);
  const layoffType = determineLayoffType(daysSinceLastWorkout);

  let adjustmentMade = '';
  switch (layoffType) {
    case 'minor':
      adjustmentMade = 'Will reduce all exercise weights by ~10 lbs due to 1-2 week layoff';
      break;
    case 'deload':
      adjustmentMade = 'Will apply 10% deload to all exercises due to 2+ week layoff';
      break;
    default:
      adjustmentMade = '';
  }

  return {
    type: layoffType,
    daysSinceLastWorkout: daysSinceLastWorkout ?? 0,
    lastWorkoutDate,
    adjustmentMade,
  };
}
