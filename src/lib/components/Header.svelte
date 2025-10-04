<script lang="ts">
  import { resolve } from "$app/paths";
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
    <ul><li><a href={resolve("/")}><strong>{appName}</strong></a></li></ul>

    <menu>
      {#if isAuthenticated}
        <li>
          <a href={resolve("/settings")}>Settings</a>
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
