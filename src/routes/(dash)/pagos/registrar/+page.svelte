<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import type { PageData, SubmitFunction } from "./$types";
  import { moneyUsdConverter } from "$lib/resources/moneyConverter";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
  import { DatePicker } from "attractions";
  import { Icon } from "@steeze-ui/svelte-icon";
  import { X } from "@steeze-ui/tabler-icons";

  export let data: PageData;
  export let form: FormData;

  /*if (browser) {
    if (!estudiantes.length) {
      goto("/pagos", { invalidateAll: true });
      window.alert("No existen estudiantes que no tengan pagos registrados.");
    } else {
      cedula = estudiantes[0].cedula;
    }
  }*/

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

  let billetes: {serial: string, monto: number}[] = []
  let serialBillete = "";
  let montoBillete = ""
  let totalBilletes = 0;

  function eliminarBillete(i: number){
    let billete = billetes[i];
    billetes = billetes.filter(bill => bill != billete);
    totalBilletes = billetes.map(billete => billete.monto).reduce((a, b) => a + b);
  }

  function addBillete(){
    billetes = [...billetes, {serial: serialBillete, monto: parseInt(montoBillete)}];
    serialBillete = "";
    montoBillete = ""
    totalBilletes = billetes.map(billete => billete.monto).reduce((a, b) => a + b);
  }

  const handleSubmit: SubmitFunction = ({ data, cancel }) => {
    const date = new Date();

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

<main class="w-ful">
  <div id="app" class="container mx-auto mt-8 p-4">
    <h1 class="text-2xl font-semibold mb-4">Formulario de Pago</h1>
    <form class="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
      <!-- Campo: Cédula del Estudiante (Select) -->
      <div class="mb-4 flex justify-between items-start flex-wrap gap-2">
        <div>
          <label
            class="text-gray-700 font-bold mb-2 label"
            for="cedula_estudiante">Estudiante</label
          >
          <select
            bind:value="{selectedCedula}"
            class="select p-[10px] rounded-lg capitalize"
            id="cedula_estudiante"
          >
            <option value="" disabled>Selecciona una opción</option>
            {#each data.estudiantes as est}
              <option value="{est.cedula}" class="capitalize">{est.cedula} - {est.nombre}</option>
            {/each}
          </select>
        </div>
        <div>
          <label
            class="text-gray-700 font-bold mb-2 label"
            for="concepto">Concepto del pago</label
          >
          <select
            class="select p-[10px] rounded-lg capitalize"
            id="concepto"
          >
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
          <label for="fecha" class="text-gray-700 font-bold mb-2 label">Fecha del Pago</label>
          <DatePicker
              format="%d-%m-%Y"
              right="{true}"
              inputClass="!rounded-lg"
              disabledDates="{[{ start: new Date() }]}"
            />

        </div>
        <div>
          <!-- Campo: Método de Pago (Radio Buttons) -->
            <label class="label text-gray-700 font-bold">Método de Pago</label>
            <RadioGroup
              active="variant-filled-primary"
              hover="hover:variant-soft-primary"
              rounded="rounded-lg"
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
            >Monto {selectedMetodo === "Efectivo" ? "del pago total ($)" : "(Bs.)"}</label
          >
          <input
            class="input (number) rounded w-full py-2 px-3 rounded-lg"
            id="monto"
            min="1"
            type="number"
            placeholder="Monto"
          />
        </div>
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
            type="text"
            placeholder="Referencia de Transferencia"
          />
        </div>
      {/if}
      {#if selectedMetodo === "Efectivo"}
        <div class="mb-4 flex justify-start items-center gap-x-5">
          <div>
            <label
              class="label text-gray-700 font-bold mb-2"
              for="serial">Serial del billete</label
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
            <label
              class="label text-gray-700 font-bold mb-2"
              for="serial">Monto del billete</label
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
          <button class="btn variant-filled-primary w-fit h-fit" on:click={addBillete}>Añadir billete</button>
        </div>
        {#if billetes.length > 0}
        <table class="table">
          <thead>
            <th>Serial del billete</th>
            <th>Monto del billete</th>
            <th>Acción</th>
          </thead>
          <tbody>
            {#each billetes as billete, i}
            <!-- TODO: Agregar boton para eliminar el item -->
            <tr>
              <td>{billete.serial}</td>
              <td>{billete.monto}$</td>
              <td><button class="btn variant-outline-primary rounded-full" on:click={() => eliminarBillete(i)}><Icon src={X} class="h-5 w-5"/></button></td>
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
          type="button"
        >
          Realizar Pago
        </button>
      </div>
    </form>
  </div>
</main>

<style>

  :global(.text-field > input){
    background-color: #e3e4ff !important;
    border: #9799fc solid 3px !important;
    color: #3751a0;
  }

  :global(.date-picker,.dropdown-shell,.handle,.text-field){
    width: 100% !important;
  }
</style>
