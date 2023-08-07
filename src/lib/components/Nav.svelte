<script lang="ts">
  import {DoorExit} from "@steeze-ui/tabler-icons"

  import {Icon} from "@steeze-ui/svelte-icon"
import pascalLogo from "$lib/images/pascalConFondo.png";
  import { page } from "$app/stores";
  
  let title: string= "";
  $: switch($page.url.pathname){
    case "/estudiantes":
      title = "Estudiantes";
      break;
    case "/pagos":
      title = "Pagos";
      break;
    case "/pagos/registrar":
      title = "Registrar Pago";
      break;
    case "/factura":
      title = "Factura";
      break;
    case "/inicio":
      title = "Bienvenido";
      break;
    case "/movimientos":
      title = "Movimientos";
    default:
      if($page.url.pathname.includes("/pago/V-") || $page.url.pathname.includes("/pago/E-")){
        title = `Pago del Estudiante con cédula ${$page.url.pathname.replace("/", " ".toLowerCase().replace("Pagos ", ""))}`
      } else if($page.url.pathname.includes("/reporte/")){
        title = `Reporte ${$page.url.pathname.includes("dia") ? 'del ' + $page.url.href.slice(-10) : ""}${$page.url.pathname.includes("fecha") ? "por fechas" : ""}${$page.url.pathname.includes("monto") ? "de montos" : ""}`
      }
  }
</script>

<header
  class="flex justify-between h-20 items-center p-3 text-white bg-[#0868b2] sticky top-0"
>
  <h1 class="text-2xl w-1/9">
    <a href="/inicio" class="flex items-center font-bold gap-1">
      <img
        src={pascalLogo}
        alt="Logo del Instituto Pascal"
        class="mr-3 w-12 rounded-full"
      />
      IUT Pascal</a
    >
  </h1>

  <h3 class="text-2xl -ml-25 capitalize">
    {title}
  </h3>
  <a
      href="/logout" title="Cerrar sesión"
      class="text-2xl font-bold w-15 rounded-xl h-full flex justify-center items-center hover:bg-[#db0081] transition-background duration-100"
      ><Icon src={DoorExit} class="h-10 w-10"/></a
    >
</header>

<style>
  @media print{
    header{
      display: none !important;
    }
  }

  header{
    width: 100%;
  }
</style>