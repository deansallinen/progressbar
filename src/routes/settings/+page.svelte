<script lang="ts">
  import { SettingsStateClass } from "./SettingsState.svelte";
  import { JazzAccount } from "$lib/schema";
  import { AccountCoState } from "jazz-tools/svelte";
  import { goto } from "$app/navigation";
  import { resolve } from "$app/paths";

  const { logOut } = new AccountCoState(JazzAccount);

  const state = new SettingsStateClass();
  const me = $derived(state.me);

  const handleLogOut = () => {
    logOut();
    goto(resolve("/"));
  };
</script>

<div>
  <div class="flex justify-between items-center">
    <h1>Settings for {me?.profile.name}</h1>

    <button onclick={handleLogOut}> Log out </button>
  </div>
  {#if !me}
    <p>Loading your settings...</p>
  {:else}
    <div>
      <section>
        <h2>Profile</h2>
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          value={me?.profile?.name ?? ""}
          oninput={state.handleNameChange}
          placeholder="Set username"
        />
      </section>

      <section>
        <h2>Preferences</h2>
        <div>
          <label for="weight-unit" class="label">
            <span>Weight Unit</span>
          </label>
          <select
            id="weight-unit"
            value={me.root.settings.weightUnit}
            onchange={state.handleUnitChange}
          >
            <option value="lbs">Pounds (lbs)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </div>
      </section>
    </div>
  {/if}
</div>
