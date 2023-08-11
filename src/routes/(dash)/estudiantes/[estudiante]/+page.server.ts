import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { Estudiante } from "../../../../app";

export const load = (async ({locals:{client}, params}) => {
    const { ok, data } = await client.GET(`/api/students/${params.estudiante}`);
    if (ok && !data.estudiante) {
      throw redirect(302, `/pagos?regPago=${params.estudiante}`);
  }
  
  const { ok: isOk, data: carreraData } = await client.GET("/api/carreras");

  const carreras: {
    id: string;
    nombre: string;
  }[] = carreraData.carreras
    .map((carrera: { id: string; nombre: string }) => ({ ...carrera }))
    .filter(
      (carrera: { id: string; nombre: string }, index: any, self: any) =>
        index ===
        self.findIndex(
          (t: { id: string; nombre: string }) => t.id === carrera.id
        )
    );
  
  console.log(data);
  
    return {
      estudiante: data.estudiante,
      pago: data.pago,
      monto: data.monto,
      metodo: data.metodo,
      carreras
    };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ locals: { client }, request, params }) => {
    let obj: Estudiante | any = Object.fromEntries(await request.formData()) as unknown as any;

    obj = {
      ...obj,
      fullname: obj.nombre
    }
    const { ok, data } = await client.PUT(
      `/api/students/update/${params.estudiante}`,
      obj
    );
    if (!ok) {
      return fail(400, {
        message: data.message,
        ok: false,
      });
    }

    return {message: "El estudiante ha sido editado exitosamente", ok: true}
  },
};