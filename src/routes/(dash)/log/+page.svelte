<script lang="ts">
  import { browser } from "$app/environment";
  import type { PageData } from "./$types";

  export let data: PageData;

  const logs = browser
    ? JSON.parse(localStorage.getItem("log") as unknown as string) || [""]
    : [""];
</script>

<section class="p-4 w-full">
  <h2 class="text-5xl mt-5 mb-10 ml-4 font-bold text-[#db0089]">Movimientos registrados</h2>
  <div class="p-5 font-mono bg-gray-200 w-full overflow-y-auto">
    {#each logs as log}
      <p class="text-lg text-left">{log}</p>
    {/each}
  </div>
</section>

<style>
  div.bg-gray-200 {
    height: calc(100vh - 224px);
  }
</style>
