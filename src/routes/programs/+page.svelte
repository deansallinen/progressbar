<script lang="ts">
	// import { resolve } from "$app/paths";
	import { CoState } from "jazz-tools/svelte";
	// import { ProgramsState } from "./ProgramsState.svelte";
	import { ProgramCatalog, PUBLIC_CATALOG_ID } from "$lib/schema";

	// const programsState = new ProgramsState();

	// const programs = $derived(programsState.programs);

	// Load the single, well-known public catalog instance
	const catalog = $derived(
		new CoState(
			ProgramCatalog,
			() => PUBLIC_CATALOG_ID, // Use a function wrapper as recommended by Svelte docs for CoState
			() => ({
				// Deeply load all programs, workouts, and exercises to enable deep cloning
				resolve: {
					programs: {
						$each: {
							workouts: {
								$each: {
									exercises: { $each: true },
								},
							},
						},
					},
				},
			}),
		),
	);
</script>

<main>
	<h1>Browse Programs</h1>
	<p>Select a program to view its details and get started.</p>

	{#if catalog.current === undefined}
		<p>Loading public catalog...</p>
	{:else if catalog.current === null}
		<p>catalog is null</p>
	{:else}
		{#each catalog.current.programs || [] as program}
			{#if program}
				<div
					class="border rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
				>
					<div class="mb-3 md:mb-0">
						<h2 class="text-xl font-semibold text-blue-700">{program.name}</h2>
						<p class="text-sm text-gray-500">
							{program.description || "No description provided."}
						</p>
						<p class="text-xs mt-1 text-gray-400">
							{program.workouts.length} workouts
						</p>
					</div>
				</div>
			{/if}
		{/each}
	{/if}

	<!-- {#each programs as program (program.$jazz.id)} -->
	<!-- 	{#if program} -->
	<!-- 		<article> -->
	<!-- 			<header> -->
	<!-- 				<h2>{program.name}</h2> -->
	<!-- 			</header> -->
	<!-- 			<p>{program.description}</p> -->
	<!-- 			<footer> -->
	<!-- 				<a href={resolve(`/programs/${program.$jazz.id}`)} role="button" -->
	<!-- 					>View Program</a -->
	<!-- 				> -->
	<!-- 			</footer> -->
	<!-- 		</article> -->
	<!-- 	{/if} -->
	<!-- {/each} -->
</main>
