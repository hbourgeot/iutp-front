import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({locals:{client}, depends}) => {
    const {ok, data} = await client.GET("/api/students")
    if (!ok) {
        return {estudiantes: []}
    }
    return {estudiantes: data};
}

export const actions: Actions = {
    default:async ({locals:{client}, request}) => {
        let obj = Object.fromEntries(await request.formData()) as unknown as any
        const payload = {
            cedula: obj.cedula,
            fullname: obj.nombre,
            correo: obj.email,
            password: obj.cedula.replace("V-", ""),
            estado: obj.estado,
            telefono: obj.telefono,
            semestre: parseInt(obj.semestre)
        }
        const { ok, data } = await client.POST("/api/students/add", payload)
        if (!ok) {
            return fail(400, {"message": data})
        }
        
        throw redirect(303, `/pagos?regPago=${obj.cedula}`)
    }
};