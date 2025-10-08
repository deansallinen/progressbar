import { Entity } from "dexie";
import type { ProgressBarDB } from "../index";

export class ExerciseDefinition extends Entity<ProgressBarDB> {
	id!: number; // Primary key, Dexie handles this
	name!: string;
	incrementWeight!: number;
	workingWeight?: number;
	goalWeight?: number;

	async increaseWorkingWeight() {
		if (!this.workingWeight) return;
		const newWeight = this.workingWeight + this.incrementWeight;
		await this.db.exerciseDefinitions.update(this.id, {
			workingWeight: newWeight,
		});
		this.workingWeight = newWeight;
	}

	async setWorkingWeight(value: number) {
		if (!this.workingWeight) return;
		const newWeight = value;
		await this.db.exerciseDefinitions.update(this.id, {
			workingWeight: newWeight,
		});
		this.workingWeight = newWeight;
	}


}
