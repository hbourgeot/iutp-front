<script lang="ts">
  import { createSearchStore, searchHandler } from '$lib/resources/store';
  import { onDestroy } from 'svelte';
  import type { Estudiante } from '../../../../app';
    import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
    
    export let data: PageData;

    let estudiantes: Estudiante[] = data.estudiantes;
    const carreras = ["Informática", "Tecnología de Alimentos", "Comunicación y Electrónica", "Diseño Gráfico", "Contabilidad y Costos", "Administración Bancaria y Financiera", "Administración Empresarial"]
  $: estudiantes = data.estudiantes;
    let estudiantesTerms = estudiantes.map((estudiante) => ({
    ...estudiante,
    searchTerms: `${estudiante.cedula} ${estudiante.cedula.replace(
      "V-" || "E-",
      ""
    )} ${estudiante.correo} ${estudiante.estado} ${
      estudiante.telefono} ${carreras[estudiante.carrera - 1].toLowerCase()} ${estudiante.semestre}to ${estudiante.nombre.toLowerCase()}`,
  }));

  const estudianteSearch = createSearchStore(estudiantesTerms);

  const unsubscribe = estudianteSearch.subscribe((model) =>
    searchHandler(model)
  );

  $: $estudianteSearch.search = data.query?.trim() as unknown as string;
  $: if(!$estudianteSearch.filtered.length){
    if(browser){
        window.alert("No hay estudiantes que coincidan con esos términos de búsqueda")
        goto("/estudiantes")
    }
  }

  onDestroy(() => {
    unsubscribe();
  });
</script>
<section class="flex flex-col p-7 gap-y-10 w-full overflow-y-auto">
    <div class="flex self-end justify-around items-center w-[auto]">
    <a
      href="/estudiantes"
      class="rounded-lg bg-sky-600 text-white font-bold py-3 px-5"
      on:click={() => ($estudianteSearch.search = "")}>Volver atrás</a
    >
  </div>
    <table class="!text-lg">
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
            <td><a href="/estudiantes/{estudiante.cedula}" class="text-sky-800 font-bold">{estudiante.cedula}</a></td>
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
</section>

<style lang="scss">
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
    padding: 5px 15px;
  }
</style>