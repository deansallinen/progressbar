<script lang="ts">
  import { JazzSvelteProvider } from "jazz-tools/svelte";
  import { apiKey } from "../apiKey";
  import Header from "$lib/components/Header.svelte";
  import { JazzAccount, ProgramCatalog } from "$lib/schema";
  import { pwaInfo } from "virtual:pwa-info";
  import "../app.css";

  import "jazz-tools/inspector/register-custom-element";

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
  AdditionalSchemas={[ProgramCatalog]}
>
  <Header {appName} />
  <main class="container">
    {@render children?.()}
  </main>
  <jazz-inspector></jazz-inspector>
</JazzSvelteProvider>
