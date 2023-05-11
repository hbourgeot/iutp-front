<script lang="ts">
  import { createSearchStore, searchHandler } from "$lib/resources/store";
  import { onDestroy } from "svelte";
  import type { Estudiante } from "../../../app";
  import type { SubmitFunction } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import ModalLarge from "$lib/components/ModalLarge.svelte";
  import { enhance } from "$app/forms";

  export let data: PageData;
  export let form: ActionData;

  $: if (form?.message) {
    alert(form.message);
  }

  let estado: string = "en curso";
  let documento: string = "V";
  let addStudent: boolean = false;
  let cedula: string = "";
  let cedulaInput: string = "";
  let prefijo: string = "0412";
  let telefonoInput: string = "";
  let telefono: string = "";
  $: cedula = `${documento}-${cedulaInput}`;
  $: telefono = `${prefijo}-${telefonoInput}`;
  let estudiantes: Estudiante[] = data.estudiantes;
  $: estudiantes = data.estudiantes;
  let estudiantesTerms = estudiantes.map((estudiante) => ({
    ...estudiante,
    searchTerms: `${estudiante.cedula} ${estudiante.cedula.replace(
      "V-" || "E-",
      ""
    )} ${estudiante.correo} ${estudiante.estado} ${estudiante.semestre} ${
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


  const handleSubmit: SubmitFunction = ({ data }) => {
    data.append("cedula", cedula);
    data.append("telefono", telefono);
    return async ({ update }) => {
      await update();
      addStudent = false;
      window.location.reload();
    };
  };
</script>

<section class="flex flex-col p-7 gap-y-10 w-full overflow-y-auto">
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
    <table>
      <thead>
        <th>Cédula</th>
        <th>Nombre</th>
        <th>Teléfono</th>
        <th>Semestre</th>
        <th>Estado</th>
      </thead>
      <tbody>
        {#each $estudianteSearch.filtered as estudiante}
        <tr>
          <td>{estudiante.cedula}</td>
          <td>{estudiante.nombre}</td>
          <td>{estudiante.telefono}</td>
          <td>{estudiante.semestre}</td>
          <td>{estudiante.estado}</td>
          <td></td>
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
  <form method="post" use:enhance="{handleSubmit}">
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
          type="text"
          min="0"
          on:invalid="{() => {
            let html = window.document.getElementById('cedula');
            html.setCustomValidity('Por favor ingrese solo numeros');
          }}"
          minlength="5"
          maxlength="{documento === 'V' ? 8 : 13}"
          pattern="\d+"
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
        minlength="6"
        on:invalid="{() => {
          let html = window.document.getElementById('nombre');
          html.setCustomValidity(
            'Por favor introduzca el nombre completo del estudiante'
          );
        }}"
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
          minlength="7"
          maxlength="7"
          name=""
          id="telefonoinp"
          bind:value="{telefonoInput}"
        />
      </div>
    </label>
    <div class="flex justify-start gap-x-4 w-full">
      <label for="semestre" class="flex flex-col w-1/4">
        Semestre
        <select
          name="semestre"
          id="semestre"
          value="1"
          class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-full"
        >
          <option value="1">Primero</option>
          <option value="2">Segundo</option>
          <option value="3">Tercero</option>
          <option value="4">Cuarto</option>
          <option value="5">Quinto</option>
          <option value="6">Sexto</option>
        </select>
      </label>
      <label for="estado" class="flex flex-col w-1/4">
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
    </div>
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
<style lang="scss">

  section{
    height: calc(100vh - 100px);
  }

  table{
    font-size: 25px;
    line-height: 1.5;
  }

  thead th{
    text-align: left;
  }

tbody tr:nth-child(odd) {
  background-color: lighten($color: #db0081, $amount: 50%);
}

th, td{
  padding: 10px 15px;
}
</style>