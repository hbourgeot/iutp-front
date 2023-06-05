import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({locals:{client}, params}) => {
    const {ok, data} = await client.GET(`/api/students/${params.estudiante}`)
    if (ok && !data.estudiante) {
        throw redirect(302, `/pagos?regPago=${params.estudiante}`)
    }

    console.log(data);

    return {
        estudiante: data.estudiante,
        pago: data.pago,
        monto: data.monto,
        metodo: data.metodo
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
    pago:async ({locals:{client}, request, params}) => {
        let obj = Object.fromEntries(await request.formData()) as unknown as any
        
        const payload = {
          cedula_student: params.estudiante,
          pre_inscripcion: obj.pre_inscripcion,
          inscripcion: obj.inscripcion,
          cuota1: obj.cuota1 ?? "",
          cuota2: obj.cuota2 ?? "",
          cuota3: obj.cuota3 ?? "",
          cuota4: obj.cuota4 ?? "",
          cuota5: obj.cuota5 ?? "",
          metodo_pre_inscripcion: obj.metodo_pre_inscripcion,
          metodo_inscripcion: obj.metodo_inscripcion,
          metodo_cuota1: obj.metodo_cuota1 ?? "",
          metodo_cuota2: obj.metodo_cuota2 ?? "",
          metodo_cuota3: obj.metodo_cuota3 ?? "",
          metodo_cuota4: obj.metodo_cuota4 ?? "",
          metodo_cuota5: obj.metodo_cuota5 ?? "",
          monto_pre_inscripcion: obj.monto_pre_inscripcion,
          monto_inscripcion: obj.monto_inscripcion ?? 0,
          monto_cuota1: obj.monto_cuota1 ?? 0,
          monto_cuota2: obj.monto_cuota2 ?? 0,
          monto_cuota3: obj.monto_cuota3 ?? 0,
          monto_cuota4: obj.monto_cuota4 ?? 0,
          monto_cuota5: obj.monto_cuota5 ?? 0,
        };

        const { ok, data } = await client.PUT(`/api/admin/update/${obj.id_pago}`, payload)
        if (!ok) {
            return fail(400, {"message": "Error al actualizar el pago, intente de nuevo"})
        }
    },

    estudiante:async ({locals:{client}, request, params}) => {
        let obj = Object.fromEntries(await request.formData()) as unknown as any
        const payload = {
            cedula: params.estudiante,
            fullname: obj.nombre,
            correo: obj.email,
            password: params.estudiante.replace("V-", ""),
            estado: obj.estado,
            telefono: obj.telefono,
            semestre: parseInt(obj.semestre),
            carrera: obj.carrera
        }
        const { ok, data } = await client.PUT(`/api/students/update/${payload.cedula}`, payload)
        if (!ok) {
            return fail(400, {"message": "Error al actualizar el estudiante, intente de nuevo"})
        }
    }
};
