<script lang="ts">
  import { page } from "$app/stores";
import pascalLogo from "$lib/images/pascalConFondo.png";

</script>

<header
  class="flex justify-between h-20 items-center p-3 text-light-50 bg-[#0868b2] sticky top-0"
>
  <h1 class="text-2xl inline">
    <a href="/inicio" class="flex items-center font-bold gap-1">
      <img
        src={pascalLogo}
        alt="Logo del Instituto Pascal"
        class="mr-3 w-1/12 rounded-full"
      />
      IUT Pascal</a
    >
  </h1>
  <a
      href="/logout"
      class="text-2xl font-bold w-1/10 h-full flex justify-center items-center hover:bg-[#db0081] transition-background duration-100"
      >Cerrar sesion</a
    >
</header>

<style>
  @media print{
    header{
      display: none !important;
    }
  }

  header{
    width: 100%;
  }
</style>