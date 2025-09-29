<script lang="ts">
  import { JazzAccount } from "$lib/schema";
  import { AccountCoState } from "jazz-tools/svelte";

  const account = new AccountCoState(JazzAccount, {
    resolve: {
      profile: true,
      root: { programs: { $each: true } },
    },
  });

  const me = $derived(account.current);
</script>

<h1>{me?.profile.name}'s Training Programs</h1>
{#if !me}
  <p>Loading programs...</p>
{:else if me.root.programs.length === 0}
  <p>No programs yet. Create one!</p>
{:else}
  <ul>
    {#each me.root.programs as program}
      {#if program}
        <li>{program.name}</li>
      {/if}
    {/each}
  </ul>
  <a role="button" href="/programs/new">Create Program</a>
{/if}
