<script lang="ts">
  import { createSearchStore, searchHandler } from "$lib/resources/store";
  import { onDestroy } from "svelte";
  import type { Pago } from "../../../app";
  import type { SubmitFunction } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import ModalLarge from "$lib/components/ModalLarge.svelte";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { moneyUsdConverter, moneyBsConverter } from "$lib/resources/moneyConverter";

  export let data: PageData;

  let addPago: boolean =
    $page.url.searchParams.get("regPago") != null ? true : false;
  let disableCedula =
    $page.url.searchParams.get("regPago") != null ? true : false;
  let estudiantes: { cedula: string; nombre: string }[] = data.estudiantes;
  let pagos: Pago[] = data.pagos;
  let cedula: string = estudiantes.length
    ? $page.url.searchParams.get("regPago") || estudiantes[0].cedula
    : "";
  let pagosTerms = pagos.map((pago) => ({
    ...pago,
    searchTerms: `${pago.cedula_estudiante} ${pago.cedula_estudiante.replace(
      "V-" || "E-",
      ""
    )} ${pago.cuota1} ${pago.cuota2} ${pago.cuota3} ${pago.cuota4} ${
      pago.cuota5
    } ${pago.pre_inscripcion} ${pago.inscripcion}`,
  }));
  let getReport: boolean = false;
  let cuota1Checked: boolean = false;
  let cuota2Checked: boolean = false;
  let cuota3Checked: boolean = false;
  let cuota4Checked: boolean = false;
  let cuota5Checked: boolean = false;
  let inscripcionChecked: boolean = false;

  let date: Date = new Date();
  const today: string = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
  let preInscripcion: string = today;
  let inscripcion: string = "";
  let cuota1: string = "";
  let cuota2: string = "";
  let cuota3: string = "";
  let cuota4: string = "";
  let cuota5: string = "";
  let montoPreInscripcion: string = today;
  let montoInscripcion: string = "";
  let montoCuota1: string = "";
  let montoCuota2: string = "";
  let montoCuota3: string = "";
  let montoCuota4: string = "";
  let montoCuota5: string = "";
  let metodoPreInscripcion: string = "disabled";
  let metodoInscripcion: string = "disabled";
  let metodoCuota1: string = "disabled";
  let metodoCuota2: string = "disabled";
  let metodoCuota3: string = "disabled";
  let metodoCuota4: string = "disabled";
  let metodoCuota5: string = "disabled";
  let reportDay: string = today;
  let opcionReporte: string = "dia";
  let cambios: string[] = [];

  $: if (inscripcionChecked) inscripcion = today;
  $: if (cuota1Checked) cuota1 = today;
  $: if (cuota2Checked) cuota2 = today;
  $: if (cuota3Checked) cuota3 = today;
  $: if (cuota4Checked) cuota4 = today;
  $: if (cuota5Checked) cuota5 = today;

  const pagosSearch = createSearchStore(pagosTerms);

  const unsubscribe = pagosSearch.subscribe((model) => searchHandler(model));

  onDestroy(() => {
    unsubscribe();
  });

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

  const handleSubmit: SubmitFunction = ({ cancel }) => {
    const date = new Date();
    let preInscripcionDate: Date = new Date(preInscripcion);
    if (
      preInscripcionDate.getMonth() === date.getMonth() &&
      preInscripcionDate.getDate() > date.getDate()
    ) {
      alert("Por favor, ingrese una fecha valida.");
      return cancel();
    }
    return async ({ update }) => {
      await update();
      addPago = false;
      let estudiante = estudiantes.find(
        (estudiante) => estudiante.cedula === cedula
      );
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
        } >>> se ha registrado un pago correspondiente al estudiante con la cédula ${cedula}`
      );
      localStorage.setItem("log", JSON.stringify(logs));
      let prei = `d=pre-inscripcion&t=${
        metodoPreInscripcion == "dolares"
          ? parseFloat(montoPreInscripcion) * parseInt(data.tasa)
          : parseFloat(montoPreInscripcion)
      }&m=${metodoPreInscripcion}&`;
      let insc = inscripcionChecked
        ? `d=inscripcion&t=${
            metodoInscripcion == "dolares"
              ? parseFloat(montoInscripcion) * parseFloat(data.tasa)
              : parseFloat(montoInscripcion)
          }&m=${metodoInscripcion}&`
        : "";
      let cuo1 = cuota1Checked
        ? `d=cuota+1&t=${
            metodoCuota1 == "dolares"
              ? parseFloat(montoCuota1) * parseFloat(data.tasa)
              : parseFloat(montoCuota1)
          }&m=${metodoCuota1}&`
        : "";
      let cuo2 = cuota2Checked
        ? `d=cuota+2&t=${
            metodoCuota2 == "dolares"
              ? parseFloat(montoCuota2) * parseFloat(data.tasa)
              : parseFloat(montoCuota2)
          }&m=${metodoCuota2}&`
        : "";
      let cuo3 = cuota3Checked
        ? `d=cuota+1&t=${
            metodoCuota1 == "dolares"
              ? parseFloat(montoCuota3) * parseFloat(data.tasa)
              : parseFloat(montoCuota3)
          }&m=${metodoCuota3}&`
        : "";
      let cuo4 = cuota4Checked
        ? `d=cuota+1&t=${
            metodoCuota1 == "dolares"
              ? parseFloat(montoCuota4) * parseFloat(data.tasa)
              : parseFloat(montoCuota4)
          }&m=${metodoCuota4}&`
        : "";
      let cuo5 = cuota5Checked
        ? `d=cuota+1&t=${
            metodoCuota1 == "dolares"
              ? parseFloat(montoCuota5) * parseFloat(data.tasa)
              : parseFloat(montoCuota5)
          }&m=${metodoCuota5}&`
        : "";
      goto(
        `/factura?e=${estudiante?.nombre}&ci=${estudiante.cedula}&${prei}${insc}${cuo1}${cuo2}${cuo3}${cuo4}${cuo5}`
      );
    };
  };

  const change = (title: string) => {
    if (!cambios.includes(title)) {
      cambios = [...cambios, title];
    }
  };
</script>

<section
  id="pagos"
  class="flex flex-col p-7 gap-y-10 w-full overflow-y-auto bg-light-50"
>
  <div class="flex self-end justify-around items-center w-[650px]">
    <button
      type="button"
      class="rounded-lg bg-blue-400 text-white font-bold py-3 px-5"
      on:click="{() => (addPago = true)}">Registrar Pago</button
    >
    <button
      type="button"
      class="rounded-lg bg-pink-400 text-white font-bold py-3 px-5"
      on:click="{() => (getReport = true)}">Descargar reporte</button
    >
    <input
      type="text"
      bind:value="{$pagosSearch.search}"
      class="self-end rounded-lg border-[#db0081] border-dashed border-4 p-2 w-[300px]"
      placeholder="Buscar pago..."
    />
  </div>
  {#if pagos.length && $pagosSearch.filtered.length}
    <table>
      <thead>
        <th>Estudiante</th>
        <th>Preinscripción</th>
        <th>Inscripción</th>
        <th>Cuota1</th>
        <th>Cuota2</th>
        <th>Cuota3</th>
        <th>Cuota4</th>
        <th>Cuota5</th>
      </thead>
      <tbody>
        {#each $pagosSearch.filtered as pago}
          <tr>
            <td
              ><a
                class="pl-5 text-[#064690] underline font-semibold"
                href="/estudiantes/{pago.cedula_estudiante}"
                >{pago.cedula_estudiante}</a
              ></td
            >
            <td>
              <p class="text-xl w-full">{pago.pre_inscripcion}</p>
              <p class="text-xl w-full bordered">
                <span class="font-bold">Monto:</span>
                 {#if pago.metodoPreInscripcion === "dolares"}{moneyUsdConverter(+pago.montoPreInscripcion)}{:else}{moneyBsConverter(+pago.montoPreInscripcion)}{/if}
              </p>
            </td>
            <td
              ><div class="h-full flex flex-col justify-start">
                <p class="text-xl w-full bordered">
                  {pago.inscripcion == "" ? "No registrada" : pago.inscripcion}
                </p>
                {#if pago.inscripcion !== ""}
                  <p class="text-xl w-full bordered">
                    <span class="font-bold">Monto:</span>
                     {#if pago.metodoInscripcion === "dolares"}{moneyUsdConverter(+pago.montoInscripcion)}{:else}{moneyBsConverter(+pago.montoInscripcion)}{/if}.
                  </p>
                {/if}
              </div>
            </td>
            <td
              ><div class="h-full flex flex-col justify-start">
                <p class="text-xl w-full bordered">
                  {pago.cuota1 == "" ? "No registrada" : pago.cuota1}
                </p>
                {#if pago.cuota1 !== ""}
                  <p class="text-xl w-full bordered">
                    <span class="font-bold">Monto:</span>
                     {#if pago.metodoCuota1 === "dolares"}{moneyUsdConverter(+pago.montoCuota1)}{:else}{moneyBsConverter(+pago.montoCuota1)}{/if}
                  </p>
                {/if}
              </div>
            </td>
            <td
              ><div class="h-full flex flex-col justify-start">
                <p class="text-xl w-full bordered">
                  {pago.cuota2 == "" ? "No registrada" : pago.cuota2}
                </p>
                {#if pago.cuota2 !== ""}
                  <p class="text-xl w-full bordered">
                    <span class="font-bold">Monto:</span>
                     {#if pago.metodoCuota2 === "dolares"}{moneyUsdConverter(+pago.montoCuota2)}{:else}{moneyBsConverter(+pago.montoCuota2)}{/if}
                  </p>
                {/if}
              </div>
            </td>
            <td
              ><div class="h-full flex flex-col justify-start">
                <p class="text-xl w-full bordered">
                  {pago.cuota3 == "" ? "No registrada" : pago.cuota3}
                </p>
                {#if pago.cuota3 !== ""}
                  <p class="text-xl w-full bordered">
                    <span class="font-bold">Monto:</span>
                     {#if pago.metodoCuota3 === "dolares"}{moneyUsdConverter(+pago.montoCuota3)}{:else}{moneyBsConverter(+pago.montoCuota3)}{/if}
                  </p>
                {/if}
              </div>
            </td>
            <td
              ><div class="h-full flex flex-col justify-start">
                <p class="text-xl w-full bordered">
                  {pago.cuota4 == "" ? "No registrada" : pago.cuota4}
                </p>
                {#if pago.cuota4 !== ""}
                  <p class="text-xl w-full bordered">
                    <span class="font-bold">Monto:</span>
                     {#if pago.metodoCuota4 === "dolares"}{moneyUsdConverter(+pago.montoCuota4)}{:else}{moneyBsConverter(+pago.montoCuota4)}{/if}
                  </p>
                {/if}
              </div>
            </td>
            <td
              ><div class="h-full flex flex-col justify-start">
                <p class="text-xl w-full bordered">
                  {pago.cuota5 == "" ? "No registrada" : pago.cuota5}
                </p>
                {#if pago.cuota5 !== ""}
                  <p class="text-xl w-full bordered">
                    <span class="font-bold">Monto:</span>
                     {#if pago.metodoCuota5 === "dolares"}{moneyUsdConverter(+pago.montoCuota5)}{:else}{moneyBsConverter(+pago.montoCuota5)}{/if}
                  </p>
                {/if}
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <h3 class="text-5xl font-extrabold text-[#db0081]">
      No hay pagos registrados.
    </h3>
  {/if}
</section>
<ModalLarge open="{addPago}" headerText="Registrar Pago" big>
  <form method="post" use:enhance="{handleSubmit}">
    <label for="cedula" class="flex flex-col">
      Estudiante
      <div class="flex justify-start">
        <select
          disabled="{disableCedula}"
          bind:value="{cedula}"
          name="cedula"
          id="cedula"
          class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-full"
        >
          {#if estudiantes.length > 0}
            {#each estudiantes as estudiante}
              <option value="{estudiante.cedula}"
                >{estudiante.cedula.replace("V-" || "E-", "")} - {estudiante.nombre}</option
              >
            {/each}
          {:else}
            <option value="" disabled
              >Registre un estudiante para registrar un pago</option
            >
          {/if}
        </select>
      </div>
    </label>
    <label for="pre_inscripcion" class="flex flex-col">
      Preinscripción
      <div class="flex w-full items-end gap-5">
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
            >{#if metodoPreInscripcion === "dolares"}${:else}Bs.{/if}</span
          >
          <input
            type="number"
            step="0.01"
            name="monto_pre_inscripcion"
            required
            min="0"
            on:change="{() => change('pre-inscripcion')}"
            placeholder="Ingrese monto"
            bind:value="{montoPreInscripcion}"
            class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
          />
        </section>
        <section
          class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        >
          <select
            name="metodo_pre_inscripcion"
            id="prefijo"
                        bind:value="{metodoPreInscripcion}"
            class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
          >
            <option value="disabled" disabled>Elija un método de pago</option>
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
        <div class="flex w-full items-end gap-5">
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
              >{#if metodoInscripcion === "dolares"}${:else}Bs.{/if}</span
            >
            <input
              type="number"
              step="0.01"
              name="monto_inscripcion"
              required
              min="0"
              on:change="{() => change('inscripcion')}"
              placeholder="Ingrese monto"
              bind:value="{montoInscripcion}"
              class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
            />
          </section>
          <section
            class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
          >
            <select
              name="metodo_inscripcion"
              id="prefijo"
                            bind:value="{metodoInscripcion}"
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
            >
              <option value="disabled" disabled>Elija un método de pago</option>
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
          <div class="flex w-full items-end gap-5">
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
                >{#if metodoCuota1 === "dolares"}${:else}Bs.{/if}</span
              >
              <input
                type="number"
                step="0.01"
                name="monto_cuota1"
                required
                min="0"
                on:change="{() => change('cuota1')}"
                placeholder="Ingrese monto"
                bind:value="{montoCuota1}"
                class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
              />
            </section>
            <section
              class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <select
                name="metodo_cuota1"
                id="prefijo"
                                bind:value="{metodoCuota1}"
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
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
          <div class="flex w-full items-end gap-5">
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
                >{#if metodoCuota2 === "dolares"}${:else}Bs.{/if}</span
              >
              <input
                type="number"
                step="0.01"
                on:change="{() => change('cuota2')}"
                name="monto_cuota2"
                required
                min="0"
                placeholder="Ingrese monto"
                bind:value="{montoCuota2}"
                class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
              />
            </section>
            <section
              class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <select
                name="metodo_cuota2"
                id="prefijo"
                                bind:value="{metodoCuota2}"
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
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
          <div class="flex w-full items-center gap-5">
            <input
              class="bg-transparent border-dashed border-2 w-1/3 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
              required
              type="date"
              min="{cuota2}"
              on:change="{() => change('cuota3')}"
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
                >{#if metodoCuota3 === "dolares"}${:else}Bs.{/if}</span
              >
              <input
                type="number"
                step="0.01"
                name="monto_cuota3"
                required
                min="0"
                placeholder="Ingrese monto"
                bind:value="{montoCuota3}"
                class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
              />
            </section>
            <section
              class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <select
                name="metodo_cuota3"
                id="prefijo"
                                bind:value="{metodoCuota3}"
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
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
          <div class="flex w-full gap-5">
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
                >{#if metodoCuota4 === "dolares"}${:else}Bs.{/if}</span
              >
              <input
                type="number"
                step="0.01"
                name="monto_cuota4"
                on:change="{() => change('cuota4')}"
                required
                min="0"
                placeholder="Ingrese monto"
                bind:value="{montoCuota4}"
                class="bg-transparent border-dashed w-[150px] border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
              />
            </section>
            <section
              class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <select
                name="metodo_cuota4"
                id="prefijo"
                                bind:value="{metodoCuota4}"
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
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
          <div class="flex w-full gap-5">
            <input
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
              required
              type="date"
              min="{cuota4}"
              max="{today}"
              name="cuota5"
              id="cuota5"
              bind:value="{cuota5}"
            />
            <section
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3"
                >{#if metodoCuota5 === "dolares"}${:else}Bs.{/if}</span
              >
              <input
                type="number"
                on:change="{() => change('cuota5')}"
                step="0.01"
                name="monto_cuota5"
                required
                min="0"
                on:invalid="{() => {
                  let html = window.document.getElementById('cuota5');
                  html.setCustomValidity(
                    'El valor debe ser igual a la fecha actual o posterior a la fecha de la cuota 4'
                  );
                }}"
                placeholder="Ingrese monto"
                bind:value="{montoCuota5}"
                class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold accent-pink-500"
              />
            </section>
            <section
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <select
                name="metodo_cuota5"
                id="prefijo"
                                bind:value="{metodoCuota5}"
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-[100px]"
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
        type="button"
        class="bg-blue-600 text-light-50 font-bold w-auto px-2 py-1"
        on:click="{() => {
          addPago = false;
          cuota1Checked = false;
          cuota2Checked = false;
          cuota3Checked = false;
          cuota4Checked = false;
          cuota5Checked = false;
          inscripcionChecked = false;
        }}">Cancelar</button
      >
      <button
        type="submit"
        class="bg-rose-600 text-light-50 font-bold w-auto px-2 py-1"
        >Añadir</button
      >
    </div>
  </form>
</ModalLarge>
<ModalLarge open="{getReport}" headerText="Generar reporte">
  <section class="flex flex-col gap-y-5">
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
          href="/dia?d={reportDay}"
          class="bg-sky-600 px-5 py-2 rounded-md text-light-50 font-bold w-1/2"
          >Generar reporte</a
        >
      {:else if opcionReporte == "semana"}
        <a
          href="/semanal"
          class="bg-sky-600 px-5 py-2 rounded-md text-light-50 font-bold w-1/2"
          >Generar reporte</a
        >
      {:else}
        <a
          href="/mensual"
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
