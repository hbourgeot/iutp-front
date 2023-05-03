<script lang="ts">
  import pascalConFondo from "$lib/images/pascalConFondo.png";
  export let titles: string[] = ["Cédula", "Nombre", "Pago", "Monto"];
  export let data: {
    cedula: string;
    nombre: string;
    pago: string;
    monto: number;
  }[] = [{ cedula: "", nombre: "", pago: "", monto: 0 }];

</script>

<section id="thepdf" class="w-[800px] absolute top-0 -z-10 bg-light-50">
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
      <p class="text-light-50 text-sm text-center h-[30px]">Fecha del reporte</p>
      <div class="px-3 py-3 bg-light-50 rounded-br-lg rounded-bl-lg">
        <span>{new Date().toLocaleString()}</span>
      </div>
    </section>
  </header>
  <main class="py-5 px-30 w-full mx-auto">
    <h2 class="text-2xl font-bold text-center">Reporte de pagos</h2>
    <table class="my-5 w-full">
      <thead>
        {#each titles as title}
          <th class="text-xl font-semibold">{title}</th>
        {/each}
      </thead>
      {#each data as row}
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
  th{
    padding: 0 0 10px !important;
    text-align: left;
  }
  td{
    padding: 2px 0;
    text-align: 0;
  }
</style>