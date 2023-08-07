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
<section class="w-full overflow-y-auto">
  <div class="overlay flex justify-center items-center flex-col gap-20 w-full py-5">
    <h2 class="text-5xl font-bold text-pink-600 text-center">
      Bienvenido al Sistema Administrativo del IUT Pascal
    </h2>
    <div
      class="flex w-full flex-wrap items-center h-10/12 justify-center overflow-y-auto"
    >
      <article class="w-1/4 flex justify-between items-center">
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
      <article class="w-1/4 flex justify-between items-center">
        <Icon src="{Receipt}" class="h-25 w-25 stroke-pink-600" />
        <div class="w-full">
          <h3 class="text-xl font-bold text-pink-600">{data.pagos}</h3>
          <h3 class="text-xl">
            {data.pagos > 1 ? "Pagos registrados" : "Pago registrado"}
          </h3>
        </div>
      </article>
      <article class="w-1/4 flex justify-between items-center">
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
</style>
