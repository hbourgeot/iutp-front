<script lang="ts">
    import Nav from '$lib/components/Nav.svelte';
  </script>
  <Nav/>
  
  <main class="flex justify-start items-start">
    <slot/>
  </main>

  <style>
    :global(.showing){
      top: 80px;
      left: 0 !important;
    }
    :global(body.noscroll){
        overflow: hidden;
    }
  </style>