import { systemLogger } from "$lib/server/logger";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { client, user }, url }) => {
  const { ok, data: estudiantes } = await client.GET("/api/students");
  const { ok: isOk, data } = await client.GET("/api/carreras");
  if (!ok || !isOk) {
    return { estudiantes: [], carreras: [] };
  }

  systemLogger.info(user.nombre + " ha entrado a ver la lista de los estudiantes");

  const carreras: {
    id: string;
    nombre: string;
  }[] = data.carreras
    .map((carrera: { id: string; nombre: string }) => ({ ...carrera }))
    .filter(
      (carrera: { id: string; nombre: string }, index: any, self: any) =>
        index ===
        self.findIndex(
          (t: { id: string; nombre: string }) => t.id === carrera.id
        )
    );
  return { estudiantes: estudiantes, carreras, query: url.searchParams.get("s") };
};