import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { Estudiante, Pago } from "../../../app";

export const load: PageServerLoad = async ({ locals: { client }, url }) => {
  const { ok, data } = await client.GET("/api/admin");
  const { ok: okey, data: estudiantes } = await client.GET("/api/students");
  let estudiantesConPagos: Estudiante[] = [];
  const response = await fetch(
    "https://api.exchangedyn.com/markets/quotes/usdves/bcv"
  );
  const currency = await response.json();
  const bcv = currency.sources.BCV.quote;
  estudiantes.map((estudiante: any) => {
    let pago = data.pagos.filter((pago: any) => {
      if (pago.cedula_estudiante === estudiante.cedula) return pago;
    });

    if (pago[0]) {
      estudiantesConPagos.push(estudiante);
    }
  });

  if (!ok) {
    if (!okey) {
      return { pagos: [] };
    }

    return {
      pagos: []
    };
  }

  return {
    estudiantes: estudiantesConPagos, tasa: bcv
  };
};