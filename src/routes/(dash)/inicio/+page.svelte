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
<section class="w-full  overflow-y-auto">
  <div class="overlay flex justify-center items-center flex-col w-full py-5 ">
    <div class='pt-[40px] text-center '>
      <h2 class="text-5xl font-bold text-pink-600 font-sans text-center">
        Bienvenido
      </h2>
      <p class='pt-2 text-[16px]'>
        Seccione un modulo de gestion
      </p>
    </div>

    <div
    class="flex w-full flex-wrap items-center px-4 h-10/12 justify-center overflow-y-auto [&>article]:max-w-[200px] lg:gap-20 lg:py-10"
  >
    <article class="w-1/3 flex justify-between items-center">
      <Icon src="{UserCheck}" class="h-25 w-25 stroke-pink-600" />
      <div class="w-full">
        <h3 class="text-xl font-bold text-pink-600">{data.estudiantes}</h3>
        <h3 class="text-xl">
          {data.estudiantes > 1
            ? "Estudiantes registrados"
            : "Estudiante registrado"}
        </h3>
      </div>
    </article>


    <article class="w-1/3 flex justify-between items-center">
      <Icon src="{Receipt}" class="h-25 w-25 stroke-pink-600" />
      <div class="w-full">
        <h3 class="text-xl font-bold text-pink-600">{data.pagos}</h3>
        <h3 class="text-xl">
          {data.pagos > 1 ? "Pagos registrados" : "Pago registrado"}
        </h3>
      </div>
    </article>
    <article class="w-1/3 flex justify-between items-center">
      <Icon src="{CalendarTime}" class="h-25 w-25 stroke-pink-600" />
      <div class="w-full">
        <h3 class="text-xl font-bold text-pink-600">{data.pagosDelMes}</h3>
        <h3 class="text-xl">
          {data.pagos > 1
            ? "Pagos registrados en " + months[new Date().getMonth()]
            : "Pago registrado en" + months[new Date().getMonth()]}
        </h3>
      </div>
    </article>
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




  </div>
</section>

<style>
  section.w-full {
    height: calc(100vh - 80px);
    width: 100%;
    background-image: url("$lib/images/pascalConFondo.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center center;
  }

  .overlay{
    background-color: rgba(255, 255, 255, 0.8);
    height: 99%;
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
