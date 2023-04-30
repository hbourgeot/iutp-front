import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { Estudiante } from '../../../app';

export const load: PageServerLoad = async ({locals:{client}, depends}) => {
    const {ok, data} = await client.GET("/api/admin")
    let {ok: okey, data: estudiantes} = await client.GET("/api/students")
    let estudiantesSinPagos: any[] = []
    
    estudiantes.map((estudiante: any) => {
        let pago = data.filter((pago: any) => {
            if (pago.cedula_estudiante === estudiante.cedula) return pago
        })
        
        if (!pago[0]) {
            estudiantesSinPagos.push(estudiante)
        }
    })

    if (!ok) {
        if (!okey) {
            return { pagos: [], estudiantes: []}
        }

        return { pagos: [], estudiantes: estudiantesSinPagos.map((estudiante: Estudiante) => ({cedula: estudiante.cedula, nombre: estudiante.nombre}))}

    }
    return {pagos: data, estudiantes: estudiantesSinPagos.map((estudiante: Estudiante) => ({cedula: estudiante.cedula, nombre: estudiante.nombre}))};
}

export const actions: Actions = {
    default:async ({locals:{client}, request}) => {
        let obj = Object.fromEntries(await request.formData()) as unknown as any
        const payload = {
            cedula_student: obj.cedula,
            pre_inscripcion: obj.pre_inscripcion,
            inscripcion: obj.inscripcion,
            cuota1: obj.cuota1 ?? "",
            cuota2: obj.cuota2 ?? "",
            cuota3: obj.cuota3 ?? "",
            cuota4: obj.cuota4 ?? "",
            cuota5: obj.cuota5 ?? ""
        }
        const { ok, data } = await client.POST("/api/admin/add", payload)
        console.log(ok, data);
        if (!ok) {
            return fail(400, {"message": data.message})
        }
    }
};