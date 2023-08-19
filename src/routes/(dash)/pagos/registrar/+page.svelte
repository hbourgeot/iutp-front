<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import type { ActionData, PageData, SubmitFunction } from "./$types";
  import { moneyUsdConverter } from "$lib/resources/moneyConverter";
  import {
    RadioGroup,
    RadioItem,
    Autocomplete,
    popup,
  } from "@skeletonlabs/skeleton";
  import type {
    AutocompleteOption,
    PopupSettings,
  } from "@skeletonlabs/skeleton";
  import { DatePicker } from "attractions";
  import { Icon } from "@steeze-ui/svelte-icon";
  import { X } from "@steeze-ui/tabler-icons";
  import { triggerToast } from "$lib/utils/toast";
  import {
    computePosition,
    autoUpdate,
    offset,
    shift,
    flip,
    arrow,
  } from "@floating-ui/dom";

  import { storePopup } from "@skeletonlabs/skeleton";
  import moment from "moment";
  storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

  export let data: PageData;
  export let form: ActionData;

  $: if(form?.message){
    triggerToast(form.message, 3000)
  }

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

  let estudianteSOptions: AutocompleteOption[] = data.estudiantes.map(
    (estudiante) => ({
      label: `${estudiante.cedula} - ${estudiante.nombre}`,
      value: `${estudiante.cedula}`,
      keywords: `${estudiante.cedula}, ${estudiante.cedula.slice(
        1
      )}, ${estudiante.nombre.toLowerCase()}, ${estudiante.nombre.toUpperCase()}`,
      meta: { healthy: true },
    })
  );

  let billetes: { serial: string; monto: number }[] = [];
  let serialBillete = "";
  let montoBillete = "";
  let fecha_pago: any = null
  let totalBilletes = 0;

  let popupSettings: PopupSettings = {
    event: "focus-click",
    target: "popupAutocomplete",
    placement: "bottom",
  };

  let estudiante = "";

  function onStudentSelection(e: any): void {
    estudiante = e.detail.value;
  }

  function eliminarBillete(i: number) {
    let billete = billetes[i];
    billetes = billetes.filter((bill) => bill != billete);
    totalBilletes = billetes
      .map((billete) => billete.monto)
      .reduce((a, b) => a + b);
  }

  function addBillete() {
    if (montoBillete == "") {
      triggerToast("Por favor ingrese el monto del billete", 3000);
      return;
    }

    if (serialBillete == "") {
      triggerToast("Por favor digite el serial", 3000);
      return;
    }
    billetes = [
      ...billetes,
      { serial: serialBillete, monto: parseInt(montoBillete) },
    ];
    serialBillete = "";
    montoBillete = "";
    totalBilletes = billetes
      .map((billete) => billete.monto)
      .reduce((a, b) => a + b);
  }

  const handleSubmit: SubmitFunction = ({ formData, cancel }) => {
    for(const billete of billetes){
      formData.append("billetes", JSON.stringify(billete));
    }

    formData.append("fecha_pago", moment(fecha_pago, "DD-MM-YYYY").format("YYYY-MM-DD"))

    return async ({ update }) => {
      await update();
      let estudiante = "";
      const logs: any = browser
        ? JSON.parse(localStorage.getItem("log") as unknown as string) || []
        : [];
      logs.push(
        `${new Date().getDate()} de ${
          months[new Date().getMonth()]
        } del año ${new Date().getFullYear()} a las ${new Date().getHours()}:${
          new Date().getMinutes() > 9
            ? new Date().getMinutes()
            : "0" + new Date().getMinutes()
        }:${
          new Date().getSeconds() > 9
            ? new Date().getSeconds()
            : "0" + new Date().getSeconds()
        } >>> se ha registrado un pago correspondiente al estudiante con la cédula`
      );
      localStorage.setItem("log", JSON.stringify(logs));
    };
  };

  let selectedCedula = "";
  let selectedMetodo = "";
</script>

