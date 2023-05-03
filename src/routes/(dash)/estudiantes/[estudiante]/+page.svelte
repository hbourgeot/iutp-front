<script lang="ts">
  import { enhance, type SubmitFunction } from "$app/forms";
  import type { Estudiante } from "../../../../app";
  import type { ActionData, PageData } from "./$types";

  export let data: PageData;
  export let form: ActionData;

  $: if (form?.message) {
    alert(form.message);
  }
  let estudiante: Estudiante = data.estudiante;
  estudiante.semestre = estudiante.semestre.toString();
  let pagos: any = data.pago;
  let monto: any = data.monto;
  let prefijo: string = estudiante.telefono.slice(0, 4);
  let telefono: string = estudiante.telefono.slice(5);
  let cuota1Checked: boolean = pagos.cuota1 !== "" ? true : false;
  let cuota2Checked: boolean = pagos.cuota2 !== "" ? true : false;
  let cuota3Checked: boolean = pagos.cuota3 !== "" ? true : false;
  let cuota4Checked: boolean = pagos.cuota4 !== "" ? true : false;
  let cuota5Checked: boolean = pagos.cuota5 !== "" ? true : false;
  let inscripcionChecked: boolean = pagos.inscripcion !== "" ? true : false;

  let date: Date = new Date();
  const today: string = `${date.getFullYear()}-${
    date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1
  }-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
  let preInscripcion: string = pagos.pre_inscripcion;
  let inscripcion: string = pagos.inscripcion ?? "";
  let cuota1: string = pagos.cuota1 ?? "";
  let cuota2: string = pagos.cuota2 ?? "";
  let cuota3: string = pagos.cuota3 ?? "";
  let cuota4: string = pagos.cuota4 ?? "";

  let cuota5: string = pagos.cuota5 ?? "";

  let montopreInscripcion: number | string =
    monto.pre_inscripcion === "0.00" ? "" : monto.pre_inscripcion;
  let montoinscripcion: number | string =
    monto.inscripcion === "0.00" ? "" : monto.inscripcion;
  let montocuota1: number | string =
    monto.cuota1 === "0.00" ? "" : monto.cuota1;
  let montocuota2: number | string =
    monto.cuota2 === "0.00" ? "" : monto.cuota2;
  let montocuota3: number | string =
    monto.cuota3 === "0.00" ? "" : monto.cuota3;
  let montocuota4: number | string =
    monto.cuota4 === "0.00" ? "" : monto.cuota4;
  let montocuota5: number | string =
    monto.cuota5 === "0.00" ? "" : monto.cuota5;

  $: if (inscripcionChecked && inscripcion === "") inscripcion = today;
  $: if (cuota1Checked && cuota1 === "") cuota1 = today;
  $: if (cuota2Checked && cuota2 === "") cuota2 = today;
  $: if (cuota3Checked && cuota3 === "") cuota3 = today;
  $: if (cuota4Checked && cuota4 === "") cuota4 = today;
  $: if (cuota5Checked && cuota5 === "") cuota5 = today;
  $: if (estudiante.semestre > 10) estudiante.semestre = 10;
  $: if (telefono.length > 7) {
    telefono = telefono.slice(0, 6);
  }
  $: estudiante.telefono = `${prefijo}-${telefono}`;

  const handleSubmit: SubmitFunction = ({ data }) => {
    data.append("telefono", estudiante.telefono);
    return async ({ update }) => {
      await update();
      window.location.reload();
    };
  };
</script>

<section class="overflow-y-scroll p-7 gap-y-5 w-full h-[90vh]">
  <div class="flex w-full justify-between items-center p-8">
    <h2 class="text-5xl text-pink-500 font-bold">Estudiante</h2>
    <a
      href="/pagos"
      class="bg-sky-600 rounded-lg text-light-50 text-2xl font-bold w-auto px-7 py-1"
      >Volver atrás</a
    >
  </div>
  <article
    class="flex flex-col md:flex-row md:justify-evenly h-full md:items-center md:gap-x-5"
  >
    <form
      method="POST"
      action="?/estudiante"
      use:enhance="{handleSubmit}"
      class="flex flex-col gap-y-3 w-2/5"
    >
      <h3 class="text-4xl my-3 font-bold text-pink-500">Datos</h3>
      <p class="text-2xl w-full flex items-center">
        <span class="w-1/2">Estudiante:</span><input
          class="text-xl bg-transparent border-dashed border-2 w-4/5 border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
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
          bind:value="{estudiante.nombre}"
        />
      </p>
      <p class="text-2xl w-full flex items-center">
        <span class="w-1/2">Cédula:</span><input
          disabled
          type="text"
          name="cedula"
          class="text-xl bg-transparent border-dashed border-2 w-4/5 border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
          bind:value="{estudiante.cedula}"
        />
      </p>
      <p class="text-2xl w-full flex items-center">
        <span class="w-1/2">Correo:</span><input
          type="text"
          required
          name="email"
          class="text-xl bg-transparent border-dashed border-2 w-4/5 border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
          bind:value="{estudiante.correo}"
        />
      </p>
      <p class="text-2xl w-full flex items-center">
        <span class="w-1/2">Semestre:</span>
        <select
          name="semestre"
          id="semestre"
          class="text-xl bg-transparent border-dashed border-2 w-4/5 border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
          bind:value="{estudiante.semestre}"
        >
          <option value="1">Primero</option>
          <option value="2">Segundo</option>
          <option value="3">Tercero</option>
          <option value="4">Cuarto</option>
          <option value="5">Quinto</option>
          <option value="6">Sexto</option>
          <option value="7">Séptimo</option>
          <option value="8">Octavo</option>
          <option value="9">Noveno</option>
          <option value="10">Décimo</option>
        </select>
      </p>
      <p class="text-2xl w-full flex items-center">
        <span class="w-1/2">Estado:</span>
        <select
          bind:value="{estudiante.estado}"
          name="estado"
          id="estado"
          class="text-xl bg-transparent border-dashed border-2 w-4/5 border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
        >
          <option value="en curso">En curso</option>
          <option value="congelado">Congelado</option>
          <option value="suspendido">Suspendido</option>
          <option value="expulsado">Expulsado</option>
        </select>
      </p>
      <p class="text-2xl w-full flex items-center">
        <span class="w-1/2">Teléfono:</span>
        <select
          bind:value="{prefijo}"
          name=""
          id="prefijo"
          class="text-xl bg-transparent border-dashed border-2 w-[150px] border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
        >
          <option value="0412">0412</option>
          <option value="0414">0414</option>
          <option value="0424">0424</option>
          <option value="0416">0416</option>
          <option value="0426">0426</option>
        </select>
        <input
          class="text-xl bg-transparent border-dashed border-2 w-3/5 border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
          required
          type="text"
          min="0"
          maxlength="7"
          id="cedula"
          bind:value="{telefono}"
        />
      </p>
      <div
        class="flex flex-col md:flex-row justify-center gap-4 items-center w-full p-3 py-9"
      >
        <button
          type="submit"
          formaction="?/estudiante"
          class="bg-rose-600 rounded-lg text-light-50 text-xl font-bold w-auto px-7 py-1"
          >Editar</button
        >
      </div>
    </form>
    <form method="post" action="?/pago" use:enhance="{handleSubmit}">
      <input type="hidden" name="id_monto" value="{monto.id}" />
      <input type="hidden" name="id_pago" value="{monto.id_pago}" />
      <h3 class="text-4xl my-3 font-bold text-pink-500">Pagos</h3>
      <label for="pre_inscripcion" class="flex flex-col">
        Preinscripción
        <div class="flex w-full gap-5">
          <input
            class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
            class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
          >
            <span class="text-xl px-3">Bs.</span>
            <input
              type="number"
              step="0.01"
              name="monto_pre_inscripcion"
              bind:value="{montopreInscripcion}"
              required
              min="0"
              placeholder="Ingrese monto"
              class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
            />
          </section>
        </div>
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
          <div class="flex w-full gap-5">
            <input
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
              class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
            >
              <span class="text-xl px-3">Bs.</span>
              <input
                type="number"
                step="0.01"
                name="monto_inscripcion"
                bind:value="{montoinscripcion}"
                required
                min="0"
                placeholder="Ingrese monto"
                class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold"
              />
            </section>
          </div>
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
            <div class="flex w-full gap-5">
              <input
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
              >
                <span class="text-xl px-3">Bs.</span>
                <input
                  type="number"
                  step="0.01"
                  name="monto_cuota1"
                  bind:value="{montocuota1}"
                  required
                  min="0"
                  placeholder="Ingrese monto"
                  class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold accent-pink-500"
                />
              </section>
            </div>
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
            <div class="flex w-full gap-5">
              <input
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
              >
                <span class="text-xl px-3">Bs.</span>
                <input
                  type="number"
                  step="0.01"
                  name="monto_cuota2"
                  bind:value="{montocuota2}"
                  required
                  min="0"
                  placeholder="Ingrese monto"
                  class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold accent-pink-500"
                />
              </section>
            </div>
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
            <div class="flex w-full gap-5">
              <input
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
              >
                <span class="text-xl px-3">Bs.</span>
                <input
                  type="number"
                  step="0.01"
                  name="monto_cuota3"
                  bind:value="{montocuota3}"
                  required
                  min="0"
                  placeholder="Ingrese monto"
                  class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold accent-pink-500"
                />
              </section>
            </div>
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
            <div class="flex w-full gap-5">
              <input
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
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
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
              >
                <span class="text-xl px-3">Bs.</span>
                <input
                  type="number"
                  step="0.01"
                  name="monto_cuota4"
                  bind:value="{montocuota4}"
                  required
                  min="0"
                  placeholder="Ingrese monto"
                  class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold accent-pink-500"
                />
              </section>
            </div>
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
          <label for="cuota1" class="flex flex-col">
            <div class="flex w-full gap-5">
              <input
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
                required
                type="date"
                min="{cuota4}"
                max="{today}"
                name="cuota5"
                id="cuota5"
                bind:value="{cuota5}"
              />
              <section
                class="bg-transparent border-dashed border-2 border-pink-500 text-blue-900 font-semibold rounded-lg mt-1 mb-3"
              >
                <span class="text-xl px-3">Bs.</span>
                <input
                  type="number"
                  step="0.01"
                  name="monto_cuota5"
                  bind:value="{montocuota5}"
                  required
                  min="0"
                  on:invalid="{() => {
                    let html = window.document.getElementById('cuota5');
                    html.setCustomValidity(
                      'El valor debe ser igual a la fecha actual o posterior a la fecha de la cuota 4'
                    );
                  }}"
                  placeholder="Ingrese monto"
                  class="bg-transparent border-dashed border-l-2 border-t-transparent border-r-transparent border-b-transparent border-l-pink-500 text-blue-900 font-semibold accent-pink-500"
                />
              </section>
            </div>
          </label>
        {/if}
      {/if}
      <div
        class="flex flex-col md:flex-row justify-center gap-4 items-center w-full p-3 py-9"
      >
        <button
          type="submit"
          formaction="?/pago"
          class="bg-rose-600 rounded-lg text-light-50 font-bold w-auto px-7 py-1"
          >Editar</button
        >
      </div>
    </form>
  </article>
</section>

<style>
  form > label,
  form button {
    font-size: 24px;
  }

  :global(input[type="checkbox"]) {
    color: #db0081;
    border-color: #db0081;
  }

  :global(input[type="checkbox"]:focus) {
    box-shadow: 0 0 0 0;
  }
</style>
