<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance, type SubmitFunction } from "$app/forms";
  import { goto } from "$app/navigation";
  import type { Estudiante } from "../../../../app";
  import type { ActionData, PageData } from "./$types";

  export let data: PageData;
  export let form: ActionData;

  $: if (form?.message && browser) {
    window.alert(form.message);
  }
  let cedula = data.estudiante.cedula;
  let pagos: any = data.pago;
  let monto: any = data.monto;
  let metodo: any = data.metodo;
  let cuota1Checked: boolean = pagos.cuota1 !== "" ? true : false;
  let cuota2Checked: boolean = pagos.cuota2 !== "" ? true : false;
  let cuota3Checked: boolean = pagos.cuota3 !== "" ? true : false;
  let cuota4Checked: boolean = pagos.cuota4 !== "" ? true : false;
  let cuota5Checked: boolean = pagos.cuota5 !== "" ? true : false;
  let inscripcionChecked: boolean = pagos.inscripcion !== "" ? true : false;

  let date: Date = new Date();
  const today: string = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
  let preInscripcion: string = pagos.pre_inscripcion;
  let inscripcion: string = pagos.inscripcion ?? "";
  let cuota1: string = pagos.cuota1 ?? "";
  let cuota2: string = pagos.cuota2 ?? "";
  let cuota3: string = pagos.cuota3 ?? "";
  let cuota4: string = pagos.cuota4 ?? "";

  let cuota5: string = pagos.cuota5 ?? "";

  let montopreInscripcion: number | string =
    monto.pre_inscripcion === "0.00" ? "" : monto.pre_inscripcion;
  let montoinscripcion: number | string =
    monto.inscripcion === "0.00" ? "" : monto.inscripcion;
  let montocuota1: number | string =
    monto.cuota1 === "0.00" ? "" : monto.cuota1;
  let montocuota2: number | string =
    monto.cuota2 === "0.00" ? "" : monto.cuota2;
  let montocuota3: number | string =
    monto.cuota3 === "0.00" ? "" : monto.cuota3;
  let montocuota4: number | string =
    monto.cuota4 === "0.00" ? "" : monto.cuota4;
  let montocuota5: number | string =
    monto.cuota5 === "0.00" ? "" : monto.cuota5;

  let metodopreInscripcion: number | string =
    metodo.pre_inscripcion === "0.00" ? "" : metodo.pre_inscripcion;
  let metodoinscripcion: number | string =
    metodo.inscripcion === "0.00" ? "" : metodo.inscripcion;
  let metodocuota1: number | string =
    metodo.cuota1 === "0.00" ? "" : metodo.cuota1;
  let metodocuota2: number | string =
    metodo.cuota2 === "0.00" ? "" : metodo.cuota2;
  let metodocuota3: number | string =
    metodo.cuota3 === "0.00" ? "" : metodo.cuota3;
  let metodocuota4: number | string =
    metodo.cuota4 === "0.00" ? "" : metodo.cuota4;
  let metodocuota5: number | string =
    metodo.cuota5 === "0.00" ? "" : metodo.cuota5;

  $: if (inscripcionChecked && inscripcion === "") inscripcion = today;
  $: if (cuota1Checked && cuota1 === "") cuota1 = today;
  $: if (cuota2Checked && cuota2 === "") cuota2 = today;
  $: if (cuota3Checked && cuota3 === "") cuota3 = today;
  $: if (cuota4Checked && cuota4 === "") cuota4 = today;
  $: if (cuota5Checked && cuota5 === "") cuota5 = today;

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

  const handlePago: SubmitFunction = ({ data, cancel }) => {
    const clave = prompt(
      "Ingrese la clave otorgada para poder registrar los cambios efectuados"
    );
    if (clave !== "12345") {
      alert("Clave inválida");
      return cancel();
    }
    return async ({ update }) => {
      await update();
      const logs: any = browser
        ? JSON.parse(localStorage.getItem("log") as unknown as string) || []
        : [];
      logs.push(
        `${new Date().getDate()} de ${
          months[new Date().getMonth()]
        } del año ${new Date().getFullYear()} a las ${
          new Date().getHours() > 9
            ? new Date().getHours()
            : "0" + new Date().getHours()
        }:${
          new Date().getMinutes() > 9
            ? new Date().getMinutes()
            : "0" + new Date().getMinutes()
        }:${
          new Date().getSeconds() > 9
            ? new Date().getSeconds()
            : "0" + new Date().getSeconds()
        } >>> se ha modificado un pago del estudiande con la cédula ${cedula}, campos modificados: ${
          preInscripcion !== pagos.pre_inscripcion ? "preinscripcion," : ""
        } ${inscripcion !== pagos.inscripcion ? "inscripcion," : ""} ${
          cuota1 !== pagos.cuota1 ? "cuota1," : ""
        } ${cuota2 !== pagos.cuota2 ? "cuota2," : ""} ${
          cuota3 !== pagos.cuota3 ? "cuota3," : ""
        } ${cuota4 !== pagos.cuota4 ? "cuota4," : ""} ${
          cuota5 !== pagos.cuota5 ? "cuota5," : ""
        } ${
          montopreInscripcion != monto.pre_inscripcion &&
          monto.pre_inscripcion != "0.00"
            ? "monto de la preinscripcion,"
            : ""
        } ${
          montoinscripcion != monto.inscripcion && monto.inscripcion !== "0.00"
            ? "monto de la inscripcion,"
            : ""
        } ${
          montocuota1 != monto.cuota1 && monto.cuota1 !== "0.00"
            ? "monto de la cuota 1,"
            : ""
        } ${
          montocuota2 != monto.cuota2 && monto.cuota2 !== "0.00"
            ? "monto de la cuota 2,"
            : ""
        } ${
          montocuota3 != monto.cuota3 && monto.cuota3 !== "0.00"
            ? "monto de la cuota 3,"
            : ""
        } ${
          montocuota4 != monto.cuota4 && monto.cuota4 !== "0.00"
            ? "monto de la cuota 4,"
            : ""
        } ${
          montocuota5 != monto.cuota5 && monto.cuota5 !== "0.00"
            ? "monto de la cuota 5"
            : ""
        }`
      );
      localStorage.setItem("log", JSON.stringify(logs));
      window.location.reload();
    };
  };
