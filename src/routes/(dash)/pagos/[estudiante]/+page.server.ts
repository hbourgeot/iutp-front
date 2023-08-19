import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals:{client}, params, url}) => {
    const { ok, data } = await client.GET(`/api/students/${params.estudiante}`)
    const { ok: okey, data: pagos } = await client.GET("/api/pagos")
    const { ok: okC, data: config } = await client.GET("/api/config/1")
    const tipo = url.searchParams.get("tipo");
    if (!ok || !okey || !okC) {
        return {}
    }
    let pagosEstudiante = tipo === "todos" ? pagos.filter((pago: any) => pago.estudiante === params.estudiante) : pagos.filter((pago: any) => pago.estudiante === params.estudiante && pago.ciclo == config.ciclo)
    
    return {
        estudiante: data,
        pagos: pagosEstudiante
    };
}) satisfies PageServerLoad;