import { AccountCoState } from "jazz-tools/svelte";
import { JazzAccount} from "$lib/schema";
import { goto } from "$app/navigation";
import { resolve } from "$app/paths";

type WeightUnit = "lbs" | "kg";

export class SettingsState {
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

	handleTargetChange = (event: Event) => {
		if (!this.me?.root) return;
		const target = event.target as HTMLInputElement;
		console.log(target.value)
		console.log(target.id)
		// this.me.root.activeProgram?.exerciseStates.$jazz.set(, target.value);
	};


	handleLogOut = () => {
		this.account.logOut();
		goto(resolve("/"));
	};

	stopActiveProgram = () => {
		this.me?.root.$jazz.set('activeProgram', undefined)
	}

	// resetEverything = () => {
	// 	this.me?.$jazz.set('root', rootDefaults) 
	// }
}
