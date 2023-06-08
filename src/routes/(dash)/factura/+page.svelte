<script lang="ts">
  import { page } from "$app/stores";
  import type { PageData } from "./$types";
  export let data: PageData;
  let bcv = parseFloat(data.bcv);
  import pascalConFondo from "$lib/images/pascalConFondo.png";
  import {
    moneyBsConverter,
    moneyUsdConverter,
  } from "$lib/resources/moneyConverter";
  let descripciones: string[] = $page.url.searchParams.getAll("d");
  let metodos: string[] = $page.url.searchParams.getAll("m");
  $: console.log(conceptos);
  let montos: number[] = $page.url.searchParams
    .getAll("t")
    .map((monto) => parseFloat(monto));
  let conceptos: { descripcion: string; monto: number; metodo: string }[] = [];

  for (let i = 0; i < descripciones.length; i++) {
    conceptos.push({
      descripcion: descripciones[i],
      monto: montos[i],
      metodo: metodos[i],
    });
  }
</script>

<div class="overflow">
  {#each conceptos as concepto}
    <section class="w-[750px] m-5 flex flex-col">
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
      <header class="py-5 flex justify-start items-center px-8">
        <img src="{pascalConFondo}" alt="" class="h-[fit-content] w-1/9" />
        <section class="text-center w-7/11">
          <h2 class="text-2xl font-medium">S.C. IUTEPAS</h2>
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
          class="text-center w-[fit-content] text-sm bg-blue-400 border-1 border-blue-400 border-solid rounded-lg"
        >
          <p class="text-light-50 align-text-top text-center h-[30px]">
            Fecha de Emisión
          </p>
          <div class="p-1 !bg-[#EEEEEEEE] rounded-br-lg px-3 rounded-bl-lg">
            <span>{new Date().toLocaleString()}</span>
          </div>
        </section>
      </header>
      <article class="pl-12 w-full h-full justify-between flex flex-col mt-5">
        <div class="flex flex-col w-full">
          <h2 class="self-start text-xl capitalize">
            <span class="font-bold">Razón Social:</span>
            {$page.url.searchParams.get("e")}
          </h2>
          <h2 class="self-start text-xl">
            <span class="font-bold">C.I. o RIF:</span>
            {$page.url.searchParams.get("ci")}
          </h2>
          <div
            class="w-11/12 flex justify-between font-bold border-t border-b mt-10 border-dark-200"
          >
            <span class="text-xl">DESCRIPCIÓN</span><span class="text-xl"
              >TOTAL</span
            >
          </div>
          <div class="w-11/12 flex justify-between font-bold">
            <span class="text-xl capitalize">{concepto.descripcion}</span><span
              class="text-xl">{moneyBsConverter(+concepto.monto)}</span
            >
          </div>
        </div>

        <div
          class="w-11/12 flex justify-self-end justify-between items-center font-bold border-t mt-50 border-dark-200"
        >
          <div class="block">
            <p class="text-xl">
              Pagada: {#if concepto.metodo === "transferencia"}T:{+concepto.monto.toFixed(
                  2
                )} Bs{:else if concepto.metodo === "bolivares"}EB:
                {+concepto.monto.toFixed(2)} Bs{:else if concepto.metodo === "dolares"}ED:{moneyUsdConverter(
                  +concepto.monto / bcv
                )}{/if}
            </p>
            <p class="text-xl">$ = Bs. {bcv.toFixed(4)}</p>
          </div>
          <div>
            <p class="text-right text-xl">
              Subtotal: {moneyBsConverter(+concepto.monto)}
            </p>
            <p class="text-right text-xl">IVA 0%: {moneyBsConverter(0)}</p>
            <p class="text-right text-xl">
              Total: {moneyBsConverter(+concepto.monto)}
            </p>
          </div>
        </div>
      </article>
    </section>
  {/each}
</div>

<style>
  @media print {
    .save {
      display: none !important;
    }
    div.overflow {
      height: fit-content !important;
      overflow: hidden;
    }
  }
  div.overflow {
    height: calc(100vh - 80px);
    overflow: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 340px;
  }
</style>
