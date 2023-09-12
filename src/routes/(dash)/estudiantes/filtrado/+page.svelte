<script lang="ts">
  import { createSearchStore, searchHandler } from '$lib/resources/store';
  import { onDestroy } from 'svelte';
  import type { Estudiante } from '../../../../app';
    import type { PageData } from './$types';
  import { goto } from '$app/navigation';
  import { browser } from '$app/environment';
  import { triggerToast } from '$lib/utils/toast';
    
    export let data: PageData;

    let estudiantes: Estudiante[] = data.estudiantes;
    const carreras = data.carreras
  $: estudiantes = data.estudiantes;
    let estudiantesTerms = estudiantes.map((estudiante) => ({
    ...estudiante,
    carrera: carreras.find((carrera: any) => carrera.id == estudiante.carrera)?.nombre,
    searchTerms: `${estudiante.cedula} ${estudiante.cedula.replace(
      "V-" || "E-",
      ""
    )} ${estudiante.correo} ${estudiante.estado} ${
      estudiante.telefono
    } ${carreras.find((carrera: any) => carrera.id == estudiante.carrera)?.nombre.toLowerCase()} ${
      estudiante.semestre
    }to ${estudiante.nombre.toLowerCase()}`,
  }));

  const estudianteSearch = createSearchStore(estudiantesTerms);

  const unsubscribe = estudianteSearch.subscribe((model) =>
    searchHandler(model)
  );

  $: $estudianteSearch.search = data.query?.trim() as unknown as string;
  $: if(!$estudianteSearch.filtered.length){
    if(browser){
        triggerToast("No hay estudiantes que coincidan con esos términos de búsqueda", 3000)
        goto("/estudiantes")
    }
  }

  onDestroy(() => {
    unsubscribe();
  });
</script>
<svelte:head>
  <title>Filtrado de estudiantes - Administración IUTEPAS</title>
</svelte:head>
<section class="flex flex-col p-7 gap-y-10 w-full overflow-y-auto">
  <h1 class="text-4xl text-center">Lista de estudiantes</h1>
    <table class="!text-lg table">
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
            <td class="!text-lg"><a href="/estudiantes/{estudiante.cedula}" class="text-sky-800 font-bold">{estudiante.cedula}</a></td>
            <td class="!text-lg" style="text-transform: capitalize;">{estudiante.nombre}</td>
            <td class="!text-lg">{estudiante.telefono}</td>
            <td class="!text-lg">{estudiante.semestre}</td>
            <td class="!text-lg" style="text-transform: capitalize;">{estudiante.estado}</td>
            <td class="!text-lg" style="text-transform: capitalize;">{estudiante.carrera}</td>
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


  th,
  td {
    padding: 5px 15px;
  }
</style>