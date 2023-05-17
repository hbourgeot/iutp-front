<script lang="ts">
  import type { PageData } from "./$types";
  import pascalConFondo from "$lib/images/pascalConFondo.png";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { json } from "@sveltejs/kit";

  export let data: PageData;
  let titles: string[] = ["Fecha", "Cédula", "Nombre", "Pago", "Monto"];

  let pdf: {
    fecha: string;
    cedula: string;
    nombre: string;
    pago: string;
    monto: string;
  }[] = data.pdfData;

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

  const day = new Date($page.url.searchParams.get("d") as unknown as string);
  day.setHours(24);

  const print = () => {
    const logs: any = browser
      ? JSON.parse(localStorage.getItem("log") as unknown as string) || []
      : [];
    logs.push(
      `${new Date().getDate()} de ${
        months[new Date().getMonth()]
      } del año ${new Date().getFullYear()} a las ${new Date().getHours()}:${new Date().getMinutes() > 9 ? new Date().getMinutes() : '0'+ new Date().getMinutes()}:${new Date().getSeconds() > 9 ? new Date().getSeconds() : '0'+ new Date().getSeconds()} >>> se ha generado un reporte `
    );
    localStorage.setItem("log", JSON.stringify(logs));
    window.print();
  };
</script>

<section id="pdf">
  <div class="absolute right-10 top-5 flex justify-between gap-3">
    <button
      type="button"
      class="bg-pink-600 px-5 py-2 text-lg text-light-200 font-extrabold save"
      on:click="{() => print()}">Imprimir reporte</button
    >
    <a
      href="/pagos"
      class="bg-sky-600 px-5 py-2 text-lg text-light-200 font-extrabold save"
      >Volver atrás</a
    >
  </div>
  <div class="w-[800px] bg-light-50">
    <header class="py-5 flex justify-start items-center px-8">
      <img src="{pascalConFondo}" alt="" class="h-[fit-content] w-1/9" />
      <section class="text-center w-7/11">
        <h2 class="text-2xl">S.C. IUTEPAS</h2>
        <p class="text-sm">
          Gaceta Oficial N° 36.104 / Decreto Presidencial de la República N°
          1608
        </p>
        <p class="text-sm">RIF: J-307676744</p>
        <p class="text-sm">
          Calle Mariño C/C Páez, Edif.: 102-02-10, Piso 1, Apt S/N
        </p>
        <p class="text-sm">Sector Barrancón, Cagua, Edo. Aragua, ZP 2122</p>
        <p class="text-sm">Telfs.: (0244) 395.93.89</p>
      </section>
      <section
        class="text-center w-[fit-content] text-sm bg-blue-400 border-1 border-blue-400 border-solid h-auto rounded-lg"
      >
        <p class="text-light-50 align-text-top text-center h-[30px]">
          Fecha del reporte
        </p>
        <div class="p-1 bg-light-50 rounded-br-lg px-3 rounded-bl-lg">
          <span>{new Date().toLocaleString()}</span>
        </div>
      </section>
    </header>
    <main class="py-5 px-10 w-full mx-auto">
      <h2 class="text-2xl font-bold text-center">
        Reporte de pagos {#if data.param == "dia"}del {`${day.getDate()}/${
            day.getMonth() + 1
          }/${day.getFullYear()}`}
        {:else if data.param == "semanal"}de los últimos siete días{:else if data.param == "mensual"}del
          último mes{/if}
      </h2>
      <table class="my-5 w-full">
        <thead>
          {#each titles as title}
            <th class="text-xl font-semibold">{title}</th>
          {/each}
        </thead>
        {#each pdf as row}
          <tr>
            <td>{row.fecha}</td>
            <td>{row.cedula}</td>
            <td>{row.nombre}</td>
            <td>{row.pago}</td>
            <td>{row.monto} Bs.</td>
          </tr>
        {/each}
      </table>
    </main>
  </div>
</section>

<style>
  :global(body) {
    overflow-y: hidden;
  }
  #pdf {
    width: 100%;
    height: calc(100vh - 100px);
    overflow-y: auto;
    overflow-x: hidden;
  }
  th {
    padding: 0 0 10px !important;
    text-align: left;
  }
  td {
    padding: 2px 0;
    text-align: 0;
  }

  @media print {
    .save {
      display: none !important;
    }

    #pdf {
      overflow-y: hidden;
      height: fit-content;
    }
  }
</style>
