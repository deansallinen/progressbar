<script lang="ts">
  import { AccountCoState } from "jazz-tools/svelte";
  import { JazzAccount } from "$lib/schema";

  const account = new AccountCoState(JazzAccount, {
    resolve: {
      profile: true,
      root: { settings: true },
    },
  });
  const me = $derived(account.current);

  function handleUnitChange(event: Event) {
    const newUnit = (event.currentTarget as HTMLSelectElement).value;

    if (me?.root.settings) {
      me.root.settings.$jazz.set("weightUnit", newUnit);
    }
  }
</script>

<main>
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
          oninput={(e) => {
            if (!me?.profile) return;
            const target = e.target as HTMLInputElement;
            me.profile.$jazz.set("name", target.value);
          }}
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
            onchange={handleUnitChange}
          >
            <option value="lbs">Pounds (lbs)</option>
            <option value="kg">Kilograms (kg)</option>
          </select>
        </div>
      </section>
    </div>
  {/if}
</main>
