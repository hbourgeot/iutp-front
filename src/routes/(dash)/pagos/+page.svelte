<script lang="ts">
  import { createSearchStore, searchHandler } from "$lib/resources/store";
  import { onDestroy } from "svelte";
  import type { Estudiante, Pago, PagosEstudiante } from "../../../app";
  import type { SubmitFunction } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import ModalLarge from "$lib/components/ModalLarge.svelte";
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";

  export let data: PageData;
  export let form: ActionData;

  $: if (form?.message){
    alert(form.message)
  }

  let estado: string = "en curso";
  let addPago: boolean = false;
  let estudiantes: {cedula: string, nombre: string}[] = data.estudiantes;
  let pagos: Pago[] = data.pagos;
  let cedula: string = estudiantes[0].cedula;
  let pagosTerms = pagos.map((pago) => ({
    ...pago,
    searchTerms: `${pago.cedula_estudiante} ${pago.cedula_estudiante.replace("V-" || "E-", "")} ${pago.cuota1} ${pago.cuota2} ${pago.cuota3} ${pago.cuota4} ${pago.cuota5} ${pago.pre_inscripcion} ${pago.inscripcion}`,
  }));

  let cuota1Checked: boolean = false;
  let cuota2Checked: boolean = false;
  let cuota3Checked: boolean = false;
  let cuota4Checked: boolean = false;
  let cuota5Checked: boolean = false;
  let inscripcionChecked: boolean = false;

  let date: Date = new Date()
  const today: string = `${date.getFullYear()}-${date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1 }-${date.getDate() < 10 ? '0'+date.getDate() : date.getDate()}`
  let preInscripcion: string = today;
  let inscripcion: string = "";
  let cuota1: string = "";
  let cuota2: string = "";
  let cuota3: string = "";
  let cuota4: string = "";
  let cuota5: string = "";

  $: if(inscripcionChecked) inscripcion = today;
  $: if(cuota1Checked) cuota1 = today;
  $: if(cuota2Checked) cuota2 = today;
  $: if(cuota3Checked) cuota3 = today;
  $: if(cuota4Checked) cuota4 = today;
  $: if(cuota5Checked) cuota5 = today;

  const pagosSearch = createSearchStore(pagosTerms);

  const unsubscribe = pagosSearch.subscribe((model) =>
    searchHandler(model)
  );

  onDestroy(() => {
    unsubscribe();
  });

  const handleSubmit: SubmitFunction = ({data}) => {
    return async({update})=>{
      await update()
      addPago = false;
      window.location.reload()
    }
  }
</script>

