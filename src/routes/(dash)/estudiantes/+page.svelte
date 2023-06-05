<script lang="ts">
  import { createSearchStore, searchHandler } from "$lib/resources/store";
  import { onDestroy } from "svelte";
  import type { Estudiante } from "../../../app";
  import type { SubmitFunction } from "$app/forms";
  import type { ActionData, PageData } from "./$types";
  import ModalLarge from "$lib/components/ModalLarge.svelte";
  import { enhance } from "$app/forms";
  import { browser } from "$app/environment";

  export let data: PageData;
  export let form: ActionData;

  $: if (form?.message) {
    alert(form.message);
  }

  const carreras = ["Informática", "Tecnología de Alimentos", "Comunicación y Electrónica", "Diseño Gráfico", "Contabilidad y Costos", "Administración Bancaria y Financiera", "Administración Empresarial"]

  let estado: string = "nuevo ingreso";
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
    )} ${estudiante.correo} ${estudiante.estado} ${
      estudiante.telefono} ${carreras[estudiante.carrera - 1].toLowerCase()} ${estudiante.semestre}to ${estudiante.nombre.toLowerCase()}`,
  }));
  console.log(estudiantesTerms);

  const estudianteSearch = createSearchStore(estudiantesTerms);
  $: if(telefonoInput.toString().length > 7){
    console.log(telefonoInput);
    telefonoInput = telefonoInput.toString().slice(0,7)
  }

  const unsubscribe = estudianteSearch.subscribe((model) =>
    searchHandler(model)
  );

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

  let semestre = "";
  let carrera = "";
  let search = "";

  const handleSubmit: SubmitFunction = ({ data, cancel }) => {
    if (estudiantes.find((estudiante) => estudiante.cedula === cedula)) {
      alert("Ya existe un estudiante con esa cédula, introduzca otra");
      return cancel();
    }
    data.append("cedula", cedula);
    data.append("telefono", telefono);

    return async ({ update }) => {
      await update();
      addStudent = false;
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
        } >>> se ha registrado un estudiante con la cédula ${cedula}`
      );
      localStorage.setItem("log", JSON.stringify(logs));
      window.location.reload();
    };
  };

$: console.log($estudianteSearch.search, $estudianteSearch.filtered);
</script>

