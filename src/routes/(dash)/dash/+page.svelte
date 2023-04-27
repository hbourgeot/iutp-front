<script lang="ts">
  import Nav from '$lib/components/Nav.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';
  import {Icon} from '@steeze-ui/svelte-icon'
  import {User, Receipt, Vocabulary} from '@steeze-ui/tabler-icons'
  import type { PageData } from './$types';

  export let data: PageData
</script>
    <section class="flex justify-around w-full">
        <div class="flex justify-center items-center w-1/5">
            <Icon src={User} class="h-15 w-2/5 stroke-[#db0081]"/>
            <div class="info">
                <p class="text-2xl font-bold text-[#db0081]">{data.estudiantes}</p>
                <p class="text-xl">{data.estudiantes > 1 || data.estudiantes == 0 ? 'Estudiantes registrados': 'Estudiante registrado'}</p>
            </div>
        </div>
        <div class="flex justify-center items-center w-1/5">
            <Icon src={Receipt} class="h-15 w-2/5 stroke-[#db0081]"/>
            <div class="info">
                <p class="text-2xl font-bold text-[#db0081]">{data.pagosDelDia}</p>
                <p class="text-xl">{data.pagosDelDia > 1 || data.pagosDelDia == 0 ? 'Inscripciones registradas' : 'Inscripción registrada'} hoy</p>
            </div>
        </div>
        <div class="flex justify-center items-center w-1/5">
            <Icon src={Vocabulary} class="h-15 w-2/5 stroke-[#db0081]"/>
            <div class="info">
                <p class="text-2xl font-bold text-[#db0081]">{data.pagosDelMes}</p>
                <p class="text-xl">{data.pagosDelMes > 1 || data.pagosDelMes == 0 ? 'Inscripciones registradas' : 'Inscripción registrada'} este mes</p>
            </div>
        </div>
    </section>