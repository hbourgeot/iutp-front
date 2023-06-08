<script lang="ts">
  import Nav from "$lib/components/Nav.svelte";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import type { LayoutData } from "./$types";
</script>

<Nav />
<main class="flex justify-start items-start relative !bg-[#EEEEEEEE]">
  <Sidebar />
  <slot />
</main>
