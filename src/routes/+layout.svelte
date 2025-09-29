<script lang="ts">
  import { JazzSvelteProvider } from "jazz-tools/svelte";
  import { apiKey } from "../apiKey";
  import Header from "$lib/components/Header.svelte";
  import { JazzAccount } from "$lib/schema";
  import { pwaInfo } from "virtual:pwa-info";

  let { children } = $props();

  const appName = "ProgressBar";

  const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : "");
</script>

<svelte:head>
  {@html webManifestLink}
</svelte:head>

<JazzSvelteProvider
  sync={{
    peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
  }}
  AccountSchema={JazzAccount}
>
  <Header {appName} />
  <main class="container">
    {@render children?.()}
  </main>
</JazzSvelteProvider>