</script>

<section class="main w-full">
  <div class="!bg-[#EEEEEEEE] overflow-y-auto p-7 gap-y-5 w-full h-full">
    <div class="flex w-full justify-between items-center p-8">
      <h2 class="text-5xl text-pink-500 font-bold">Pago</h2>
      <a
        href="/pagos"
        class="bg-sky-600 rounded-lg text-light-50 text-2xl font-bold w-auto px-7 py-1"
        >Volver atrás</a
      >
    </div>
    <article
      class="flex justify-center items-center md:items-center md:gap-x-5"
    >
      <form
        method="post"
        action="?/pago"
        use:enhance="{handlePago}"
        class="w-1/2 h-[fit-content]"
      >
        <input type="hidden" name="id_monto" value="{monto.id}" />
        <input type="hidden" name="id_pago" value="{monto.id_pago}" />
        <label for="pre_inscripcion" class="flex flex-col">
          Preinscripción
          <div class="flex text-lg w-full items-end gap-5">
            <input
              class="bg-transparent border-dashed border-2 w-1/3 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
              required
              type="date"
              max="{today}"
              name="pre_inscripcion"
              id="pre_inscripcion"
              on:invalid="{() => {
                let html = window.document.getElementById('pre_inscripcion');
                html.setCustomValidity(
                  'El valor debe ser igual a la fecha actual o anterior'
                );
              }}"
              bind:value="{preInscripcion}"
            />
            <section
              class="bg-transparent border-dashed border-2 w-1/3 flex items-center h-[fit-content] border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3"
                >{#if metodopreInscripcion === "dolares"}${:else}Bs.{/if}</span
              >
              <input
                type="number"
                step="0.01"
                name="monto_pre_inscripcion"
                required
                min="0"
                placeholder="Ingrese monto"
                bind:value="{montopreInscripcion}"
                class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
              />
            </section>
            <section
              class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <select
                name="metodo_pre_inscripcion"
                id="prefijo"
                bind:value="{metodopreInscripcion}"
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[8px] w-full"
              >
                <option value="disabled" disabled
                  >Elija un método de pago</option
                >
                <option value="transferencia">Transferencia</option>
                <option value="bolivares">Efectivo en Bolívares</option>
                <option value="dolares">Efectivo en Dólares</option>
              </select>
            </section>
          </div>
        </label>
        <label for="inscripcion-check" class="block my-3">
          <input
            type="checkbox"
            id="inscripcion-check"
            checked="{inscripcionChecked}"
            on:change="{() => (inscripcionChecked = !inscripcionChecked)}"
          />
          Inscripción
        </label>
        {#if inscripcionChecked}
          <label for="inscripcion" class="flex flex-col">
            <div class="flex text-lg w-full items-end gap-5">
              <input
                class="bg-transparent border-dashed border-2 w-1/3 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                required
                type="date"
                min="{preInscripcion}"
                max="{today}"
                on:invalid="{() => {
                  let html = window.document.getElementById('inscripcion');
                  html.setCustomValidity(
                    'El valor debe ser igual a la fecha actual o posterior a la preinscripcion'
                  );
                }}"
                name="inscripcion"
                id="inscripcion"
                bind:value="{inscripcion}"
              />
              <section
                class="bg-transparent border-dashed border-2 w-1/3 flex items-center h-[fit-content] border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
              >
                <span class="text-xl px-3"
                  >{#if metodoinscripcion === "dolares"}${:else}Bs.{/if}</span
                >
                <input
                  type="number"
                  step="0.01"
                  name="monto_inscripcion"
                  required
                  min="0"
                  placeholder="Ingrese monto"
                  bind:value="{montoinscripcion}"
                  class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
                />
              </section>
              <section
                class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
              >
                <select
                  name="metodo_inscripcion"
                  id="prefijo"
                  bind:value="{metodoinscripcion}"
                  class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[8px] w-full"
                >
                  <option value="disabled" disabled
                    >Elija un método de pago</option
                  >
                  <option value="transferencia">Transferencia</option>
                  <option value="bolivares">Efectivo en Bolívares</option>
                  <option value="dolares">Efectivo en Dólares</option>
                </select>
              </section>
            </div>
          </label>
        {/if}
        {#if inscripcionChecked}
          <label for="cuota1-check" class="block my-3">
            <input
              type="checkbox"
              name=""
              id="cuota1-check"
              checked="{cuota1Checked}"
              on:change="{() => (cuota1Checked = !cuota1Checked)}"
            />
            Cuota 1
          </label>
          {#if cuota1Checked}
            <label for="cuota1" class="flex flex-col">
              <div class="flex text-lg w-full items-end gap-5">
                <input
                  class="bg-transparent border-dashed border-2 w-1/3 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                  required
                  type="date"
                  on:invalid="{() => {
                    let html = window.document.getElementById('cuota1');
                    html.setCustomValidity(
                      'El valor debe ser igual a la fecha actual o posterior a la fecha de la inscripcion'
                    );
                  }}"
                  min="{inscripcion}"
                  max="{today}"
                  name="cuota1"
                  id="cuota1"
                  bind:value="{cuota1}"
                />
                <section
                  class="bg-transparent border-dashed border-2 w-1/3 flex items-center h-[fit-content] border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                >
                  <span class="text-xl px-3"
                    >{#if metodocuota1 === "dolares"}${:else}Bs.{/if}</span
                  >
                  <input
                    type="number"
                    step="0.01"
                    name="monto_cuota1"
                    required
                    min="0"
                    placeholder="Ingrese monto"
                    bind:value="{montocuota1}"
                    class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
                  />
                </section>
                <section
                  class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                >
                  <select
                    name="metodo_cuota1"
                    id="prefijo"
                    bind:value="{metodocuota1}"
                    class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[8px] w-full"
                  >
                    <option value="disabled" disabled
                      >Elija un método de pago</option
                    >
                    <option value="transferencia">Transferencia</option>
                    <option value="bolivares">Efectivo en Bolívares</option>
                    <option value="dolares">Efectivo en Dólares</option>
                  </select>
                </section>
              </div>
            </label>
          {/if}
        {/if}
        {#if inscripcionChecked && cuota1Checked}
          <label for="cuota2-check" class="block my-3">
            <input
              type="checkbox"
              name=""
              id="cuota2-check"
              checked="{cuota2Checked}"
              on:change="{() => (cuota2Checked = !cuota2Checked)}"
            />
            Cuota 2
          </label>
          {#if cuota2Checked}
            <label for="cuota2" class="flex flex-col">
              <div class="flex text-lg w-full items-end gap-5">
                <input
                  class="bg-transparent border-dashed border-2 w-1/3 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                  required
                  type="date"
                  on:invalid="{() => {
                    let html = window.document.getElementById('cuota2');
                    html.setCustomValidity(
                      'El valor debe ser igual a la fecha actual o posterior a la fecha de la cuota 1'
                    );
                  }}"
                  min="{cuota1}"
                  max="{today}"
                  name="cuota2"
                  id="cuota2"
                  bind:value="{cuota2}"
                />
                <section
                  class="bg-transparent border-dashed border-2 w-1/3 flex items-center h-[fit-content] border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                >
                  <span class="text-xl px-3"
                    >{#if metodocuota2 === "dolares"}${:else}Bs.{/if}</span
                  >
                  <input
                    type="number"
                    step="0.01"
                    name="monto_cuota2"
                    required
                    min="0"
                    placeholder="Ingrese monto"
                    bind:value="{montocuota2}"
                    class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
                  />
                </section>
                <section
                  class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                >
                  <select
                    name="metodo_cuota2"
                    id="prefijo"
                    bind:value="{metodocuota2}"
                    class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[8px] w-full"
                  >
                    <option value="disabled" disabled
                      >Elija un método de pago</option
                    >
                    <option value="transferencia">Transferencia</option>
                    <option value="bolivares">Efectivo en Bolívares</option>
                    <option value="dolares">Efectivo en Dólares</option>
                  </select>
                </section>
              </div>
            </label>
          {/if}
        {/if}
        {#if inscripcionChecked && cuota1Checked && cuota2Checked}
          <label for="cuota3-check" class="block my-3">
            <input
              type="checkbox"
              name=""
              id="cuota3-check"
              checked="{cuota3Checked}"
              on:change="{() => (cuota3Checked = !cuota3Checked)}"
            />
            Cuota 3
          </label>
          {#if cuota3Checked}
            <label for="cuota3" class="flex flex-col">
              <div class="flex text-lg w-full items-center gap-5">
                <input
                  class="bg-transparent border-dashed border-2 w-1/3 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                  required
                  type="date"
                  min="{cuota2}"
                  max="{today}"
                  name="cuota3"
                  id="cuota3"
                  bind:value="{cuota3}"
                  on:invalid="{() => {
                    let html = window.document.getElementById('cuota3');
                    html.setCustomValidity(
                      'El valor debe ser igual a la fecha actual o posterior a la fecha de la cuota 2'
                    );
                  }}"
                />
                <section
                  class="bg-transparent border-dashed border-2 w-1/3 flex items-center h-[fit-content] border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                >
                  <span class="text-xl px-3"
                    >{#if metodocuota3 === "dolares"}${:else}Bs.{/if}</span
                  >
                  <input
                    type="number"
                    step="0.01"
                    name="monto_cuota3"
                    required
                    min="0"
                    placeholder="Ingrese monto"
                    bind:value="{montocuota3}"
                    class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
                  />
                </section>
                <section
                  class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                >
                  <select
                    name="metodo_cuota3"
                    id="prefijo"
                    bind:value="{metodocuota3}"
                    class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[8px] w-full"
                  >
                    <option value="disabled" disabled
                      >Elija un método de pago</option
                    >
                    <option value="transferencia">Transferencia</option>
                    <option value="bolivares">Efectivo en Bolívares</option>
                    <option value="dolares">Efectivo en Dólares</option>
                  </select>
                </section>
              </div>
            </label>
          {/if}
        {/if}
        {#if inscripcionChecked && cuota1Checked && cuota2Checked && cuota3Checked}
          <label for="cuota4-check" class="block my-3">
            <input
              type="checkbox"
              name=""
              id="cuota4-check"
              checked="{cuota4Checked}"
              on:change="{() => (cuota4Checked = !cuota4Checked)}"
            />
            Cuota 4
          </label>
          {#if cuota4Checked}
            <label for="cuota4" class="flex flex-col">
              <div class="flex text-lg w-full gap-5">
                <input
                  class="bg-transparent border-dashed border-2 w-1/3 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                  required
                  type="date"
                  min="{cuota3}"
                  max="{today}"
                  name="cuota4"
                  on:invalid="{() => {
                    let html = window.document.getElementById('cuota4');
                    html.setCustomValidity(
                      'El valor debe ser igual a la fecha actual o posterior a la fecha de la cuota 3'
                    );
                  }}"
                  id="cuota4"
                  bind:value="{cuota4}"
                />
                <section
                  class="bg-transparent border-dashed border-2 w-1/3 flex items-center h-[fit-content] border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                >
                  <span class="text-xl px-3"
                    >{#if metodocuota4 === "dolares"}${:else}Bs.{/if}</span
                  >
                  <input
                    type="number"
                    step="0.01"
                    name="monto_cuota4"
                    required
                    min="0"
                    placeholder="Ingrese monto"
                    bind:value="{montocuota4}"
                    class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
                  />
                </section>
                <section
                  class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                >
                  <select
                    name="metodo_cuota4"
                    id="prefijo"
                    bind:value="{metodocuota4}"
                    class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[8px] w-full"
                  >
                    <option value="disabled" disabled
                      >Elija un método de pago</option
                    >
                    <option value="transferencia">Transferencia</option>
                    <option value="bolivares">Efectivo en Bolívares</option>
                    <option value="dolares">Efectivo en Dólares</option>
                  </select>
                </section>
              </div>
            </label>
          {/if}
        {/if}
        {#if inscripcionChecked && cuota1Checked && cuota2Checked && cuota3Checked && cuota4Checked}
          <label for="cuota5-check" class="block my-3">
            <input
              type="checkbox"
              name=""
              id="cuota5-check"
              checked="{cuota5Checked}"
              on:change="{() => (cuota5Checked = !cuota5Checked)}"
            />
            Cuota 5
          </label>
          {#if cuota5Checked}
            <label for="cuota1" class="flex flex-col">
              <div class="flex w-full items-end gap-5 text-lg">
                <input
                  class="bg-transparent border-dashed border-2 w-1/3 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                  required
                  type="date"
                  min="{cuota4}"
                  max="{today}"
                  on:invalid="{() => {
                    let html = window.document.getElementById('cuota5');
                    html.setCustomValidity(
                      'El valor debe ser igual a la fecha actual o posterior a la preinscripcion'
                    );
                  }}"
                  name="cuota5"
                  id="cuota5"
                  bind:value="{cuota5}"
                />
                <section
                  class="bg-transparent border-dashed border-2 w-1/3 flex items-center h-[fit-content] border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                >
                  <span class="text-xl px-3"
                    >{#if metodocuota5 === "dolares"}${:else}Bs.{/if}</span
                  >
                  <input
                    type="number"
                    step="0.01"
                    name="monto_cuota5"
                    required
                    min="0"
                    placeholder="Ingrese monto"
                    bind:value="{montocuota5}"
                    class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
                  />
                </section>
                <section
                  class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                >
                  <select
                    name="metodo_cuota5"
                    id="prefijo"
                    bind:value="{metodocuota5}"
                    class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[8px] w-full"
                  >
                    <option value="disabled" disabled
                      >Elija un método de pago</option
                    >
                    <option value="transferencia">Transferencia</option>
                    <option value="bolivares">Efectivo en Bolívares</option>
                    <option value="dolares">Efectivo en Dólares</option>
                  </select>
                </section>
              </div>
            </label>
          {/if}
        {/if}
        <div class="flex justify-center gap-4 items-center w-full p-3">
          <button
            type="submit"
            formaction="?/pago"
            class="bg-rose-600 rounded-lg text-light-50 !text-lg font-bold w-auto px-10 py-1"
            >Guardar cambios del pago</button
          >
        </div>
      </form>
    </article>
  </div>
</section>

<style>
  .main {
    height: calc(100vh - 100px);
    background-image: url("$lib/images/pascalConFondo.png");
    background-position: center;
    background-size: cover;
  }

  form > label,
  form button {
    font-size: 24px;
  }

  :global(input[type="checkbox"]) {
    color: #db0081;
    border-color: #db0081;
  }

  :global(input[type="checkbox"]:focus) {
    box-shadow: 0 0 0 0;
  }
</style>
