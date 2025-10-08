<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import { pwaInfo } from "virtual:pwa-info";
  import "../app.css";
  import { setSettingsState } from "./settings/SettingsState.svelte";

  let { children } = $props();

  const appName = "ProgressBar";

  const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "");

  setSettingsState();
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<Header {appName} />
<main class="container">
  {@render children?.()}
</main>
