<script lang="ts">
  import { onMount } from "svelte";
  import type { Estudiante, Pago } from "../../../app";
  import type { PageData } from "./$types";
  import DatePicker from "@beyonk/svelte-datepicker/src/components/DatePicker.svelte";
  import { Autocomplete, popup } from "@skeletonlabs/skeleton";
  import {
    computePosition,
    autoUpdate,
    offset,
    shift,
    flip,
    arrow,
  } from "@floating-ui/dom";
  import { storePopup } from "@skeletonlabs/skeleton";
  import type {
    AutocompleteOption,
    PopupSettings,
  } from "@skeletonlabs/skeleton";

  // Your selected Skeleton theme:

  export let data: PageData;

  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });
  let estudiantes: Estudiante[] | undefined = data.estudiantes;
  const carreras = [
    "Informática",
    "Tecnología de Alimentos",
    "Comunicación y Electrónica",
    "Diseño Gráfico",
    "Contabilidad y Costos",
    "Administración Bancaria y Financiera",
    "Administración Empresarial",
  ];
  let estudiantesComplete: AutocompleteOption[] = estudiantes?.map(
    (estudiante) => ({
      label: `${estudiante.cedula} - ${estudiante.nombre}`,
      value: estudiante.cedula,
      keywords: `${estudiante.cedula}, ${estudiante.cedula.replace(
        "V-" || "E-",
        ""
      )}, ${estudiante.correo}, ${estudiante.estado}, ${
        estudiante.telefono
      }, ${carreras[estudiante.carrera - 1].toLowerCase()}, ${
        estudiante.semestre
      }to, ${estudiante.nombre.toLowerCase()}`,
      meta: { healthy: false },
    })
  ) as unknown as AutocompleteOption[];
  let opcionReporte: string = "dia";
  let filtroReporte: string = "";
  let verEstudiante: string = estudiantes ? estudiantes[0].cedula : "";
  const date = new Date();
  const today: string = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
  let reportDay: any;
  let selected: any;

  let popupSettings: PopupSettings = {
    event: "focus-click",
    target: "popupAutocomplete",
    placement: "bottom",
  };

  let inputPopupDemo: string = "";

  function formatDate(date = new Date()) {
    const year = date.toLocaleString("default", { year: "numeric" });
    const month = date.toLocaleString("default", { month: "2-digit" });
    const day = date.toLocaleString("default", { day: "2-digit" });
    return [year, month, day].join("-");
  }

  function onStudentSelection(event: any): void {
    inputPopupDemo = event.detail.label;
    verEstudiante = event.detail.value;
    console.log(verEstudiante);
  }
</script>

<main id="pagos" class="w-full">
  <section
    class="!bg-[#EEEEEEEE] h-full flex flex-col p-7 gap-y-10 w-full overflow-y-auto"
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

          <input
            class="input autocomplete rounded-sm placeholder-light-50/90 text-light-50 p-4"
            type="search"
            name="autocomplete-search"
            bind:value="{inputPopupDemo}"
            placeholder="Buscar pagos..."
            use:popup="{popupSettings}"
          />
          <div data-popup="popupAutocomplete">
            <Autocomplete
              bind:input="{inputPopupDemo}"
              class="bg-sky-600 text-light-50  w-full py-2 w-1/4 px-11"
              options="{estudiantesComplete}"
              on:selection="{onStudentSelection}"
            />
          </div>
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
            class="bg-transparent border border-gray-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-full"
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
            class="bg-transparent border border-gray-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-full"
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
