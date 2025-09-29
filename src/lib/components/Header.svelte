<script lang="ts">
  import { JazzAccount } from "$lib/schema";
  import { usePasskeyAuth } from "jazz-tools/svelte";
  import { AccountCoState } from "jazz-tools/svelte";

  let { appName } = $props();

  const { logOut } = new AccountCoState(JazzAccount);

  const { current, state } = $derived(
    usePasskeyAuth({
      appName,
    }),
  );

  const isAuthenticated = $derived(state === "signedIn");
</script>

<header class="container">
  <nav>
    <ul><li><a href="/"><strong>{appName}</strong></a></li></ul>

    <menu>
      {#if isAuthenticated}
        <li>
          <a href="/settings">Settings</a>
        </li>
        <li>
          <button onclick={logOut}> Log out </button>
        </li>
      {:else}
        <li>
          <button onclick={() => current.signUp("")}> Sign up </button>
        </li>
        <li>
          <button onclick={() => current.logIn()}> Log in </button>
        </li>
      {/if}
    </menu>
  </nav>
</header>