<section class="flex flex-col p-7 gap-y-10 w-full overflow-y-auto">
  <div class="flex self-end justify-around items-center w-[980px]">
    <button
      type="button"
      class="rounded-lg bg-blue-400 text-white font-bold py-3 px-5"
      on:click={() => (addStudent = true)}>Agregar Estudiante</button
    >
    <select name="" id="semestre" bind:value="{semestre}" on:change={() => $estudianteSearch.search = `${carrera} ${semestre}`} class="self-end rounded-lg border-[#db0081] border-dashed border-4 p-2 w-[190px]">
      <option value="disabled" disabled>Filtrar por semestre</option>
      <option value="">Todos los semestres</option>
      <option value="1to">1ro</option>
      <option value="2to">2do</option>
      <option value="3to">3ro</option>
      <option value="4to">4to</option>
      <option value="5to">5to</option>
      <option value="6to">6to</option>
    </select>
    <select name="" id="carrera" bind:value="{carrera}" on:change={() => $estudianteSearch.search = `${carrera} ${semestre}`} class="self-end rounded-lg border-[#db0081] border-dashed border-4 p-2 w-[300px]">
      <option value="disabled" disabled>Filtrar por carrera</option>
      <option value="">Todas las carreras</option>
      {#each carreras as carrera}
        <option value={carrera.toLowerCase()}>{carrera}</option>
      {/each}
    </select>
    <input
      type="text"
      bind:value={search} on:change="{() => $estudianteSearch.search = search}"
      class="self-end rounded-lg border-[#db0081] border-dashed border-4 p-2 w-[280px]"
      placeholder="Buscar estudiante..."
    />
  </div>
  {#if estudiantes.length && $estudianteSearch.filtered.length}
    <table>
      <thead>
        <th>Cédula de Identidad</th>
        <th>Nombres y Apellidos</th>
        <th>Teléfono</th>
        <th>Semestre</th>
        <th>Estado</th>
        <th>Carrera</th>
      </thead>
      <tbody>
        {#each $estudianteSearch.filtered as estudiante}
          <tr>
            <td>{estudiante.cedula}</td>
            <td style="text-transform: capitalize;">{estudiante.nombre}</td>
            <td>{estudiante.telefono}</td>
            <td>{estudiante.semestre}</td>
            <td style="text-transform: capitalize;">{estudiante.estado}</td>
            <td style="text-transform: capitalize;">{carreras[estudiante.carrera - 1]}</td>
            <td />
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
<ModalLarge open={addStudent} headerText="Añadir estudiante" big>
  <form method="post" use:enhance={handleSubmit}>
    <label for="cedula" class="flex flex-col">
      Cédula de Identidad
      <div class="flex justify-start">
        <select
          bind:value={documento}
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
          on:invalid={() => {
            let html = window.document.getElementById("cedula");
            html.setCustomValidity("Por favor ingrese solo numeros");
          }}
          minlength="5"
          maxlength={documento === "V" ? 8 : 13}
          pattern="\d+"
          name="cedula"
          id="cedula"
          bind:value={cedulaInput}
        />
      </div>
    </label>
    <label for="nombre" class="flex flex-col">
      Nombres y Apellidos
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="text"
        name="nombre"
        minlength="6"
        on:invalid={() => {
          let html = window.document.getElementById("nombre");
          html.setCustomValidity(
            "Por favor introduzca el nombre completo del estudiante"
          );
        }}
        id="nombre"
      />
    </label>
    <label for="email" class="flex flex-col">
      Correo Electrónico
      <input
        class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        required
        type="email"
        name="email"
        id="email"
      />
    </label>
    <label for="telefono" class="flex flex-col">
      Teléfono del Estudiante
      <div class="flex justify-start">
        <select
          bind:value={prefijo}
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
          bind:value={telefonoInput}
        />
      </div>
    </label>
    <div class="flex justify-start gap-x-4 w-full">
      <label for="semestre" class="flex flex-col w-1/6">
        Semestre
        <select
          name="semestre"
          id="semestre"
          value="1"
          class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-full"
        >
          <option value="1">1ero</option>
          <option value="2">2do</option>
          <option value="3">3ro</option>
          <option value="4">4to</option>
          <option value="5">5to</option>
          <option value="6">6to</option>
        </select>
      </label>
      <label for="carrera" class="flex flex-col w-3/6">
        Carrera Del Estudiante
        <select
          value="1"
          name="carrera"
          id="carrera"
          class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3"
        >
          <option value="1">Informatica</option>
          <option value="2">Tecnología de Alimentos</option>
          <option value="3">Comunicación y Electrónica</option>
          <option value="4">Diseño Gráfico</option>
          <option value="5">Contabilidad y Costos</option>
          <option value="6">Administración Bancaria y Financiera</option>
          <option value="7">Administración de Empresas</option>
        </select>
      </label>
      <label for="estado" class="flex flex-col w-2/6">
        Estado Del Estudiante
        <select
          bind:value={estado}
          name="estado"
          id="estado"
          class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3 px-5 py-3"
        >
          <option value="nuevo ingreso">Nuevo ingreso</option>
          <option value="regular">Regular</option>
          <option value="repitiente">Repitiente</option>
          <option value="abandona">Abandonó</option>
        </select>
      </label>
    </div>
    <div
      class="flex flex-col md:flex-row justify-center gap-4 items-center w-full p-3"
    >
      <button
        type="button"
        class="bg-blue-600 text-light-50 font-bold w-auto px-2 py-1"
        on:click={() => {
          addStudent = false;
        }}>Cancelar</button
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
  section {
    height: calc(100vh - 100px);
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
    padding: 10px 15px;
  }
</style>
