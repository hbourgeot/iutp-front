<aside class="grid grid-cols-1 grid-rows-[repeat(5,1fr)] md:grid-rows-[repeat(3,1fr)] md:place-content-around justify-around h-11/12 text-light-50 bg-[#0868b2] w-full md:w-2/11 overflow-y-auto overflow-x-hidden">
    <a href="/" class="text-xl font-normal p-5 flex justify-start md:hidden items-center hover:bg-[#db0081] transition-background duration-100">Estudiantes</a>
    <a href="/logout" class="text-xl font-normal p-5 flex justify-start md:hidden items-center hover:bg-[#db0081] transition-background duration-100">Cerrar sesion</a>
    <a href="/" class="text-2xl font-bold flex justify-start items-center p-5 hover:bg-[#db0081] transition-background duration-100">Generar Reporte</a>
    <a href="/" class="text-2xl font-bold flex justify-start items-center p-5 hover:bg-[#db0081] transition-background duration-100">Registrar pagos</a>
    <a href="/" class="text-2xl font-bold flex justify-start items-center p-5 hover:bg-[#db0081] transition-background duration-100">Emisión de Recibos de Pago</a>
</aside>

<style lang="scss">
  aside{
      height: calc(100vh - 80px);
      transition: left 200ms;
      @media (max-width:767.9px) {
        position: fixed;
        top: 80px;
        left: -500px;
      }
    }
    
</style>