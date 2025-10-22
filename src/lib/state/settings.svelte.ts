import { db, } from "$lib/db";
import { liveQuery } from "dexie";

export const settings = liveQuery(() => db.settings.get(1));

export const exercises = liveQuery(() => db.exercises.toArray());

export const handleExerciseNumberChange = (id: number, key: 'workingWeight' | 'goalWeight' | 'incrementWeight') => (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);
  if (!isNaN(value)) {
    db.exercises.update(id, { [key]: value });
  }
}

export const handleNameChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  db.settings.update(1, { userName: target.value });
}

export const  handleUnitChange = (e: Event) => {
  const newUnit = (e.currentTarget as HTMLSelectElement).value // as WeightUnit;
  db.settings.update(1, { weightUnit: newUnit });
}

export const handleUserWeightChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);
  if (!isNaN(value)) {
    db.settings.update(1, { userWeight: value });
  }
}

export const handleBarWeightChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const value = parseFloat(target.value);
  if (!isNaN(value)) {
    db.settings.update(1, { barWeight: value });
  }
}

export const handlePlatesChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const plates = target.value.split(',')
    .map(s => parseFloat(s.trim()))
    .filter(n => !isNaN(n) && n > 0);
  db.settings.update(1, { availablePlates: plates });
}
