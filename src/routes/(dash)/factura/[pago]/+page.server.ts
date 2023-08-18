import type { PageServerLoad } from './$types';

export const load = (async ({ fetch, locals: { client }, params }) => {
    const response = await fetch("https://api.exchangedyn.com/markets/quotes/usdves/bcv");
    const { ok, data } = await client.GET(`/api/pagos/${params.pago}`)
    if (!ok) {
        return {}
    }

    const {
      estudiante,
      fecha_pago: fechaPago,
      metodo_pago: metodoPago,
      monto,
    }: {
      estudiante: string;
      fecha_pago: string;
      metodo_pago: { descripcion: string; id: number; nombre: string };
      monto: { concepto: string; id: number; monto: string };
        } = data;
    
    const { ok: okey, data: est } = await client.GET(`/api/students/${estudiante}`);
    if (!okey) {
        return {}
    }

    const { nombre } = est;

    const currency = await response.json();
    const bcv = currency.sources.BCV.quote;
    return {bcv: bcv, estudiante, fechaPago, metodoPago, monto, nombreEstudiante: nombre};
}) satisfies PageServerLoad;