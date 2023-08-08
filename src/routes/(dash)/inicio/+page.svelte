<script lang="ts">
  import type { PageData } from "./$types";
  import { Icon } from "@steeze-ui/svelte-icon";
  import { UserCheck, Receipt, CalendarTime } from "@steeze-ui/tabler-icons";
  export let data: PageData;

  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
</script>
<svelte:head>
    <title>Bienvenido al Sistema Administrativo del IUT Pascal</title>
</svelte:head>
<section class="w-full  overflow-y-auto flex justify-center items-center flex-col py-5 ">
    <div class='py-[20px] text-center '>
      <h2 class="text-5xl font-bold text-pink-600 font-sans text-center">
        Bienvenido
      </h2>
      <p class='pt-2 text-[16px]'>
        Seccione un modulo de gestion
      </p>
    </div>


    <div class='card-container w-[90%] gap-10 flex flex-wrap flex-row justify-center lg:justify-start lg:w-[60%] lg:gap-10 lg:h-[70%] lg:justify-center
    '>
      <a href="/estudiantes">
        <article>
          <div class='w-full flex h-[40%] justify-around items-center'>
            <figure class='bg-green-700 w-12 h-12 rounded-xl flex justify-center items-center'>
              <Icon class='w-8 h-8 text-white' src={Receipt}/>
            </figure>

            <div style="border: 1px solid #969EAF;" class='text-[#969EAF] h-[30px] flex items-center justify-center p-1 px-2 w-[100px] rounded-md text-center'  >
                Seleccionar
            </div>
          </div>

          <div class='w-full pl-4 mx-auto'>
            <h2 class='font-bold text-[#003352]'>
              Modulo Estudiantes
            </h2>

            <p>Consulte informacion respecto a estudiantes</p>
          </div>
        </article>
      </a>
        

      <a href="/movimientos">
        <article>
          <div class='w-full flex h-[40%] justify-around items-center'>
            <figure class='bg-blue-500 w-12 h-12 rounded-xl flex justify-center items-center'>
              <Icon class='w-8 h-8 text-white' src={Receipt}/>
            </figure>

            <div style="border: 1px solid #969EAF;" class='text-[#969EAF] h-[30px] flex items-center justify-center p-1 px-2 w-[100px] rounded-md text-center'  >
                Seleccionar
            </div>
          </div>

          <div class='w-full pl-4 mx-auto'>
            <h2 class='font-bold text-[#003352]'>
              Modulo Movimientos
            </h2>

            <p>Consulte informacion respecto a los movimientos</p>
          </div>
        </article>
      </a>

      <a href="/pagos">
        <article>
          <div class='w-full flex h-[40%] justify-around items-center'>
            <figure class='bg-yellow-500 w-12 h-12 rounded-xl flex justify-center items-center'>
              <Icon class='w-8 h-8 text-white' src={Receipt}/>
            </figure>

            <div style="border: 1px solid #969EAF;" class='text-[#969EAF] h-[30px] flex items-center justify-center p-1 px-2 w-[100px] rounded-md text-center'  >
                Seleccionar
            </div>
          </div>

          <div class='w-full pl-4 mx-auto'>
            <h2 class='font-bold text-[#003352]'>
              Modulo Pagos
            </h2>

            <p>Consulte informacion respecto a los pagos</p>
          </div>
        </article>
      </a>
    </div>

</section>

<style>
  section.w-full {
    height: calc(100vh - 80px);
  }

  .card-container article {
    max-width: 228px;
    width: 228px;
    min-width: 210px;
    height: 150px;
    background: white;
    border: 1px solid #c9cbcf;
    border-radius: 5px;

  }
</style>
