<script lang="ts">
  import { onMount } from "svelte";
  import type { Estudiante, Pago } from "../../../app";
  import type { PageData } from "./$types";
  import DatePicker from "@beyonk/svelte-datepicker/src/components/DatePicker.svelte";

  export let data: PageData;

  let estudiantes: Estudiante[] | undefined = data.estudiantes;
  let opcionReporte: string = "dia";
  let montoCheck: boolean;
  let filtroReporte: string = "";
  let verEstudiante: string = estudiantes ? estudiantes[0].cedula : "";
  const date = new Date();
  const today: string = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
  let reportDay: any;
  let selected: any;

  function formatDate(date = new Date()) {
    const year = date.toLocaleString("default", { year: "numeric" });
    const month = date.toLocaleString("default", { month: "2-digit" });
    const day = date.toLocaleString("default", { day: "2-digit" });
    return [year, month, day].join("-");
  }
</script>

<main id="pagos" class="w-full">
  <section
    class="bg-light-50/90 h-full flex flex-col p-7 gap-y-10 w-full overflow-y-auto"
  >
    <div class="flex justify-end self-end items-center w-[650px]">
      <a
        class="rounded-lg bg-sky-600 text-white font-bold py-3 px-5"
        href="/pagos/registrar">Registrar Pago</a
      >
    </div>
    <div class="flex justify-around w-full">
      <section
        class="flex flex-col justify-center w-1/4 h-full self-center gap-y-5"
      >
        <h2 class="text-sky-600 text-4xl text-center font-extrabold">
          Buscar Pagos
        </h2>
        <label for="reporte">
          Seleccione el estudiante
          <select
            bind:value="{verEstudiante}"
            name="reporte"
            disabled="{estudiantes ? false : true}"
            id="reporte"
            class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-full"
          >
            {#if estudiantes}
              {#each estudiantes as estudiante}
                <option value="{estudiante.cedula}">{estudiante.nombre}</option>
              {/each}
            {:else}
              <option value="">Registre un pago para buscar</option>
            {/if}
          </select>
        </label>
        <a
          href="/pagos/{verEstudiante}"
          class="bg-pink-600 text-center px-5 py-2 rounded-md text-light-50 font-bold w-full"
          >Ver pago</a
        >
        <!-- <div class="flex flex-col self-center gap-y-5">
        <h2 class="text-center text-sky-600 text-4xl font-extrabold">
          Reporte de divisas
        </h2>
        <a
        href="/reportes/billetes"
        class="bg-pink-600 text-center px-5 py-2 rounded-md text-light-50 font-bold w-full"
        >Generar reporte</a
      >
      </div> -->
      </section>
      <section class="flex flex-col w-1/4 self-center gap-y-5">
        <h2 class="text-sky-600 text-4xl text-center font-extrabold">
          Reportes
        </h2>
        <label for="reporte">
          Seleccione su tipo de reporte
          <select
            bind:value="{opcionReporte}"
            name="reporte"
            id="reporte"
            class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-full"
          >
            <option value="dia">Dia</option>
            <option value="fecha">Fechas específicas</option>
            <option value="monto">Montos Totales</option>
          </select>
        </label>
        <label
          for="filtro"
          class="{opcionReporte == 'monto'
            ? 'invisible absolute top-0 -z-5'
            : ''}"
        >
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
        {:else}
          <DatePicker
            range="{true}"
            placeholder="Elija dos fechas"
            start="{new Date(2021, 1, 1)}"
            end="{today}"
            on:range-selected="{(e) => (selected = e.detail)}"
            bind:selected="{selected}"
            continueText="Agregar"
          />
        {/if}

        <footer
          class="flex justify-between gap-x-5 flex-row-reverse text-center"
        >
          {#if opcionReporte == "dia"}
            <a
              href="/reporte/dia?d={reportDay}{filtroReporte !== ''
                ? `&f=${filtroReporte}`
                : ''}"
              class="bg-pink-600 px-5 py-2 rounded-md text-light-50 font-bold w-full"
              >Generar reporte</a
            >
          {:else if opcionReporte == "fecha"}
            <a
              href="/reporte/fechas?fi={formatDate(
                selected?.from
              )}&ff={formatDate(selected?.to)}{filtroReporte !== ''
                ? `&f=${filtroReporte}`
                : ''}"
              class="bg-pink-600 px-5 py-2 rounded-md text-light-50 font-bold w-full"
              >Generar reporte</a
            >
          {:else}
            <a
              href="/reporte/monto?fi={formatDate(
                selected?.from
              )}&ff={formatDate(selected?.to)}"
              class="bg-pink-600 px-5 py-2 rounded-md text-light-50 font-bold w-full"
              >Generar reporte</a
            >
          {/if}
        </footer>
      </section>
    </div>
  </section>
</main>

<style lang="scss">
  #pagos {
    height: calc(100vh - 100px);
    background-image: url("$lib/images/pascalConFondo.png");
    background-position: center;
    background-size: cover;
  }

  :global(input[type="checkbox"]) {
    color: #db0081;
    border-color: #db0081;
  }

  :global(input[type="checkbox"]:focus) {
    box-shadow: 0 0 0 0;
  }
</style>
