<script lang="ts">
  import { SettingsStateClass } from "./SettingsState.svelte";

  const state = new SettingsStateClass();
  const me = $derived(state.me);
</script>

<div>
  <h1>Settings for {me?.profile.name}</h1>

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
