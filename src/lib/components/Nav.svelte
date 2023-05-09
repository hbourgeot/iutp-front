<script>
  import pascalLogo from "$lib/images/pascalConFondo.png";
</script>

<header
  class="flex justify-between w-full h-20 items-center p-3 text-light-50 bg-[#0868b2] sticky top-0"
>
  <h1 class="text-2xl">
    <a href="/" class="flex items-center font-bold gap-1">
      <img
        src={pascalLogo}
        alt="Logo del Instituto Pascal"
        class="mr-3 w-1/12 rounded-full"
      />
      IUT Pascal</a
    >
  </h1>
  <nav class="w-auto grid grid-cols-[repeat(3,300px)] h-full justify-around">
    <a
      href="/estudiantes"
      class="text-2xl font-bold h-full flex justify-center items-center hover:bg-[#db0081] transition-background duration-100"
      >Estudiantes</a
    >
    <a
      href="/pagos"
      class="text-2xl font-bold h-full flex justify-center items-center hover:bg-[#db0081] transition-background duration-100"
      >Pagos registrados</a
    >
    <a
      href="/logout"
      class="text-2xl font-bold h-full flex justify-center items-center hover:bg-[#db0081] transition-background duration-100"
      >Cerrar sesion</a
    >
  </nav>
</header>

<style>
  @media print{
    header{
      display: none !important;
    }
  }
</style>