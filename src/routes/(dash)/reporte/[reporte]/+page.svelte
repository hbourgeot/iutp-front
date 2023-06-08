<script lang="ts">
  import type { PageData } from "./$types";
  import pascalConFondo from "$lib/images/pascalConFondo.png";
  import { page } from "$app/stores";
  import { browser } from "$app/environment";
  import { moneyBsConverter, moneyUsdConverter } from "$lib/resources/moneyConverter";
  import { goto } from "$app/navigation";
  
  export let data: PageData;

  const totales = data.param;

  let titles: string[] = ["Fecha", "Cédula", "Nombre", "Pago", "Monto", "Método"];
  let pdf = data.pdfData;
  let total: number = 0;
  let transferencias: number = 0;
  let bolivares: number = 0;
  let dolares: number = 0;
  if (browser) {
    if (!pdf.length) {
      goto("/pagos");
      window.alert("No hay pagos que cumplan con la condición de búsqueda.");
    } else{
      total = pdf.map((df) => df.montoNum).reduce((a, b) => a + b);
      if(totales === "monto"){
        transferencias = pdf.map(pd => pd.metodo === "transferencia" ? pd.montoNum : 0).reduce((a, b) => a + b)
        bolivares = pdf.map(pd => pd.metodo === "bolivares" ? pd.montoNum : 0).reduce((a, b) => a + b)
        dolares = pdf.map(pd => pd.metodo === "dolares" ? pd.montoNum : 0).reduce((a, b) => a + b)
      }
    }
  }

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
      } del año ${new Date().getFullYear()} a las ${new Date().getHours()}:${
        new Date().getMinutes() > 9
          ? new Date().getMinutes()
          : "0" + new Date().getMinutes()
      }:${
        new Date().getSeconds() > 9
          ? new Date().getSeconds()
          : "0" + new Date().getSeconds()
      } >>> se ha generado un reporte `
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
  <div class="w-[800px] !bg-[#EEEEEEEE]">
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
        <div class="p-1 !bg-[#EEEEEEEE] rounded-br-lg px-3 rounded-bl-lg">
          <span>{new Date().toLocaleString()}</span>
        </div>
      </section>
    </header>
    <main class="py-5 px-10 w-full mx-auto">
      {#if totales === "monto"}
      <h2 class="text-2xl font-bold">Total de pagos: </h2>
      <p class="flex justify-between my-3 text-lg w-11/12 font-semibold capitalize"
        >transferencias: <span class="text-pink-600 font-bold text-2xl">{moneyBsConverter(transferencias)}</span>  </p
      >
      <p class="flex justify-between my-3 text-lg w-11/12 font-semibold capitalize"
        >pagos con bolivares en efectivo: <span class="text-pink-600 font-bold text-2xl">{moneyBsConverter(bolivares)}</span> </p
      >
      <p class="flex justify-between my-3 text-lg w-11/12 font-semibold capitalize"
        >pagos con dólares en efectivo (a tasa de BCV: {moneyBsConverter(+data.bcv)}): <span class="text-pink-600 font-bold text-2xl">{moneyBsConverter(dolares)}</span> </p
      >
      <hr class="border-sky-700 w-20/21 my-2" />
      <p class="flex justify-between my-3 text-4xl w-11/12 font-bold capitalize"
        >Total: <span class="text-pink-600">{moneyBsConverter(transferencias + bolivares + dolares)}</span> </p
      >
      {:else}
      <h2 class="text-2xl font-bold">
        Reporte de pagos {#if data.filtro == "bolivares"}hechos con bolívares en efectivo{:else if data.filtro == "dolares"}hechos con dólares en efectivo{:else if data.filtro == "transferencia"}por transferencia{/if} {#if data.param == "dia"}del {`${day.getDate()}/${
            day.getMonth() + 1
          }/${day.getFullYear()}`}
        {:else if data.param == "semanal"}de los últimos siete días{:else if data.param == "mensual"}de {months[new Date().getMonth()]}{/if}
      </h2>
      <table class="my-5 w-23/24">
        <thead>
          {#each titles as title}
            <th class="text-xl font-semibold">{title}</th>
          {/each}
        </thead>
        {#each pdf as row}
          <tr>
            <td>{row.fecha}</td>
            <td>{row.cedula}</td>
            <td class="capitalize">{row.nombre}</td>
            <td class="capitalize">{row.pago}</td>
            <td>{row.monto}</td>
            <td class="capitalize">{row.metodo}</td>
          </tr>
        {/each}
      </table>
      {#if data.filtro !== "nada"}
      <span class="text-xl font-semibold"
        >Monto total: {#if data.filtro != "dolares"} {moneyBsConverter(total)} {:else}{moneyUsdConverter(total)}{/if} </span
      >
      {/if}
      {/if}
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
