<script lang="ts">
  import { createSearchStore, searchHandler } from "$lib/resources/store";
  import { onDestroy } from "svelte";
  import type { Pago } from "../../../app";
  import type { SubmitFunction } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import BtnPdf from "$lib/components/BtnPDF.svelte";
  import ModalLarge from "$lib/components/ModalLarge.svelte";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import { jsPDF } from "jspdf";
  import { goto } from "$app/navigation";

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
  let pdfData: {
    cedula: string;
    nombre: string;
    pago: string;
    monto: number;
  }[] = [];
  $: pdfData = data.pdf as unknown as {
    cedula: string;
    nombre: string;
    pago: string;
    monto: number;
  }[];

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
      window.location.reload();
    };
  };

  function pdf() {
    const doc = new jsPDF("p", "px", "letter");
    const thePDF: HTMLElement = window.document.getElementById(
      "thepdf"
    ) as unknown as HTMLElement;

    doc.html(thePDF, {
      callback: function (doc) {
        doc.save("reporte.pdf");
      },
      x: 10,
      y: 10,
      width: 150,
      windowWidth: 280,
    });
  }
</script>

<section class="flex flex-col p-7 gap-y-5 h-screen-sm w-full bg-light-50">
  <div class="flex self-end justify-around items-center w-full md:w-[650px]">
    <button
      type="button"
      class="rounded-lg bg-blue-400 text-white font-bold py-3 px-5"
      on:click="{() => (addPago = true)}">Registrar Pago</button
    >
    <button
      type="button"
      class="rounded-lg bg-pink-400 text-white font-bold py-3 px-5"
      on:click="{() => pdf()}">Descargar reporte</button
    >
    <input
      type="text"
      bind:value="{$pagosSearch.search}"
      class="self-end rounded-lg border-[#db0081] border-dashed border-4 w-full md:w-[300px]"
      placeholder="Buscar pago..."
    />
  </div>
  {#if pagos.length && $pagosSearch.filtered.length}
    <article class="flex justify-between gap-x-4 min-w-full">
      <div class="flex flex-col justify-around">
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Estudiante</h3>
        <div class="h-full flex flex-col justify-start gap-y-15">
          {#each $pagosSearch.filtered as pago}
            <p class="text-xl w-full text-blue-700 font-semibold">
              <a
                href="/estudiantes/{pago.cedula_estudiante}"
                class="no-underline">{pago.cedula_estudiante}</a
              >
            </p>
          {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around">
        <h3 class="text-left font-bold text-2xl text-[#db0081]">
          Preinscripción
        </h3>
        <div class="h-full flex flex-col justify-start gap-y-8">
          {#each $pagosSearch.filtered as pago}
            <div class="h-full flex flex-col justify-start">
              <p class="text-xl w-full">{pago.pre_inscripcion}</p>
              <p class="text-xl w-full bordered">
                <span class="font-bold">Monto:</span>
                {pago.montoPreInscripcion} Bs.
              </p>
            </div>
          {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around">
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Inscripcion</h3>
        <div class="h-full flex flex-col justify-start gap-y-8">
          {#each $pagosSearch.filtered as pago}
            <div class="h-full flex flex-col justify-start">
              <p class="text-xl w-full">{pago.inscripcion}</p>
              <p class="text-xl w-full bordered">
                <span class="font-bold">Monto:</span>
                {pago.montoInscripcion} Bs.
              </p>
            </div>
          {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around">
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Cuota 1</h3>
        <div class="h-full flex flex-col justify-start gap-y-8">
          {#each $pagosSearch.filtered as pago}
            <div class="h-full flex flex-col justify-start">
              <p class="text-xl w-full bordered">
                {pago.cuota1 == "" ? "No registrada" : pago.cuota1}
              </p>
              {#if pago.cuota1 !== ""}
                <p class="text-xl w-full bordered">
                  <span class="font-bold">Monto:</span>
                  {pago.montoCuota1} Bs.
                </p>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around">
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Cuota 2</h3>
        <div class="h-full flex flex-col justify-start gap-y-8">
          {#each $pagosSearch.filtered as pago}
            <div class="h-full flex flex-col justify-start">
              <p class="text-xl w-full bordered">
                {pago.cuota2 === "" ? "No registrada" : pago.cuota2}
              </p>
              {#if pago.cuota2 !== ""}
                <p class="text-xl w-full bordered">
                  <span class="font-bold">Monto:</span>
                  {pago.montoCuota2} Bs.
                </p>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around">
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Cuota 3</h3>
        <div class="h-full flex flex-col justify-start gap-y-8">
          {#each $pagosSearch.filtered as pago}
            <div class="h-full flex flex-col justify-start">
              <p class="text-xl w-full bordered">
                {pago.cuota3 === "" ? "No registrada" : pago.cuota3}
              </p>
              {#if pago.cuota3 !== ""}
                <p class="text-xl w-full bordered">
                  <span class="font-bold">Monto:</span>
                  {pago.montoCuota3} Bs.
                </p>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around">
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Cuota 4</h3>
        <div class="h-full flex flex-col justify-start gap-y-8">
          {#each $pagosSearch.filtered as pago}
            <div class="h-full flex flex-col justify-start">
              <p class="text-xl w-full bordered">
                {pago.cuota4 === "" ? "No registrada" : pago.cuota4}
              </p>
              {#if pago.cuota4 !== ""}
                <p class="text-xl w-full bordered">
                  <span class="font-bold">Monto:</span>
                  {pago.montoCuota4} Bs.
                </p>
              {/if}
            </div>
          {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around">
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Cuota 5</h3>
        <div class="h-full flex flex-col justify-start gap-y-8">
          {#each $pagosSearch.filtered as pago}
            <div class="h-full flex flex-col justify-start">
              <p class="text-xl w-full bordered">
                {pago.cuota5 === "" ? "No registrada" : pago.cuota5}
              </p>
              {#if pago.cuota5 !== ""}
                <p class="text-xl w-full bordered">
                  <span class="font-bold">Monto:</span>
                  {pago.montoCuota5} Bs.
                </p>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    </article>
  {:else}
    <h3 class="text-5xl font-extrabold text-[#db0081]">
      No hay pagos registrados.
    </h3>
  {/if}
</section>
<BtnPdf data="{pdfData}" />
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
            <option value=""
              >Registre un estudiante para registrar un pago</option
            >
          {/if}
        </select>
      </div>
    </label>
    <label for="pre_inscripcion" class="flex flex-col">
      Preinscripción
      <div class="flex w-full gap-5">
        <input
          class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
          class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        >
          <span class="text-xl px-3">Bs.</span>
          <input
            type="number"
            step="0.01"
            name="monto_pre_inscripcion"
            required
            min="0"
            placeholder="Ingrese monto"
            class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
          />
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
        <div class="flex w-full gap-5">
          <input
            class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
            class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
          >
            <span class="text-xl px-3">Bs.</span>
            <input
              type="number"
              step="0.01"
              name="monto_inscripcion"
              required
              min="0"
              placeholder="Ingrese monto"
              class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
            />
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
          <div class="flex w-full gap-5">
            <input
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3">Bs.</span>
              <input
                type="number"
                step="0.01"
                name="monto_cuota1"
                required
                min="0"
                placeholder="Ingrese monto"
                class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold accent-pink-500"
              />
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
          <div class="flex w-full gap-5">
            <input
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3">Bs.</span>
              <input
                type="number"
                step="0.01"
                name="monto_cuota2"
                required
                min="0"
                placeholder="Ingrese monto"
                class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold accent-pink-500"
              />
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
          <div class="flex w-full gap-5">
            <input
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3">Bs.</span>
              <input
                type="number"
                step="0.01"
                name="monto_cuota3"
                required
                min="0"
                placeholder="Ingrese monto"
                class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold accent-pink-500"
              />
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
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3">Bs.</span>
              <input
                type="number"
                step="0.01"
                name="monto_cuota4"
                required
                min="0"
                placeholder="Ingrese monto"
                class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold accent-pink-500"
              />
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
              <span class="text-xl px-3">Bs.</span>
              <input
                type="number"
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
                class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold accent-pink-500"
              />
            </section>
          </div>
        </label>
      {/if}
    {/if}
    <div
      class="flex flex-col md:flex-row justify-center gap-4 items-center w-full p-3"
    >
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

<style>
  article > div {
    width: 100%;
    row-gap: 30px;
  }
  :global(input[type="checkbox"]) {
    color: #db0081;
    border-color: #db0081;
  }

  :global(input[type="checkbox"]:focus) {
    box-shadow: 0 0 0 0;
  }
</style>
