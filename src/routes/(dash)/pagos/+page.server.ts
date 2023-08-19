import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { Estudiante, Pago } from "../../../app";

export const load: PageServerLoad = async ({ locals: { client }, url }) => {
  const { ok, data } = await client.GET("/api/pagos");
  const { ok: okey, data: estudiantes } = await client.GET("/api/students");
  
  const response = await fetch(
    "https://api.exchangedyn.com/markets/quotes/usdves/bcv"
  );

  let cedulas: string[] = Array.from(
    new Set(data.map((dat: any) => dat.estudiante))
  );
  const currency = await response.json();
  const bcv = currency.sources.BCV.quote;
  let estudiantesOptions: Estudiante[] = []
  for (const cedula of cedulas) {
    estudiantesOptions.push(estudiantes.find((estudiante: Estudiante) => estudiante.cedula == cedula))
  }

  if (!ok || !okey) {
    return {};
  }

  return { estudiantes: estudiantesOptions };
};