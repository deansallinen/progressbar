import { AccountCoState } from "jazz-tools/svelte";
import { JazzAccount } from "$lib/schema";

type WeightUnit = "lbs" | "kg";

export class SettingsStateClass {
	private account = new AccountCoState(JazzAccount, {
		resolve: {
			profile: true,
			root: { settings: true },
		},
	});

	me = $derived(this.account.current);

	handleUnitChange = (event: Event) => {
		const newUnit = (event.currentTarget as HTMLSelectElement)
			.value as WeightUnit;

		if (this.me?.root.settings) {
			this.me.root.settings.$jazz.set("weightUnit", newUnit);
		}
	};

	handleNameChange = (event: Event) => {
		if (!this.me?.profile) return;
		const target = event.target as HTMLInputElement;
		this.me.profile.$jazz.set("name", target.value);
	};
}
