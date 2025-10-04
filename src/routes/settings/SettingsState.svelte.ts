
  import { liveQuery } from "dexie";
  import { db, type WeightUnit } from "$lib/db";

export class SettingsState {

  settings = liveQuery(() => db.userSettings.get("userSettings"));

	// weightUnit = $derived(this.settings.weightUnit)

		updateWeightUnit = (unit: WeightUnit) => db.userSettings.update('userSettings', {weightUnit: unit })
	

	// handleUnitChange = (event: Event) => {
	// 	const newUnit = (event.currentTarget as HTMLSelectElement)
	// 		.value as WeightUnit;
	//
	// 	if (this.me?.root.settings) {
	// 		this.me.root.settings.$jazz.set("weightUnit", newUnit);
	// 	}
	// };
	//
	// handleNameChange = (event: Event) => {
	// 	if (!this.me?.profile) return;
	// 	const target = event.target as HTMLInputElement;
	// 	this.me.profile.$jazz.set("name", target.value);
	// };
}
