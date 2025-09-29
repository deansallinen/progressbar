<script lang="ts">
	import { AccountCoState } from "jazz-tools/svelte";
	import { JazzAccount } from "$lib/schema";
	import { resolve } from "$app/paths";

	const account = new AccountCoState(JazzAccount, {
		resolve: { root: { activeProgram: true } },
	});
	const me = $derived(account.current);

	const hasActiveProgram = $derived(!!me?.root.activeProgram);
</script>

<h1>Dashboard</h1>

{#if !me}
	<p>Loading...</p>
{:else if hasActiveProgram}
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
		<p>You don't have an active program yet. Let's find one for you.</p>
		<footer>
			<a href={resolve("/programs")} role="button">Browse Programs</a>
		</footer>
	</article>
{/if}
