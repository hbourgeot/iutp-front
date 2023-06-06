import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { client }, url }) => {
  const { ok, data: estudiantes } = await client.GET("/api/students");
  if (!ok) {
    return { estudiantes: [], carreras: [] };
  }

  return { estudiantes: estudiantes, query: url.searchParams.get("s") };
};