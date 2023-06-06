import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({locals:{client}, params}) => {
    const { ok, data } = await client.GET(`/api/students/${params.estudiante}`);
    if (ok && !data.estudiante) {
      throw redirect(302, `/pagos?regPago=${params.estudiante}`);
    }
    return {
      estudiante: data.estudiante,
      pago: data.pago,
      monto: data.monto,
      metodo: data.metodo,
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ locals: { client }, request, params }) => {
    let obj = Object.fromEntries(await request.formData()) as unknown as any;
    const payload = {
      cedula: params.estudiante,
      fullname: obj.nombre,
      correo: obj.email,
      password: params.estudiante.includes("V-")
        ? params.estudiante.replace("V-", "")
        : params.estudiante.replace("E-", ""),
      estado: obj.estado,
      telefono: obj.telefono,
      semestre: parseInt(obj.semestre),
      carrera: obj.carrera,
    };
    const { ok, data } = await client.PUT(
      `/api/students/update/${payload.cedula}`,
      payload
    );
    if (!ok) {
      return fail(400, {
        message: "Error al actualizar el estudiante, intente de nuevo",
      });
    }
  },
};