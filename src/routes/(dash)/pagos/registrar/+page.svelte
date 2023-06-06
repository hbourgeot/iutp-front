<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance, type SubmitFunction } from "$app/forms";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";
  import { moneyUsdConverter } from "$lib/resources/moneyConverter";

  export let data: PageData;
  export let form: FormData;

  $: if(form?.message){
    if(browser){
      window.alert(form?.message);
    }
  }

  let disableCedula =
    $page.url.searchParams.get("regPago") != null ? true : false;

  let cuota1Checked: boolean = false;
  let cuota2Checked: boolean = false;
  let cuota3Checked: boolean = false;
  let cuota4Checked: boolean = false;
  let cuota5Checked: boolean = false;
  let inscripcionChecked: boolean = false;

  let date: Date = new Date();
  const today: string = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
  let preInscripcion: string = today;
  let inscripcion: string = "";
  let cuota1: string = "";
  let cuota2: string = "";
  let cuota3: string = "";
  let cuota4: string = "";
  let cuota5: string = "";
  let montoPreInscripcion: string = "";
  let montoInscripcion: string = "";
  let montoCuota1: string = "";
  let montoCuota2: string = "";
  let montoCuota3: string = "";
  let montoCuota4: string = "";
  let montoCuota5: string = "";
  let metodoPreInscripcion: string = "dolares";
  let metodoInscripcion: string = "dolares";
  let metodoCuota1: string = "dolares";
  let metodoCuota2: string = "dolares";
  let metodoCuota3: string = "dolares";
  let metodoCuota4: string = "dolares";
  let metodoCuota5: string = "dolares";
  let montoDolaresPreInscripcion: number = 0;
  let montoDolaresInscripcion: number = 0;
  let montoDolaresCuota1: number = 0;
  let montoDolaresCuota2: number = 0;
  let montoDolaresCuota3: number = 0;
  let montoDolaresCuota4: number = 0;
  let montoDolaresCuota5: number = 0;
  let billetesPreInscripcion: { codigo: string; cantidad: number }[] = [];
  let billetesInscripcion: { codigo: string; cantidad: number }[] = [];
  let billetesCuota1: { codigo: string; cantidad: number }[] = [];
  let billetesCuota2: { codigo: string; cantidad: number }[] = [];
  let billetesCuota3: { codigo: string; cantidad: number }[] = [];
  let billetesCuota4: { codigo: string; cantidad: number }[] = [];
  let billetesCuota5: { codigo: string; cantidad: number }[] = [];
  let estudiantes: { cedula: string; nombre: string }[] = data.estudiantes;
  let cedula: string = "";
  let tasa: number = data.tasa;

  if (browser) {
    if (!estudiantes.length) {
      goto("/pagos", { invalidateAll: true });
      window.alert("No existen estudiantes que no tengan pagos registrados.");
    } else {
      cedula = estudiantes[0].cedula;
    }
  }

  $: if (inscripcionChecked) inscripcion = today;
  $: if (cuota1Checked) cuota1 = today;
  $: if (cuota2Checked) cuota2 = today;
  $: if (cuota3Checked) cuota3 = today;
  $: if (cuota4Checked) cuota4 = today;
  $: if (cuota5Checked) cuota5 = today;

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

  const handleSubmit: SubmitFunction = ({ data, cancel }) => {
    const date = new Date();
    let preInscripcionDate: Date = new Date(preInscripcion);
    if (
      preInscripcionDate.getMonth() === date.getMonth() &&
      preInscripcionDate.getDate() > date.getDate()
    ) {
      alert("Por favor, ingrese una fecha valida.");
      return cancel();
    }

    if (metodoPreInscripcion === "dolares") {
      for (const billete of billetesPreInscripcion) {
        data.append("billetesPreInscripcion", JSON.stringify(billete));
      }
    }

    if (metodoInscripcion === "dolares") {
      for (const billete of billetesInscripcion) {
        data.append("billetesInscripcion", JSON.stringify(billete));
      }
    }

    if (metodoCuota1 === "dolares") {
      for (const billete of billetesCuota1) {
        data.append("billetesCuota1", JSON.stringify(billete));
      }
    }

    if (metodoCuota2 === "dolares") {
      for (const billete of billetesCuota2) {
        data.append("billetesCuota2", JSON.stringify(billete));
      }
    }

    if (metodoCuota3 === "dolares") {
      for (const billete of billetesCuota3) {
        data.append("billetesCuota3", JSON.stringify(billete));
      }
    }

    if (metodoCuota4 === "dolares") {
      for (const billete of billetesCuota4) {
        data.append("billetesCuota4", JSON.stringify(billete));
      }
    }

    if (metodoCuota5 === "dolares") {
      for (const billete of billetesCuota5) {
        data.append("billetesCuota5", JSON.stringify(billete));
      }
    }

    return async ({ update }) => {
      await update();
      let estudiante = estudiantes.find(
        (estudiante) => estudiante.cedula === cedula
      );
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
        } >>> se ha registrado un pago correspondiente al estudiante con la cédula ${cedula}`
      );
      localStorage.setItem("log", JSON.stringify(logs));
      let prei = `d=pre-inscripcion&t=${
        metodoPreInscripcion == "dolares"
          ? parseFloat(montoPreInscripcion) * tasa
          : parseFloat(montoPreInscripcion)
      }&m=${metodoPreInscripcion}&`;
      let insc = inscripcionChecked
        ? `d=inscripcion&t=${
            metodoInscripcion == "dolares"
              ? parseFloat(montoInscripcion) * tasa
              : parseFloat(montoInscripcion)
          }&m=${metodoInscripcion}&`
        : "";
      let cuo1 = cuota1Checked
        ? `d=cuota+1&t=${
            metodoCuota1 == "dolares"
              ? parseFloat(montoCuota1) * tasa
              : parseFloat(montoCuota1)
          }&m=${metodoCuota1}&`
        : "";
      let cuo2 = cuota2Checked
        ? `d=cuota+2&t=${
            metodoCuota2 == "dolares"
              ? parseFloat(montoCuota2) * tasa
              : parseFloat(montoCuota2)
          }&m=${metodoCuota2}&`
        : "";
      let cuo3 = cuota3Checked
        ? `d=cuota+1&t=${
            metodoCuota1 == "dolares"
              ? parseFloat(montoCuota3) * tasa
              : parseFloat(montoCuota3)
          }&m=${metodoCuota3}&`
        : "";
      let cuo4 = cuota4Checked
        ? `d=cuota+1&t=${
            metodoCuota1 == "dolares"
              ? parseFloat(montoCuota4) * tasa
              : parseFloat(montoCuota4)
          }&m=${metodoCuota4}&`
        : "";
      let cuo5 = cuota5Checked
        ? `d=cuota+1&t=${
            metodoCuota1 == "dolares"
              ? parseFloat(montoCuota5) * tasa
              : parseFloat(montoCuota5)
          }&m=${metodoCuota5}&`
        : "";
      goto(
        `/factura?e=${estudiante?.nombre}&ci=${estudiante?.cedula}&${prei}${insc}${cuo1}${cuo2}${cuo3}${cuo4}${cuo5}`
      );
    };
  };
</script>

<main class="w-full">
  <form
    method="post"
    use:enhance="{handleSubmit}"
    class=" pt-4 flex font-bold flex-col w-full items-center overflow-y-auto"
  >
    <label for="cedula" class="flex flex-col w-1/4">
      Estudiante
      <div class="flex justify-start">
        <select
          disabled="{disableCedula}"
          bind:value="{cedula}"
          name="cedula"
          id="cedula"
          class="bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 mb-3 px-5 py-3 w-full"
        >
          {#if estudiantes.length > 0}
            {#each estudiantes as estudiante}
              <option value="{estudiante.cedula}"
                >{estudiante.cedula.replace("V-" || "E-", "")} - {estudiante.nombre}</option
              >
            {/each}
          {:else}
            <option value="" disabled
              >Registre un estudiante para registrar un pago</option
            >
          {/if}
        </select>
      </div>
    </label>
    <label for="pre_inscripcion" class="flex flex-col">
      Preinscripción
      <div class="flex flex-row-reverse w-full items-end gap-5">
        <input
          class="border-0 w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-pink-600 py-[9.7px] mt-1 mb-3"
          required
          type="date"
          max="{today}"
          name="pre_inscripcion"
          id="pre_inscripcion"
          on:invalid="{() => {
            let html = window.document.getElementById('pre_inscripcion');
            html.setCustomValidity(
              'El valor debe ser igual a la fecha actual o anterior'
            );
          }}"
          bind:value="{preInscripcion}"
        />
        <section
          class="bg-transparent w-1/3 flex items-center h-[fit-content] py-[2.2px] bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 mb-3"
        >
          <span class="text-xl px-3"
            >{#if metodoPreInscripcion === "dolares"}${:else}Bs.{/if}</span
          >
          <input
            type="number"
            step="0.01"
            name="monto_pre_inscripcion"
            required
            min="0"
            placeholder="Ingrese monto"
            bind:value="{montoPreInscripcion}"
            class="bg-transparent border-0 outline-0 focus:border-0 w-[135px] placeholder-light-50/50 border-l-1 rounded-r-lg border-l-light-50 text-light-50 font-semibold"
          />
        </section>
        <section
          class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
        >
          <select
            name="metodo_pre_inscripcion"
            id="prefijo"
            bind:value="{metodoPreInscripcion}"
            class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
          >
            <option value="disabled" disabled>Método de pago</option>
            <option value="transferencia">Transferencia</option>
            <option value="bolivares">Efectivo en Bolívares</option>
            <option value="dolares">Efectivo en Dólares</option>
          </select>
        </section>
      </div>
      {#if metodoPreInscripcion == "dolares" && montoPreInscripcion !== ""}
        <div class="flex w-full my-5 justify-center items-end gap-5">
          <select
            id="prefijo"
            bind:value="{montoDolaresPreInscripcion}"
            class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-[200px]"
          >
            <option value="{0}" disabled class="text-light-50/50"
              >Monto de billete</option
            >
            <option value="{1}">{moneyUsdConverter(1)}</option>
            <option value="{2}">{moneyUsdConverter(2)}</option>
            <option value="{5}">{moneyUsdConverter(5)}</option>
            <option value="{10}">{moneyUsdConverter(10)}</option>
            <option value="{20}">{moneyUsdConverter(20)}</option>
            <option value="{50}">{moneyUsdConverter(50)}</option>
            <option value="{100}">{moneyUsdConverter(100)}</option>
          </select>
          <button
            type="button"
            on:click="{() =>
              (billetesPreInscripcion = [
                ...billetesPreInscripcion,
                { codigo: '', cantidad: montoDolaresPreInscripcion },
              ])}"
            class="bg-rose-600 text-light-50 font-bold w-[140px] h-10 rounded-lg text-center px-2 py-1"
            >Agregar billete</button
          >
        </div>
      {/if}
      {#each billetesPreInscripcion as billete}
        <div
          class="flex flex-row-reverse w-full justify-center items-end gap-5"
        >
          <input
            type="text"
            class="border-0 w-[200px] w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-light-50/50 py-[9.7px] mt-1 mb-3"
            placeholder="Código de billete"
            bind:value="{billete.codigo}"
          />
          <p
            class="w-1/4 text-pink-600 font-semibold rounded-lg py-[9.7px] mt-1 mb-3"
          >
            Monto: {moneyUsdConverter(billete.cantidad)}
          </p>
        </div>
      {/each}
    </label>
    <label for="inscripcion-check" class="block my-3">
      <input
        type="checkbox"
        id="inscripcion-check"
        checked="{inscripcionChecked}"
        on:change="{() => (inscripcionChecked = !inscripcionChecked)}"
      />
      Inscripción
    </label>
    {#if inscripcionChecked}
      <label for="inscripcion" class="flex flex-col">
        <div class="flex flex-row-reverse w-full items-end gap-5">
          <input
            class="border-0 w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-pink-600 py-[9.7px] mt-1 mb-3"
            required
            type="date"
            min="{preInscripcion}"
            max="{today}"
            on:invalid="{() => {
              let html = window.document.getElementById('inscripcion');
              html.setCustomValidity(
                'El valor debe ser igual a la fecha actual o posterior a la preinscripcion'
              );
            }}"
            name="inscripcion"
            id="inscripcion"
            bind:value="{inscripcion}"
          />
          <section
            class="bg-transparent w-1/3 flex items-center h-[fit-content] py-[2.2px] bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 mb-3"
          >
            <span class="text-xl px-3"
              >{#if metodoInscripcion === "dolares"}${:else}Bs.{/if}</span
            >
            <input
              type="number"
              step="0.01"
              name="monto_inscripcion"
              required
              min="0"
              placeholder="Ingrese monto"
              bind:value="{montoInscripcion}"
              class="bg-transparent border-0 outline-0 focus:border-0 w-[135px] placeholder-light-50/50 border-l-1 rounded-r-lg border-l-light-50 text-light-50 font-semibold"
            />
          </section>
          <section
            class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
          >
            <select
              name="metodo_inscripcion"
              id="prefijo"
              bind:value="{metodoInscripcion}"
              class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
            >
              <option value="disabled" disabled>Método de pago</option>
              <option value="transferencia">Transferencia</option>
              <option value="bolivares">Efectivo en Bolívares</option>
              <option value="dolares">Efectivo en Dólares</option>
            </select>
          </section>
        </div>
        {#if metodoInscripcion == "dolares" && montoInscripcion != ""}
          <div class="flex w-full my-5 justify-center items-end gap-5">
            <select
              id="prefijo"
              bind:value="{montoDolaresInscripcion}"
              class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-[200px]"
            >
              <option value="{0}" disabled class="text-light-50/50"
                >Monto de billete</option
              >
              <option value="{1}">{moneyUsdConverter(1)}</option>
              <option value="{2}">{moneyUsdConverter(2)}</option>
              <option value="{5}">{moneyUsdConverter(5)}</option>
              <option value="{10}">{moneyUsdConverter(10)}</option>
              <option value="{20}">{moneyUsdConverter(20)}</option>
              <option value="{50}">{moneyUsdConverter(50)}</option>
              <option value="{100}">{moneyUsdConverter(100)}</option>
            </select>
            <button
              type="button"
              on:click="{() =>
                (billetesInscripcion = [
                  ...billetesInscripcion,
                  { codigo: '', cantidad: montoDolaresInscripcion },
                ])}"
              class="bg-rose-600 text-light-50 font-bold w-[140px] h-10 rounded-lg text-center px-2 py-1"
              >Agregar billete</button
            >
          </div>
          {#each billetesInscripcion as billete}
            <div
              class="flex flex-row-reverse w-full justify-center items-end gap-5"
            >
              <input
                type="text"
                class="border-0 w-[200px] w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-light-50/50 py-[9.7px] mt-1 mb-3"
                placeholder="Código de billete"
                bind:value="{billete.codigo}"
              />
              <p
                class="w-1/4 text-pink-600 font-semibold rounded-lg py-[9.7px] mt-1 mb-3"
              >
                Monto: {moneyUsdConverter(billete.cantidad)}
              </p>
            </div>
          {/each}
        {/if}
      </label>
    {/if}
    {#if inscripcionChecked}
      <label for="cuota1-check" class="block my-3">
        <input
          type="checkbox"
          name=""
          id="cuota1-check"
          checked="{cuota1Checked}"
          on:change="{() => (cuota1Checked = !cuota1Checked)}"
        />
        Cuota 1
      </label>
      {#if cuota1Checked}
        <label for="cuota1" class="flex flex-col">
          <div class="flex flex-row-reverse w-full items-end gap-5">
            <input
              class="border-0 w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-pink-600 py-[9.7px] mt-1 mb-3"
              required
              type="date"
              on:invalid="{() => {
                let html = window.document.getElementById('cuota1');
                html.setCustomValidity(
                  'El valor debe ser igual a la fecha actual o posterior a la fecha de la inscripcion'
                );
              }}"
              min="{inscripcion}"
              max="{today}"
              name="cuota1"
              id="cuota1"
              bind:value="{cuota1}"
            />
            <section
              class="bg-transparent w-1/3 flex items-center h-[fit-content] py-[2.2px] bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3"
                >{#if metodoCuota1 === "dolares"}${:else}Bs.{/if}</span
              >
              <input
                type="number"
                step="0.01"
                name="monto_cuota1"
                required
                min="0"
                placeholder="Ingrese monto"
                bind:value="{montoCuota1}"
                class="bg-transparent border-0 outline-0 focus:border-0 w-[135px] placeholder-light-50/50 border-l-1 rounded-r-lg border-l-light-50 text-light-50 font-semibold"
              />
            </section>
            <section
              class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <select
                name="metodo_cuota1"
                id="prefijo"
                bind:value="{metodoCuota1}"
                class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
              >
                <option value="disabled" disabled>Método de pago</option>
                <option value="transferencia">Transferencia</option>
                <option value="bolivares">Efectivo en Bolívares</option>
                <option value="dolares">Efectivo en Dólares</option>
              </select>
            </section>
          </div>
          {#if metodoCuota1 == "dolares" && montoCuota1 != ""}
            <div class="flex w-full my-5 justify-center items-end gap-5">
              <select
                id="prefijo"
                bind:value="{montoDolaresCuota1}"
                class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-[200px]"
              >
                <option value="{0}" disabled class="text-light-50/50"
                  >Monto de billete</option
                >
                <option value="{1}">{moneyUsdConverter(1)}</option>
                <option value="{2}">{moneyUsdConverter(2)}</option>
                <option value="{5}">{moneyUsdConverter(5)}</option>
                <option value="{10}">{moneyUsdConverter(10)}</option>
                <option value="{20}">{moneyUsdConverter(20)}</option>
                <option value="{50}">{moneyUsdConverter(50)}</option>
                <option value="{100}">{moneyUsdConverter(100)}</option>
              </select>
              <button
                type="button"
                on:click="{() =>
                  (billetesCuota1 = [
                    ...billetesCuota1,
                    { codigo: '', cantidad: montoDolaresCuota1 },
                  ])}"
                class="bg-rose-600 text-light-50 font-bold w-[140px] h-10 rounded-lg text-center px-2 py-1"
                >Agregar billete</button
              >
            </div>
            {#each billetesCuota1 as billete}
              <div
                class="flex flex-row-reverse w-full justify-center items-end gap-5"
              >
                <input
                  type="text"
                  class="border-0 w-[200px] w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-light-50/50 py-[9.7px] mt-1 mb-3"
                  placeholder="Código de billete"
                  bind:value="{billete.codigo}"
                />
                <p
                  class="w-1/4 text-pink-600 font-semibold rounded-lg py-[9.7px] mt-1 mb-3"
                >
                  Monto: {moneyUsdConverter(billete.cantidad)}
                </p>
              </div>
            {/each}
          {/if}
        </label>
      {/if}
    {/if}
    {#if inscripcionChecked && cuota1Checked}
      <label for="cuota2-check" class="block my-3">
        <input
          type="checkbox"
          name=""
          id="cuota2-check"
          checked="{cuota2Checked}"
          on:change="{() => (cuota2Checked = !cuota2Checked)}"
        />
        Cuota 2
      </label>
      {#if cuota2Checked}
        <label for="cuota2" class="flex flex-col">
          <div class="flex flex-row-reverse w-full items-end gap-5">
            <input
              class="border-0 w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-pink-600 py-[9.7px] mt-1 mb-3"
              required
              type="date"
              on:invalid="{() => {
                let html = window.document.getElementById('cuota2');
                html.setCustomValidity(
                  'El valor debe ser igual a la fecha actual o posterior a la fecha de la cuota 1'
                );
              }}"
              min="{cuota1}"
              max="{today}"
              name="cuota2"
              id="cuota2"
              bind:value="{cuota2}"
            />
            <section
              class="bg-transparent w-1/3 flex items-center h-[fit-content] py-[2.2px] bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3"
                >{#if metodoCuota2 === "dolares"}${:else}Bs.{/if}</span
              >
              <input
                type="number"
                step="0.01"
                name="monto_cuota2"
                required
                min="0"
                placeholder="Ingrese monto"
                bind:value="{montoCuota2}"
                class="bg-transparent border-0 outline-0 focus:border-0 w-[135px] placeholder-light-50/50 border-l-1 rounded-r-lg border-l-light-50 text-light-50 font-semibold"
              />
            </section>
            <section
              class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <select
                name="metodo_cuota2"
                id="prefijo"
                bind:value="{metodoCuota2}"
                class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
              >
                <option value="disabled" disabled>Método de pago</option>
                <option value="transferencia">Transferencia</option>
                <option value="bolivares">Efectivo en Bolívares</option>
                <option value="dolares">Efectivo en Dólares</option>
              </select>
            </section>
          </div>
          {#if metodoCuota2 == "dolares" && montoCuota2 != ""}
            <div class="flex w-full my-5 justify-center items-end gap-5">
              <select
                id="prefijo"
                bind:value="{montoDolaresCuota2}"
                class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-[200px]"
              >
                <option value="{0}" disabled class="text-light-50/50"
                  >Monto de billete</option
                >
                <option value="{1}">{moneyUsdConverter(1)}</option>
                <option value="{2}">{moneyUsdConverter(2)}</option>
                <option value="{5}">{moneyUsdConverter(5)}</option>
                <option value="{10}">{moneyUsdConverter(10)}</option>
                <option value="{20}">{moneyUsdConverter(20)}</option>
                <option value="{50}">{moneyUsdConverter(50)}</option>
                <option value="{100}">{moneyUsdConverter(100)}</option>
              </select>
              <button
                type="button"
                on:click="{() =>
                  (billetesCuota2 = [
                    ...billetesCuota2,
                    { codigo: '', cantidad: montoDolaresCuota2 },
                  ])}"
                class="bg-rose-600 text-light-50 font-bold w-[140px] h-10 rounded-lg text-center px-2 py-1"
                >Agregar billete</button
              >
            </div>
            {#each billetesCuota2 as billete}
              <div
                class="flex flex-row-reverse w-full justify-center items-end gap-5"
              >
                <input
                  type="text"
                  class="border-0 w-[200px] w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-light-50/50 py-[9.7px] mt-1 mb-3"
                  placeholder="Código de billete"
                  bind:value="{billete.codigo}"
                />
                <p
                  class="w-1/4 text-pink-600 font-semibold rounded-lg py-[9.7px] mt-1 mb-3"
                >
                  Monto: {moneyUsdConverter(billete.cantidad)}
                </p>
              </div>
            {/each}
          {/if}
        </label>
      {/if}
    {/if}
    {#if inscripcionChecked && cuota1Checked && cuota2Checked}
      <label for="cuota3-check" class="block my-3">
        <input
          type="checkbox"
          name=""
          id="cuota3-check"
          checked="{cuota3Checked}"
          on:change="{() => (cuota3Checked = !cuota3Checked)}"
        />
        Cuota 3
      </label>
      {#if cuota3Checked}
        <label for="cuota3" class="flex flex-col">
          <div class="flex flex-row-reverse w-full items-center gap-5">
            <input
              class="border-0 w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-pink-600 py-[9.7px] mt-1 mb-3"
              required
              type="date"
              min="{cuota2}"
              max="{today}"
              name="cuota3"
              id="cuota3"
              bind:value="{cuota3}"
              on:invalid="{() => {
                let html = window.document.getElementById('cuota3');
                html.setCustomValidity(
                  'El valor debe ser igual a la fecha actual o posterior a la fecha de la cuota 2'
                );
              }}"
            />
            <section
              class="bg-transparent w-1/3 flex items-center h-[fit-content] py-[2.2px] bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3"
                >{#if metodoCuota3 === "dolares"}${:else}Bs.{/if}</span
              >
              <input
                type="number"
                step="0.01"
                name="monto_cuota3"
                required
                min="0"
                placeholder="Ingrese monto"
                bind:value="{montoCuota3}"
                class="bg-transparent border-0 outline-0 focus:border-0 w-[135px] placeholder-light-50/50 border-l-1 rounded-r-lg border-l-light-50 text-light-50 font-semibold"
              />
            </section>
            <section
              class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <select
                name="metodo_cuota3"
                id="prefijo"
                bind:value="{metodoCuota3}"
                class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
              >
                <option value="disabled" disabled>Método de pago</option>
                <option value="transferencia">Transferencia</option>
                <option value="bolivares">Efectivo en Bolívares</option>
                <option value="dolares">Efectivo en Dólares</option>
              </select>
            </section>
          </div>
          {#if metodoCuota3 == "dolares" && montoCuota3 != ""}
            <div class="flex w-full my-5 justify-center items-end gap-5">
              <select
                id="prefijo"
                bind:value="{montoDolaresCuota3}"
                class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-[200px]"
              >
                <option value="{0}" disabled class="text-light-50/50"
                  >Monto de billete</option
                >
                <option value="{1}">{moneyUsdConverter(1)}</option>
                <option value="{2}">{moneyUsdConverter(2)}</option>
                <option value="{5}">{moneyUsdConverter(5)}</option>
                <option value="{10}">{moneyUsdConverter(10)}</option>
                <option value="{20}">{moneyUsdConverter(20)}</option>
                <option value="{50}">{moneyUsdConverter(50)}</option>
                <option value="{100}">{moneyUsdConverter(100)}</option>
              </select>
              <button
                type="button"
                on:click="{() =>
                  (billetesCuota3 = [
                    ...billetesCuota3,
                    { codigo: '', cantidad: montoDolaresCuota3 },
                  ])}"
                class="bg-rose-600 text-light-50 font-bold w-[140px] h-10 rounded-lg text-center px-2 py-1"
                >Agregar billete</button
              >
            </div>
            {#each billetesCuota3 as billete}
              <div
                class="flex flex-row-reverse w-full justify-center items-end gap-5"
              >
                <input
                  type="text"
                  class="border-0 w-[200px] w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-light-50/50 py-[9.7px] mt-1 mb-3"
                  placeholder="Código de billete"
                  bind:value="{billete.codigo}"
                />
                <p
                  class="w-1/4 text-pink-600 font-semibold rounded-lg py-[9.7px] mt-1 mb-3"
                >
                  Monto: {moneyUsdConverter(billete.cantidad)}
                </p>
              </div>
            {/each}
          {/if}
        </label>
      {/if}
    {/if}
    {#if inscripcionChecked && cuota1Checked && cuota2Checked && cuota3Checked}
      <label for="cuota4-check" class="block my-3">
        <input
          type="checkbox"
          name=""
          id="cuota4-check"
          checked="{cuota4Checked}"
          on:change="{() => (cuota4Checked = !cuota4Checked)}"
        />
        Cuota 4
      </label>
      {#if cuota4Checked}
        <label for="cuota4" class="flex flex-col">
          <div class="flex flex-row-reverse w-full gap-5">
            <input
              class="border-0 w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-pink-600 py-[9.7px] mt-1 mb-3"
              required
              type="date"
              min="{cuota3}"
              max="{today}"
              name="cuota4"
              on:invalid="{() => {
                let html = window.document.getElementById('cuota4');
                html.setCustomValidity(
                  'El valor debe ser igual a la fecha actual o posterior a la fecha de la cuota 3'
                );
              }}"
              id="cuota4"
              bind:value="{cuota4}"
            />
            <section
              class="bg-transparent w-1/3 flex items-center h-[fit-content] py-[2.2px] bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3"
                >{#if metodoCuota4 === "dolares"}${:else}Bs.{/if}</span
              >
              <input
                type="number"
                step="0.01"
                name="monto_cuota4"
                required
                min="0"
                placeholder="Ingrese monto"
                bind:value="{montoCuota4}"
                class="bg-transparent border-0 outline-0 focus:border-0 w-[135px] placeholder-light-50/50 border-l-1 rounded-r-lg border-l-light-50 text-light-50 font-semibold"
              />
            </section>
            <section
              class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <select
                name="metodo_cuota4"
                id="prefijo"
                bind:value="{metodoCuota4}"
                class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
              >
                <option value="disabled" disabled>Método de pago</option>
                <option value="transferencia">Transferencia</option>
                <option value="bolivares">Efectivo en Bolívares</option>
                <option value="dolares">Efectivo en Dólares</option>
              </select>
            </section>
          </div>
          {#if metodoCuota4 == "dolares" && montoCuota4 != ""}
            <div class="flex w-full my-5 justify-center items-end gap-5">
              <select
                id="prefijo"
                bind:value="{montoDolaresCuota4}"
                class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-[200px]"
              >
                <option value="{0}" disabled class="text-light-50/50"
                  >Monto de billete</option
                >
                <option value="{1}">{moneyUsdConverter(1)}</option>
                <option value="{2}">{moneyUsdConverter(2)}</option>
                <option value="{5}">{moneyUsdConverter(5)}</option>
                <option value="{10}">{moneyUsdConverter(10)}</option>
                <option value="{20}">{moneyUsdConverter(20)}</option>
                <option value="{50}">{moneyUsdConverter(50)}</option>
                <option value="{100}">{moneyUsdConverter(100)}</option>
              </select>
              <button
                type="button"
                on:click="{() =>
                  (billetesCuota4 = [
                    ...billetesCuota4,
                    { codigo: '', cantidad: montoDolaresCuota4 },
                  ])}"
                class="bg-rose-600 text-light-50 font-bold w-[140px] h-10 rounded-lg text-center px-2 py-1"
                >Agregar billete</button
              >
            </div>
            {#each billetesCuota4 as billete}
              <div
                class="flex flex-row-reverse w-full justify-center items-end gap-5"
              >
                <input
                  type="text"
                  class="border-0 w-[200px] w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-light-50/50 py-[9.7px] mt-1 mb-3"
                  placeholder="Código de billete"
                  bind:value="{billete.codigo}"
                />
                <p
                  class="w-1/4 text-pink-600 font-semibold rounded-lg py-[9.7px] mt-1 mb-3"
                >
                  Monto: {moneyUsdConverter(billete.cantidad)}
                </p>
              </div>
            {/each}
          {/if}
        </label>
      {/if}
    {/if}
    {#if inscripcionChecked && cuota1Checked && cuota2Checked && cuota3Checked && cuota4Checked}
      <label for="cuota5-check" class="block my-3">
        <input
          type="checkbox"
          name=""
          id="cuota5-check"
          checked="{cuota5Checked}"
          on:change="{() => (cuota5Checked = !cuota5Checked)}"
        />
        Cuota 5
      </label>
      {#if cuota5Checked}
        <label for="cuota5" class="flex flex-col">
          <div class="flex flex-row-reverse w-full items-end gap-5">
            <input
              class="border-0 w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-pink-600 py-[9.7px] mt-1 mb-3"
              required
              type="date"
              min="{cuota4}"
              max="{today}"
              on:invalid="{() => {
                let html = window.document.getElementById('cuota5');
                html.setCustomValidity(
                  'El valor debe ser igual a la fecha actual o posterior a la preinscripcion'
                );
              }}"
              name="cuota5"
              id="cuota5"
              bind:value="{cuota5}"
            />
            <section
              class="bg-transparent w-1/3 flex items-center h-[fit-content] py-[2.2px] bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3"
                >{#if metodoCuota5 === "dolares"}${:else}Bs.{/if}</span
              >
              <input
                type="number"
                step="0.01"
                name="monto_cuota5"
                required
                min="0"
                placeholder="Ingrese monto"
                bind:value="{montoCuota5}"
                class="bg-transparent border-0 outline-0 focus:border-0 w-[135px] placeholder-light-50/50 border-l-1 rounded-r-lg border-l-light-50 text-light-50 font-semibold"
              />
            </section>
            <section
              class="bg-transparent w-2/5 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <select
                name="metodo_cuota5"
                id="prefijo"
                bind:value="{metodoCuota5}"
                class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-full"
              >
                <option value="disabled" disabled>Método de pago</option>
                <option value="transferencia">Transferencia</option>
                <option value="bolivares">Efectivo en Bolívares</option>
                <option value="dolares">Efectivo en Dólares</option>
              </select>
            </section>
          </div>
          {#if metodoCuota5 == "dolares" && montoCuota5 != ""}
            <div class="flex w-full my-5 justify-center items-end gap-5">
              <select
                id="prefijo"
                bind:value="{montoDolaresCuota5}"
                class="bg-transparent bg-sky-600 text-light-50 font-semibold rounded-lg mt-1 px-3 py-[9.5px] w-[200px]"
              >
                <option value="{0}" disabled class="text-light-50/50"
                  >Monto de billete</option
                >
                <option value="{1}">{moneyUsdConverter(1)}</option>
                <option value="{2}">{moneyUsdConverter(2)}</option>
                <option value="{5}">{moneyUsdConverter(5)}</option>
                <option value="{10}">{moneyUsdConverter(10)}</option>
                <option value="{20}">{moneyUsdConverter(20)}</option>
                <option value="{50}">{moneyUsdConverter(50)}</option>
                <option value="{100}">{moneyUsdConverter(100)}</option>
              </select>
              <button
                type="button"
                on:click="{() =>
                  (billetesCuota5 = [
                    ...billetesCuota5,
                    { codigo: '', cantidad: montoDolaresCuota5 },
                  ])}"
                class="bg-rose-600 text-light-50 font-bold w-[140px] h-10 rounded-lg text-center px-2 py-1"
                >Agregar billete</button
              >
            </div>
            {#each billetesCuota5 as billete}
              <div
                class="flex flex-row-reverse w-full justify-center items-end gap-5"
              >
                <input
                  type="text"
                  class="border-0 w-[200px] w-1/3 bg-sky-600 text-light-50 font-semibold rounded-lg placeholder-light-50/50 py-[9.7px] mt-1 mb-3"
                  placeholder="Código de billete"
                  bind:value="{billete.codigo}"
                />
                <p
                  class="w-1/4 text-pink-600 font-semibold rounded-lg py-[9.7px] mt-1 mb-3"
                >
                  Monto: {moneyUsdConverter(billete.cantidad)}
                </p>
              </div>
            {/each}
          {/if}
        </label>
      {/if}
    {/if}
    <div class="flex justify-center gap-4 items-center w-full p-3">
      <button
        type="button"
        on:click="{() => goto('/pagos')}"
        class="bg-blue-600 text-light-50 font-bold w-[140px] h-10 rounded-lg text-center px-2 py-1"
        ><a href="/pagos" class="w-full h-full">Volver atrás</a></button
      >
      <button
        type="submit"
        class="bg-rose-600 text-light-50 font-bold w-[140px] h-10 rounded-lg text-center px-2 py-1"
        >Registrar</button
      >
    </div>
  </form>
</main>

<style>
  main {
    background-image: url("$lib/images/pascalConFondo.png");
    background-position: center;
    background-size: cover;
  }
  form {
    height: calc(100vh - 90px);
    background-color: rgba(255, 255, 255, 0.9);
  }

  input[type="date"] {
    -webkit-text-fill-color: white;
  }

  input[type="date"]:invalid {
    -webkit-text-fill-color: #9e4077;
    border: 2px solid red;
  }

  input[type="number"]:invalid {
    border: 2px solid red;
  }
</style>
