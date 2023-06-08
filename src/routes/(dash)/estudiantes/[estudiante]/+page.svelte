<script lang="ts">
  import { browser } from "$app/environment";
  import { enhance, type SubmitFunction } from "$app/forms";
  import type { Estudiante } from "../../../../app";
  import type { PageData } from "./$types";

  export let data: PageData;
  let nombre = data.estudiante.nombre;
  let cedula = data.estudiante.cedula;
  let correo = data.estudiante.correo;
  let estado = data.estudiante.estado;
  let carrera = data.estudiante.carrera;
  let prefTelefono = "";
  const viejosDatos: Estudiante = data.estudiante;
  let metodo: any = data.metodo;
  let prefijo: string = data.estudiante.telefono.slice(0, 4);
  let telefono: string = data.estudiante.telefono.slice(5);
  let semestre = data.estudiante.semestre.toString();
  $: if (telefono.length > 7) {
    telefono = telefono.slice(0, 6);
  }
  $: prefTelefono = `${prefijo}-${telefono}`;

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

  const handleEstudiante: SubmitFunction = ({ data, cancel }) => {
    const clave = prompt(
      "Ingrese la clave otorgada para poder registrar los cambios efectuados"
    );
    if (clave !== "12345") {
      alert("Clave inválida");
      return cancel();
    }
    data.append("telefono", prefTelefono);
    return async ({ update }) => {
      await update();
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
        } >>> se ha modificado al estudiante con la cédula ${cedula}, campos modificados: ${
          viejosDatos.correo !== correo ? "correo," : ""
        } ${viejosDatos.nombre !== nombre ? "nombre," : ""} ${
          viejosDatos.semestre !== semestre ? "semestre," : ""
        } ${viejosDatos.estado !== estado ? "estado" : ""} ${
          viejosDatos.telefono !== telefono ? "y telefono" : ""
        }`
      );
      localStorage.setItem("log", JSON.stringify(logs));
      window.location.reload();
    };
  };
</script>

<section class="main w-full h-full">
    <div class="!bg-[#EEEEEEEE] w-full h-full flex flex-col justify-center items-center">
    <form
  method="POST"
  use:enhance="{handleEstudiante}"
  class="flex p-4 flex-col gap-y-3 w-1/2 h-[fit-content]"
>
  <h3 class="text-4xl my-3 font-bold text-pink-500 text-center my-8">Datos del estudiante</h3>
  <p class="text-2xl w-full flex items-center">
    <span class="w-1/2">Nombre:</span><input
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
      bind:value="{nombre}"
    />
  </p>
  <p class="text-2xl w-full flex items-center">
    <span class="w-1/2">Cédula:</span><input
      disabled
      type="text"
      name="cedula"
      class="text-xl bg-transparent border-dashed border-2 w-4/5 border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
      bind:value="{cedula}"
    />
  </p>
  <p class="text-2xl w-full flex items-center">
    <span class="w-1/2">Correo:</span><input
      type="text"
      required
      name="email"
      class="text-xl bg-transparent border-dashed border-2 w-4/5 border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
      bind:value="{correo}"
    />
  </p>
  <p class="text-2xl w-full flex items-center">
    <span class="w-1/2">Semestre:</span>
    <select
      name="semestre"
      id="semestre"
      class="text-xl bg-transparent border-dashed border-2 w-4/5 border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
      bind:value="{semestre}"
    >
      <option value="1">1ro</option>
      <option value="2">2do</option>
      <option value="3">3ro</option>
      <option value="4">4to</option>
      <option value="5">5to</option>
      <option value="6">6to</option>
    </select>
  </p>
  <p class="text-2xl w-full flex items-center">
    <span class="w-1/2">Estado:</span>
    <select
      bind:value="{estado}"
      name="estado"
      id="estado"
      class="text-xl bg-transparent border-dashed border-2 w-4/5 border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
    >
      <option value="nuevo ingreso">Nuevo ingreso</option>
      <option value="regular">Regular</option>
      <option value="repitiente">Repitiente</option>
      <option value="abandona">Abandono</option>
    </select>
  </p>
  <p class="text-2xl w-full flex items-center">
    <span class="w-1/2">Carrera:</span>
    <select
      name="carrera"
      id="carrera"
      class="text-xl bg-transparent border-dashed border-2 w-4/5 border-pink-500 text-blue-900 font-semibold rounded-lg px-5 py-2"
      bind:value="{carrera}"
    >
      <option value="1">Informatica</option>
      <option value="2">Tecnología de Alimentos</option>
      <option value="3">Comunicación y Electrónica</option>
      <option value="4">Diseño Gráfico</option>
      <option value="5">Contabilidad y Costos</option>
      <option value="6">Administración Bancaria y Financiera</option>
      <option value="7">Administración de Empresas</option>
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
      class="bg-pink-600 rounded-lg text-light-50 !text-lg font-bold w-auto px-10 py-1"
      >Guardar cambios del estudiante</button
    >
  </div>
</form>
</div>
</section>

<style lang="scss">
.main {
    height: calc(100vh - 100px);
    background-image: url("$lib/images/pascalConFondo.png");
    background-position: center;
    background-size: cover;
  }
</style>