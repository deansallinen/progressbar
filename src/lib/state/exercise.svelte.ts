import { db } from "$lib/db"
import { liveQuery } from "dexie";

export const exercises = liveQuery(() => db.exercises.toArray());

export const getExerciseById = async (id: number) => await db.exercises.get(id)
