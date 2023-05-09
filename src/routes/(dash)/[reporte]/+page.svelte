<script lang="ts">
  import type { PageData } from "./$types";
  import pascalConFondo from "$lib/images/pascalConFondo.png"
  import { page } from "$app/stores";

  export let data: PageData;
  export let titles: string[] = ["Cédula", "Nombre", "Pago", "Monto"];

  let pdf: {
    cedula: string;
    nombre: string;
    pago: string;
    monto: string;
  }[] = data.pdfData;
</script>

<button type="button" class="bg-pink-600 px-5 py-2 text-lg absolute top-5 right-5 text-light-200 font-extrabold save" on:click="{() => window.print()}">Imprimir reporte</button>
<section id="thepdf" class="w-[800px] bg-light-50">
  <header class="py-5 flex justify-center gap-x-3 items-center">
    <img src="{pascalConFondo}" alt="" class="h-[fit-content] w-1/7" />
    <section class="text-center w-4/7">
      <h2 class="text-2xl">S.C. IUTEPAS</h2>
      <p class="text-sm">
        Gaceta Oficial N° 36.104 / Decreto Presidencial de la República N° 1608
      </p>
      <p class="text-sm">RIF: J-307676744</p>
      <p class="text-sm">
        Calle Mariño C/C Páez, Edif.: 102-02-10, Piso 1, Apt S/N
      </p>
      <p class="text-sm">Sector Barrancón, Cagua, Edo. Aragua, ZP 2122</p>
      <p class="text-sm">Telfs.: (0244) 395.93.89</p>
    </section>
    <section
      class="text-center w-1/4 bg-blue-400 border-1 border-blue-400 border-solid h-auto rounded-lg"
    >
      <p class="text-light-50 text-sm text-center h-[30px]">
        Fecha del reporte
      </p>
      <div class="px-3 py-3 bg-light-50 rounded-br-lg rounded-bl-lg">
        <span>{new Date().toLocaleString()}</span>
      </div>
    </section>
  </header>
  <main class="py-5 px-10 w-full mx-auto">
    <h2 class="text-2xl font-bold text-center">Reporte de pagos {#if data.param == "dia"}del día{:else if data.param == "semanal"}de los últimos siete días{:else if data.param == "mensual"}del último mes{/if}</h2>
    <table class="my-5 w-full">
      <thead>
        {#each titles as title}
          <th class="text-xl font-semibold">{title}</th>
        {/each}
      </thead>
      {#each pdf as row}
        <tr>
          <td>{row.cedula}</td>
          <td>{row.nombre}</td>
          <td>{row.pago}</td>
          <td>{row.monto} Bs.</td>
        </tr>
      {/each}
    </table>
  </main>
</section>

<style>
  th {
    padding: 0 0 10px !important;
    text-align: left;
  }
  td {
    padding: 2px 0;
    text-align: 0;
  }

  @media print{
    .save{
      display: none !important;
    }
  }
</style>
