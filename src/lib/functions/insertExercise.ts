
import { db, type UserExercise } from "$lib/db";

export async function insertExercise(e: UserExercise) {
try {
    const primaryKey = await db.exercises.add(e);
			if (!primaryKey) throw new Error(`Couldnt add exercise ${e.name}` )
    console.log(`Exercise inserted successfully with key: ${primaryKey}`);
    return primaryKey;

  } catch (error ) {
    if (error.name === 'ConstraintError') {
      console.warn("Exercise already exists (ConstraintError). No insertion performed.");
			const pk = await db.exercises.where('name').equals(e.name).first().then(e => e?.id)
			if (!pk) throw new Error('something went wrong')
			return pk
    } else {
      console.error("An unexpected error occurred:", error);
			return 
    }
  }
}
