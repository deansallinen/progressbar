<script lang="ts">
	import { resolve } from "$app/paths";
	import { ProgramsState } from "./ProgramsState.svelte";

	const programsState = new ProgramsState();

	const programs = $derived(programsState.programs);
</script>

<main>
	<h1>Browse Programs</h1>
	<p>Select a program to view its details and get started.</p>

	{#each programs as program (program.$jazz.id)}
		{#if program}
			<article>
				<header>
					<h2>{program.name}</h2>
				</header>
				<p>{program.description}</p>
				<footer>
					<a href={resolve(`/programs/${program.$jazz.id}`)} role="button"
						>View Program</a
					>
					<button onclick={() => programsState.startProgram(program)}
						>Start Program</button
					>
				</footer>
			</article>
		{/if}
	{/each}
</main>
