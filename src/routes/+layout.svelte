<script lang="ts">
  import Header from "$lib/components/Header.svelte";
  import { pwaInfo } from "virtual:pwa-info";
  import "../app.css";

  let { children } = $props();

  const appName = "ProgressBar";

  const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "");
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<Header {appName} />

{@render children?.()}

<style>
  :root {
    scrollbar-gutter: stable;
    touch-action: manipulation;
  }
</style>
