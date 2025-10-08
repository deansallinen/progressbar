<script lang="ts">
	import { resolve } from "$app/paths";
	import { getSettingsState } from "./settings/SettingsState.svelte";

	const { settings } = getSettingsState();
	const hasActiveProgram = $derived($settings?.activeProgramId);
</script>

<h1>Dashboard</h1>

{#if hasActiveProgram}
	<article>
		<header>
			<h2>Ready for your next session?</h2>
		</header>
		<p>You have an active program. Let's get back to it!</p>
		<footer>
			<a href={resolve("/workout")} role="button">Next Workout</a>
		</footer>
	</article>
{:else}
	<article>
		<header>
			<h2>Welcome to ProgressBar!</h2>
		</header>
		<footer>
			<a href={resolve("/programs")} role="button">Browse Programs</a>
		</footer>
	</article>
{/if}
