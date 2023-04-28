<script lang="ts">
  import { createSearchStore, searchHandler } from "$lib/resources/store";
  import { onDestroy } from "svelte";
  import type { Estudiante, PagosEstudiante } from "../../../app";
  import type { SubmitFunction } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import ModalLarge from "$lib/components/ModalLarge.svelte";
  import { enhance } from "$app/forms";
  import { goto, invalidateAll } from "$app/navigation";

  export let data: PageData;
  export let form: ActionData;

  $: if (form?.message){
    alert(form.message)
  }

  let estado: string = "en curso";
  let documento: string = "V";
  let addStudent: boolean = false;
  let cedula: string = "";
  let cedulaInput: string = "";
  let prefijo: string = "0412";
  let telefonoInput: string = "";
  let telefono: string = ""
  $: cedula = `${documento}-${cedulaInput}`
  $: telefono = `${prefijo}-${telefonoInput}`
  let estudiantes: Estudiante[] = data.estudiantes;
  let estudiantesTerms = estudiantes.map((estudiante) => ({
    ...estudiante,
    searchTerms: `${estudiante.cedula} ${estudiante.correo} ${
      estudiante.estado
    } ${estudiante.semestre} ${
      estudiante.telefono
    } ${estudiante.nombre.toLowerCase()}`,
  }));

  const estudianteSearch = createSearchStore(estudiantesTerms);

  const unsubscribe = estudianteSearch.subscribe((model) =>
    searchHandler(model)
  );

  onDestroy(() => {
    unsubscribe();
  });

  const handleSubmit: SubmitFunction = ({data}) => {
    data.append("cedula", cedula)
    data.append("telefono", telefono)
    return async({update})=>{
        await invalidateAll()
        await update()
        addStudent = false;
    }
  }
</script>

<section class="flex flex-col p-7 w-full gap-y-5">
  <div class="flex self-end justify-around items-center w-full md:w-[600px]">
    <button
      type="button"
      class="rounded-lg bg-blue-400 text-white font-bold py-3 px-5"
      on:click="{() => (addStudent = true)}">Agregar Estudiante</button
    >
    <input
      type="text"
      bind:value="{$estudianteSearch.search}"
      class="self-end rounded-lg border-[#db0081] border-dashed border-4 w-full md:w-[300px]"
      placeholder="Buscar estudiante..."
    />
  </div>
  {#if estudiantes.length && $estudianteSearch.filtered.length}
    <table class="w-full">
      <thead>
        <th class="text-left text-2xl text-[#db0081]">Cédula</th>
        <th class="text-left text-2xl text-[#db0081]">Correo</th>
        <th class="text-left text-2xl text-[#db0081]">Nombre</th>
        <th class="text-left text-2xl text-[#db0081]">Semestre</th>
        <th class="text-left text-2xl text-[#db0081]">Teléfono</th>
        <th class="text-left text-2xl text-[#db0081]">Estado</th>
      </thead>
      <tbody>
        {#each $estudianteSearch.filtered as estudiante}
          <tr>
            <td class="text-xl">{estudiante.cedula}</td>
            <td class="text-xl">{estudiante.correo}</td>
            <td class="text-xl">{estudiante.nombre}</td>
            <td class="text-xl">{estudiante.semestre}</td>
            <td class="text-xl">{estudiante.telefono}</td>
            <td class="text-xl">{estudiante.estado}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {:else}
    <h3 class="text-5xl font-extrabold text-[#db0081]">
      No hay estudiantes registrados.
    </h3>
  {/if}
</section>
<ModalLarge open="{addStudent}" headerText="Añadir estudiante" big>
  <form method="post" use:enhance={handleSubmit}>
    <label for="cedula" class="flex flex-col">
      Cédula
      <div class="flex justify-start">
        <select
          bind:value="{documento}"
          name="documento"
          id="documento"
          class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-[80px]"
        >
          <option value="V">V</option>
          <option value="E">E</option>
        </select>
        <input
          class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
          required
          type="number"
          min="0"
          minlength="5"
          name="cedula"
          id="cedula"
          bind:value="{cedulaInput}"
        />
      </div>
    </label>
    <label for="nombre" class="flex flex-col">
      Nombre
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="text"
        name="nombre"
        id="nombre"
      />
    </label>
    <label for="email" class="flex flex-col">
      Correo
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="email"
        name="email"
        id="email"
      />
    </label>
    <label for="telefono" class="flex flex-col">
        Teléfono
        <div class="flex justify-start">
          <select
            bind:value="{prefijo}"
            name=""
            id="prefijo"
            class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-[100px]"
          >
            <option value="0412">0412</option>
            <option value="0414">0414</option>
            <option value="0424">0424</option>
            <option value="0416">0416</option>
            <option value="0426">0426</option>
          </select>
          <input
            class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            required
            type="number"
            min="0"
            minlength="5"
            name="cedula"
            id="cedula"
            bind:value="{telefonoInput}"
          />
        </div>
      </label>
    <label for="semestre" class="flex flex-col">
      Semestre
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="number"
        min="1"
        max="10"
        name="semestre"
        id="semestre"
      />
    </label>
    <label for="estado" class="flex flex-col">
      Estado
      <select
        bind:value="{estado}"
        name="estado"
        id="estado"
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3"
      >
        <option value="en curso">En curso</option>
        <option value="congelado">Congelado</option>
        <option value="suspendido">Suspendido</option>
        <option value="expulsado">Expulsado</option>
      </select>
    </label>
    <div
      class="flex flex-col md:flex-row justify-center gap-4 items-center w-full p-3"
    >
      <button
        type="button"
        class="bg-blue-600 text-light-50 font-bold w-auto px-2 py-1"
        on:click="{() => {
          addStudent = false;
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
