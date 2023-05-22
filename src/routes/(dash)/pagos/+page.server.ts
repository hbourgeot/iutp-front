import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { Estudiante, Pago } from "../../../app";

export const load: PageServerLoad = async ({ locals: { client }, url }) => {
  const { ok, data } = await client.GET("/api/admin");
  console.log(data);
  const { ok: okey, data: estudiantes } = await client.GET("/api/students");
  let estudiantesSinPagos: Estudiante[] = [];
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

    if (!pago[0]) {
      estudiantesSinPagos.push(estudiante);
    } else {
      estudiantesConPagos.push(estudiante);
    }
  });

  if (!ok) {
    if (!okey) {
      return { pagos: [], montos: [], estudiantes: [] };
    }

    return {
      pagos: [],
      montos: [],
      estudiantes: estudiantesSinPagos.map((estudiante: Estudiante) => ({
        cedula: estudiante.cedula,
        nombre: estudiante.nombre,
      })),
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
    pagos: allData,
    estudiantes: estudiantesSinPagos.map((estudiante: Estudiante) => ({
      cedula: estudiante.cedula,
      nombre: estudiante.nombre,
    })), tasa: bcv
  };
};

export const actions: Actions = {
  default: async ({ locals: { client }, request }) => {
    let obj = Object.fromEntries(await request.formData()) as unknown as any;
    const payload = {
      cedula_student: obj.cedula,
      pre_inscripcion: obj.pre_inscripcion,
      inscripcion: obj.inscripcion,
      cuota1: obj.cuota1 ?? "",
      cuota2: obj.cuota2 ?? "",
      cuota3: obj.cuota3 ?? "",
      cuota4: obj.cuota4 ?? "",
      cuota5: obj.cuota5 ?? "",
      metodo_pre_inscripcion: obj.metodo_pre_inscripcion,
      metodo_inscripcion: obj.metodo_inscripcion,
      metodo_cuota1: obj.metodo_cuota1 ?? "",
      metodo_cuota2: obj.metodo_cuota2 ?? "",
      metodo_cuota3: obj.metodo_cuota3 ?? "",
      metodo_cuota4: obj.metodo_cuota4 ?? "",
      metodo_cuota5: obj.metodo_cuota5 ?? "",
      monto_pre_inscripcion: obj.monto_pre_inscripcion,
      monto_inscripcion: obj.monto_inscripcion ?? 0,
      monto_cuota1: obj.monto_cuota1 ?? 0,
      monto_cuota2: obj.monto_cuota2 ?? 0,
      monto_cuota3: obj.monto_cuota3 ?? 0,
      monto_cuota4: obj.monto_cuota4 ?? 0,
      monto_cuota5: obj.monto_cuota5 ?? 0,
    };

    const { ok, data } = await client.POST("/api/admin/add", payload);
    if (!ok) {
      return fail(400, { message: "Error al insertar" });
    }
  },
};
