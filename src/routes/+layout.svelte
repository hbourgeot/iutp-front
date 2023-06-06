<script lang="ts">
  import "../app.postcss";
  import "virtual:windi.css";
</script>

<slot />

<style>
  :global(
      input[type="number"]::-webkit-inner-spin-button,
      input[type="number"]::-webkit-outer-spin-button
    ) {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
