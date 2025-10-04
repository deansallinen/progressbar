<script lang="ts">
  import { resolve } from "$app/paths";

  let { appName } = $props();
</script>

<header class="container">
  <nav>
    <ul><li><a href={resolve("/")}><strong>{appName}</strong></a></li></ul>

    <menu>
      <li>
        <a href={resolve("/settings")}>Settings</a>
      </li>
    </menu>
  </nav>
</header>
