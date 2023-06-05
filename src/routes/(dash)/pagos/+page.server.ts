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
      return { pagos: [], montos: [], estudiantes: [] };
    }

    return {
      pagos: []
    };
  }

  let allData: Pago[] = [];
  try {
    for (let i = 0; i < data.pagos.length; i++) {
      allData.push({
        ...data.pagos[i],
        montoPreInscripcion: data.montos[i].pre_inscripcion,
        montoInscripcion: data.montos[i].inscripcion,
        montoCuota1: data.montos[i].cuota1,
        montoCuota2: data.montos[i].cuota2,
        montoCuota3: data.montos[i].cuota3,
        montoCuota4: data.montos[i].cuota4,
        montoCuota5: data.montos[i].cuota5,
        metodoPreInscripcion: data.metodos[i].pre_inscripcion,
        metodoInscripcion: data.metodos[i].inscripcion,
        metodoCuota1: data.metodos[i].cuota1,
        metodoCuota2: data.metodos[i].cuota2,
        metodoCuota3: data.metodos[i].cuota3,
        metodoCuota4: data.metodos[i].cuota4,
        metodoCuota5: data.metodos[i].cuota5,
      });
    }
  } catch (e) {
    console.log(e);
  }

  return {
    pagos: allData, tasa: bcv
  };
};