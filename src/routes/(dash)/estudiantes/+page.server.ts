import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { systemLogger } from "$lib/server/logger";

export const load: PageServerLoad = async ({ locals: { client, user } }) => {
  const { ok, data: estudiantes } = await client.GET("/api/students");
  const { ok: isOk, data } = await client.GET("/api/carreras");
  if (!ok || !isOk) {
    return { estudiantes: [], carreras: [] };
  }

  systemLogger.info(user.nombre + " ha entrado al módulo de los estudiantes")

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
  default: async ({ locals: { client, user }, request }) => {
    let obj = Object.fromEntries(await request.formData()) as unknown as any;
    obj = {
      ...obj,
      fullname: obj.nombre,
      password: obj.cedula.replace(/^(V-|E-)/g, "")
    }
    const { ok, data } = await client.POST("/api/students/add", obj);
    systemLogger.warn(user.nombre + " ha registrado al estudiante " + obj.nombre.toUpperCase())
    if (!ok) {
      return fail(400, { message: data.message });
    }

    return {message: "Estudiante creado exitosamente!"}
  },
};
