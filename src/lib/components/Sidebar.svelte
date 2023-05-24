<nav class="flex justify-between  flex-col w-[250px] items-center text-light-50 bg-[#0868b2]">
    <a
      href="/estudiantes"
      class="text-2xl font-semibold w-full h-full flex justify-center items-center hover:bg-[#db0081] transition-background duration-200"
      >Estudiantes</a
    >
    <a
      href="/pagos"
      class="text-2xl font-semibold w-full h-full flex justify-center items-center hover:bg-[#db0081] transition-background duration-200"
      >Pagos registrados</a
    >
    <a
      href="/movimientos"
      class="text-2xl font-semibold w-full h-full flex justify-center items-center hover:bg-[#db0081] transition-background duration-200"
      >Movimientos</a
    >
  </nav>

  <style>
    @media print{
      nav{
        display: none !important;
      }
    }
    nav{
      height: calc(100vh - 80px);
    }
  </style>