<main class="w-full">
  <div class="mx-auto lg:w-1/3 md:w-2/3 w-full p-4">
    <h1 class="text-2xl font-semibold mb-4">Formulario de Pago</h1>
    <form
      class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 flex flex-col gap-3" method="post" use:enhance={handleSubmit}
    >
      <!-- Campo: Cédula del Estudiante (Select) -->
      <div>
        <label
          class="text-gray-700 font-bold mb-2 label"
          for="cedula_estudiante">Estudiante</label
        >

        <input
          class="input autocomplete px-3 py-2 rounded-lg"
          type="search"
          required
          name="cedula_estudiante"
          bind:value="{estudiante}"
          placeholder="Search..."
          use:popup="{popupSettings}"
        />
        <div data-popup="popupAutocomplete" class="card bg-[#ff53b0] text-white w-full max-w-sm max-h-48 p-4 overflow-y-auto z-[555]">
          <Autocomplete
            bind:input="{estudiante}"
            options="{estudianteSOptions}"
            on:selection="{onStudentSelection}"
          />
        </div>

      </div>
      <div>
        <label class="text-gray-700 font-bold mb-2 label" for="concepto"
          >Concepto del pago</label
        >
        <select class="select p-[10px] rounded-lg capitalize" name="descripcion" id="concepto" required>
          <option value="pre_inscripcion">Pre Inscripción</option>
          <option value="inscripcion">Inscripción</option>
          <option value="cuota1">Cuota 1</option>
          <option value="cuota2">Cuota 2</option>
          <option value="cuota3">Cuota 3</option>
          <option value="cuota4">Cuota 4</option>
          <option value="cuota5">Cuota 5</option>
        </select>
      </div>
      <div>
        <label for="fecha" class="text-gray-700 font-bold mb-2 label"
          >Fecha del Pago</label
        >
        <DatePicker
          format="%d-%m-%Y"
          right="{true}"
          bind:value={fecha_pago}
          inputClass="!rounded-lg"
          disabledDates="{[{ start: new Date() }]}"
        />
      </div>
      <div>
        <!-- Campo: Método de Pago (Radio Buttons) -->
        <label class="label text-gray-700 font-bold">Método de Pago</label>
        <RadioGroup
          name="metodo_pago"
          active="variant-filled-primary"
          hover="hover:variant-soft-primary"
          rounded="rounded-lg"
          display="flex"
          class="justify-evenly"
          required
          
        >
          <RadioItem
            bind:group="{selectedMetodo}"
            name="metodo"
            value="Transferencia">Transferencia</RadioItem
          >
          <RadioItem
            bind:group="{selectedMetodo}"
            name="metodo"
            value="Efectivo">Efectivo</RadioItem
          >
          <RadioItem bind:group="{selectedMetodo}" name="metodo" value="Punto"
            >Punto</RadioItem
          >
        </RadioGroup>
      </div>
      <!-- Campos de Entidades Dependiendo del Método de Pago -->
      <!-- Campo: Monto -->
      <div>
        <label class="label text-gray-700 font-bold mb-2" for="monto"
          >Monto {selectedMetodo === "Efectivo"
            ? "del pago total ($)"
            : "(Bs.)"}</label
        >
        <input
          class="input (number) w-full py-2 px-3 rounded-lg"
          id="monto"
          name="monto"
          min="1"
          type="number"
          required
          placeholder="Monto"
        />
      </div>

      <!-- Campo: Referencia de Transferencia (solo si es Transferencia) -->
      {#if selectedMetodo === "Transferencia"}
        <div class="mb-4">
          <label
            class="label text-gray-700 font-bold mb-2"
            for="referencia_transferencia">Referencia de la Transferencia</label
          >
          <input
            class="input (number) rounded w-full py-2 px-3"
            id="referencia_transferencia"
            name="referencia_transferencia"
            type="text"
            required
            placeholder="Referencia de Transferencia"
          />
        </div>
      {/if}
      {#if selectedMetodo === "Efectivo"}
        <div class="mb-4 flex justify-start items-center gap-x-5">
          <div>
            <label class="label text-gray-700 font-bold mb-2" for="serial"
              >Serial del billete</label
            >
            <input
              class="input (number) rounded w-full py-2 px-3"
              id="serial"
              type="text"
              bind:value="{serialBillete}"
              placeholder="LDE..."
            />
          </div>
          <div>
            <label class="label text-gray-700 font-bold mb-2" for="serial"
              >Monto del billete</label
            >
            <select
              class="select rounded w-full py-3 px-3"
              id="monto-billete"
              bind:value="{montoBillete}"
              placeholder="1"
            >
              <option value="1">1$</option>
              <option value="5">5$</option>
              <option value="10">10$</option>
              <option value="20">20$</option>
              <option value="50">50$</option>
              <option value="100">100$</option>
            </select>
          </div>
          <button type="button"
            class="btn variant-filled-primary w-fit h-fit"
            on:click="{addBillete}">Añadir billete</button
          >
        </div>
        {#if billetes.length > 0}
          <table class="table">
            <thead>
              <th class="text-left !text-lg">Serial</th>
              <th class="text-left !text-lg">Monto</th>
              <th class="text-left !text-lg">Eliminar</th>
            </thead>
            <tbody>
              {#each billetes as billete, i}
                <!-- TODO: Agregar boton para eliminar el item -->
                <tr>
                  <td class=" !text-lg">{billete.serial}</td>
                  <td class=" !text-lg">{billete.monto}$</td>
                  <td class="!w-fit !text-lg"
                    ><button
                      class="btn variant-filled-surface rounded-full p-1"
                      on:click="{() => eliminarBillete(i)}"
                      ><Icon src="{X}" class="h-4 w-4" /></button
                    ></td
                  >
                </tr>
              {/each}
            </tbody>
            <tfoot>
              <tr>
                <th>Total</th>
                <th></th>
                <th>{totalBilletes}$</th>
              </tr>
            </tfoot>
          </table>
        {/if}
      {/if}

      <!-- Botón Enviar -->
      <div class="flex items-center justify-between">
        <button
          class="btn variant-filled-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="submit"
        >
          Realizar Pago
        </button>
      </div>
    </form>
  </div>
</main>

<style>
  :global(.text-field > input) {
    background-color: #e3e4ff !important;
    border: #9799fc solid 3px !important;
    color: #3751a0;
  }

  :global(.date-picker, .dropdown-shell, .handle, .text-field) {
    width: 100% !important;
  }
</style>