<section class="flex flex-col p-7 gap-y-5 w-full overflow-x-auto">
  <div class="flex self-end justify-around items-center w-full md:w-[600px]">
    <button
      type="button"
      class="rounded-lg bg-blue-400 text-white font-bold py-3 px-5"
      on:click="{() => (addPago = true)}">Registrar Pago</button
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
          <p class="text-xl w-full bordered">{pago.cedula_estudiante}</p>
          {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around"> 
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Preinscripción</h3>
        {#each $pagosSearch.filtered as pago}
        <div class="h-full flex flex-col justify-start">
          <p class="text-xl w-full">{pago.pre_inscripcion}</p>
        <p class="text-xl w-full bordered"><span class="font-bold">Monto:</span> 9000 Bs</p>
      </div>
        {/each}
      </div>
      <div class="flex flex-col justify-around"> 
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Inscripcion</h3>
        <div class="h-full flex flex-col justify-start gap-y-15">
        {#each $pagosSearch.filtered as pago}
        <p class="text-xl w-full bordered">{pago.inscripcion}</p>
        {/each}
      </div>
      </div>
      <div class="flex flex-col justify-around"> 
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Cuota 1</h3>
        <div class="h-full flex flex-col justify-start gap-y-15">
        {#each $pagosSearch.filtered as pago}
        <p class="text-xl w-full bordered">{pago.cuota1 ?? "No registrada"}</p>
        {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around"> 
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Cuota 2</h3>
        <div class="h-full flex flex-col justify-start gap-y-15">
        {#each $pagosSearch.filtered as pago}
        <p class="text-xl w-full bordered">{pago.cuota2 ?? "No registrada"}</p>
        {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around"> 
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Cuota 3</h3>
        <div class="h-full flex flex-col justify-start gap-y-15">
        {#each $pagosSearch.filtered as pago}
        <p class="text-xl w-full bordered">{pago.cuota3 ?? "No registrada"}</p>
        {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around"> 
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Cuota 4</h3>
        <div class="h-full flex flex-col justify-start gap-y-15">
        {#each $pagosSearch.filtered as pago}
        <p class="text-xl w-full bordered">{pago.cuota4 ?? "No registrada"}</p>
        {/each}
        </div>
      </div>
      <div class="flex flex-col justify-around"> 
        <h3 class="text-left font-bold text-2xl text-[#db0081]">Cuota 5</h3>
        <div class="h-full flex flex-col justify-start gap-y-15">
          {#each $pagosSearch.filtered as pago}
        <p class="text-xl w-full bordered">{pago.cuota5 ?? "No registrada"}</p>
        {/each}
        </div>
      </div>
    </article>
  {:else}
    <h3 class="text-5xl font-extrabold text-[#db0081]">
      No hay estudiantes registrados.
    </h3>
  {/if}
</section>
<ModalLarge open="{addPago}" headerText="Registrar Pago" big>
  <form method="post" use:enhance={handleSubmit}>
    <label for="cedula" class="flex flex-col">
      Estudiante
      <div class="flex justify-start">
        <select
          bind:value="{cedula}"
          name="cedula"
          id="cedula"
          class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-full"
        >
        {#each estudiantes as estudiante}
          <option value="{estudiante.cedula}">{estudiante.cedula.replace("V-" || "E-", "")} - {estudiante.nombre}</option>
          {/each}
        </select>
      </div>
    </label>
    <label for="pre_inscripcion" class="flex flex-col">
      Preinscripción
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="date"
        name="pre_inscripcion"
        id="pre_inscripcion"
        bind:value="{preInscripcion}"
      />
    </label>
    <label for="inscripcion-check" class="block my-3">
      <input type="checkbox" name="" id="inscripcion-check" checked="{inscripcionChecked}" on:change="{() => inscripcionChecked = !inscripcionChecked}">
      Inscripción
    </label>
    {#if inscripcionChecked}
    <label for="inscripcion" class="flex flex-col">
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="date"
        name="inscripcion"
        id="inscripcion"
        bind:value={inscripcion}
      />
    </label>
    {/if}
    <label for="cuota1-check" class="block my-3">
      <input type="checkbox" name="" id="cuota1-check" checked="{cuota1Checked}" on:change="{() => cuota1Checked = !cuota1Checked}">
      Cuota 1
    </label>
    {#if cuota1Checked}
    <label for="cuota1" class="flex flex-col">
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="date"
        name="cuota1"
        id="cuota1"
        bind:value={cuota1}
      />
    </label>
    {/if}
    <label for="cuota2-check" class="block my-3">
      <input type="checkbox" name="" id="cuota2-check" checked="{cuota2Checked}" on:change="{() => cuota2Checked = !cuota2Checked}">
      Cuota 2
    </label>
    {#if cuota2Checked}
    <label for="cuota2" class="flex flex-col">
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="date"
        name="cuota2"
        id="cuota2"
        bind:value={cuota2}
      />
    </label>
    {/if}
    <label for="cuota3-check" class="block my-3">
      <input type="checkbox" name="" id="cuota3-check" checked="{cuota3Checked}" on:change="{() => cuota3Checked = !cuota3Checked}">
      Cuota 3
    </label>
    {#if cuota3Checked}
    <label for="cuota3" class="flex flex-col">
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="date"
        name="cuota3"
        id="cuota3"
        bind:value={cuota3}
      />
    </label>
    {/if}<label for="cuota4-check" class="block my-3">
      <input type="checkbox" name="" id="cuota4-check" checked="{cuota4Checked}" on:change="{() => cuota4Checked = !cuota4Checked}">
      Cuota 4
    </label>
    {#if cuota4Checked}
    <label for="cuota4" class="flex flex-col">
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="date"
        name="cuota4"
        id="cuota4"
        bind:value={cuota4}
      />
    </label>
    {/if}<label for="cuota5-check" class="block my-3">
      <input type="checkbox" name="" id="cuota5-check" checked="{cuota5Checked}" on:change="{() => cuota5Checked = !cuota5Checked}">
      Cuota 5
    </label>
    {#if cuota5Checked}
    <label for="cuota1" class="flex flex-col">
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="date"
        name="cuota5"
        id="cuota5"
        bind:value={cuota5}
      />
    </label>
    {/if}
    <div
      class="flex flex-col md:flex-row justify-center gap-4 items-center w-full p-3"
    >
      <button
        type="button"
        class="bg-blue-600 text-light-50 font-bold w-auto px-2 py-1"
        on:click="{() => {
          addPago = false;
        }}">Cancelar</button
      >
      <button type="reset" class="bg-red-300 font-bold w-auto px-2 py-1"
        >Resetear campos</button
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
  article > div{
    width: 100%;
    row-gap: 30px;
  }
</style>