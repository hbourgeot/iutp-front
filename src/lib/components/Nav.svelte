<script>
  import pascalLogo from "$lib/images/pascalConFondo.png"
  import { Menu2 } from "@steeze-ui/tabler-icons";
  import { Icon } from "@steeze-ui/svelte-icon";
  function toggleSidebar(){
    window.document.querySelector("aside")?.classList.toggle("showing")
    window.document.body.classList.toggle("showing")
  }
</script>
<header class="flex justify-between w-full h-20 items-center p-3 text-light-50 bg-[#0868b2] sticky top-0">
  <h1 class="text-2xl"><a href="/" class="flex items-center font-bold gap-1">
    <img src={pascalLogo} alt="Logo del Instituto Pascal" class="mr-3 w-1/12 rounded-full">
    IUT Pascal</a></h1>
    <button on:click="{toggleSidebar}" class="md:invisible"><Icon src={Menu2} class="h-10 w-10"/></button>
  <nav class="w-auto hidden md:grid grid-cols-2 grid-cols-[repeat(2,300px)] h-full justify-around">
    <a href="/estudiantes" class="text-2xl font-bold h-full flex justify-center items-center hover:bg-[#db0081]">Estudiantes</a>
    <a href="/logout" class="text-2xl font-bold h-full flex justify-center items-center hover:bg-[#db0081]">Cerrar sesion</a>
  </nav>
</header>