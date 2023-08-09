import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { client } }) => {
  
  const { ok, data: estudiantes } = await client.GET("/api/students");
  if (!ok) {
    return { estudiantes: [], carreras: [] };
  }

  const { ok: isOk, data } = await client.GET("/api/carreras");

  const carreras: {
    id: string;
    nombre: string}[] = data.carreras
    .map((carrera: { id: string; nombre: string }) => ({ ...carrera }))
    .filter(
      (carrera: { id: string; nombre: string }, index: any, self: any) =>
        index ===
        self.findIndex(
          (t: { id: string; nombre: string }) => t.id === carrera.id
        )
    );
  return { estudiantes: estudiantes, carreras };
};

export const actions: Actions = {
  default: async ({ locals: { client }, request }) => {
    let obj = Object.fromEntries(await request.formData()) as unknown as any;
    obj = {
      ...obj,
      fullname: obj.nombre,
      password: obj.cedula.replace(/^(V-|E-)/g, "")
    }
    const { ok, data } = await client.POST("/api/students/add", obj);
    if (!ok) {
      return fail(400, { message: data.message });
    }
  },
};
