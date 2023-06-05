<script lang="ts">
  import { createSearchStore, searchHandler } from "$lib/resources/store";
  import { onDestroy } from "svelte";
  import type { Pago } from "../../../app";
  import type { PageData } from "./$types";
  import ModalLarge from "$lib/components/ModalLarge.svelte";
  import { moneyUsdConverter, moneyBsConverter } from "$lib/resources/moneyConverter";

  export let data: PageData;

  let pagos: Pago[] = data.pagos;
  let pagosTerms = pagos.map((pago) => ({
    ...pago,
    searchTerms: `${pago.cedula_estudiante} ${pago.cedula_estudiante.replace(
      "V-" || "E-",
      ""
    )} ${pago.cuota1} ${pago.cuota2} ${pago.cuota3} ${pago.cuota4} ${
      pago.cuota5
    } ${pago.pre_inscripcion} ${pago.inscripcion}`,
  }));
  const pagosSearch = createSearchStore(pagosTerms);

  const unsubscribe = pagosSearch.subscribe((model) => searchHandler(model));

  onDestroy(() => {
    unsubscribe();
  });

  let getReport: boolean = false;
  let opcionReporte: string = "dia";
  let montoCheck: boolean;
  let filtroReporte: string = "";
  const date = new Date();
  const today: string = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
  let reportDay: string = today;
  
</script>

<section
  id="pagos"
  class="flex flex-col p-7 gap-y-10 w-full overflow-y-auto bg-light-50"
>
  <div class="flex justify-end self-end  items-center w-[650px]">
    <a
      class="rounded-lg bg-sky-600 text-white font-bold py-3 px-5" href="/pagos/registrar">Registrar Pago</a
    >
  </div>
  <section class="flex flex-col w-1/4 self-center gap-y-5">
    <h2 class="text-sky-600 text-4xl text-center font-extrabold">Reportes</h2>
    <label for="reporte">
      Seleccione su tipo de reporte
      <select
        bind:value="{opcionReporte}"
        name="reporte"
        id="reporte"
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-full"
      >
        <option value="dia">Dia</option>
        <option value="semana">Semanal</option>
        <option value="mes">Mensual</option>
      </select>
    </label>
    {#if opcionReporte === "mes"}
    <label for="monto-total">
      <input type="checkbox" id="monto-total" on:change={() => montoCheck = !montoCheck}>
      ¿Reporte de Montos totales de cada método de pago?
    </label>
    {/if}
    <label for="filtro" class="{montoCheck ? 'invisible absolute top-0 -z-5' : ''}">
      ¿Cuáles pagos desea que estén en el reporte?
      <select
        bind:value="{filtroReporte}"
        name="filtro"
        id="filtro"
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-full"
      >
        <option value="">Todos</option>
        <option value="transferencia">Transferencia</option>
        <option value="bolivares">Bolívares en efectivo</option>
        <option value="dolares">Dólares en efectivo</option>
      </select>
    </label>
    {#if opcionReporte == "dia"}
      <label for="report-date" class="w-full"
        >Fecha de reporte
        <input
          class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
          required
          type="date"
          max="{today}"
          name="report-date"
          id="report-date"
          bind:value="{reportDay}"
          on:invalid="{() => {
            let html = window.document.getElementById('cuota3');
            html.setCustomValidity(
              'El valor debe ser igual a la fecha actual o anterior'
            );
          }}"
        />
      </label>
    {/if}

    <footer class="flex justify-between gap-x-5 flex-row-reverse text-center">
      {#if opcionReporte == "dia"}
        <a
          href="/reporte/dia?d={reportDay}{filtroReporte !== '' ? `&f=${filtroReporte}` : '' }"
          class="bg-sky-600 px-5 py-2 rounded-md text-light-50 font-bold w-1/2"
          >Generar reporte</a
        >
      {:else if opcionReporte == "semana"}
        <a
          href="/reporte/semanal{filtroReporte !== '' ? `?f=${filtroReporte}` : '' }"
          class="bg-sky-600 px-5 py-2 rounded-md text-light-50 font-bold w-1/2"
          >Generar reporte</a
        >
      {:else}
        <a
          href="/reporte/mensual?{montoCheck ? 'm=monto' : 'm=no'}{filtroReporte !== '' ? `&f=${filtroReporte}` : '' }"
          class="bg-sky-600 px-5 py-2 rounded-md text-light-50 font-bold w-1/2"
          >Generar reporte</a
        >
      {/if}
      <button
        type="button"
        on:click="{() => (getReport = false)}"
        class="bg-pink-600 px-5 py-2 rounded-md text-light-50 font-bold w-1/2"
        >Cancelar</button
      >
    </footer>
  </section>
</section>
<ModalLarge open="{getReport}" headerText="Generar reporte">
</ModalLarge>

<style lang="scss">
  #pagos {
    height: calc(100vh - 100px);
  }

  :global(input[type="checkbox"]) {
    color: #db0081;
    border-color: #db0081;
  }

  :global(input[type="checkbox"]:focus) {
    box-shadow: 0 0 0 0;
  }

  table {
    font-size: 25px;
    line-height: 1.5;
  }

  thead th {
    text-align: left;
  }

  tbody tr:nth-child(odd) {
    background-color: lighten($color: #db0081, $amount: 50%);
  }

  th,
  td {
    padding: 10px 0;
  }
</style>
