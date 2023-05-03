import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import type { Estudiante, Pago } from "../../../app";

export const load: PageServerLoad = async ({ locals: { client }, url }) => {
  const { ok, data } = await client.GET("/api/admin");
  const { ok: okey, data: estudiantes } = await client.GET("/api/students");
  let estudiantesSinPagos: Estudiante[] = [];
  let estudiantesConPagos: Estudiante[] = [];
  let hoy = `${new Date().getFullYear()}-${
    new Date().getMonth() + 1 > 9
      ? new Date().getMonth() + 1
      : "0" + (new Date().getMonth() + 1)
  }-${
    new Date().getDate() > 9 ? new Date().getDate() : "0" + new Date().getDate()
  }`;
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
  let pdfData: {
    cedula: string;
    nombre: string;
    pago: string;
    monto: number;
  }[] = [];
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
      });

      if (data.pagos[i].pre_inscripcion === hoy) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Pre Inscripcion",
          monto: montos.pre_inscripcion,
        });
      }
      if (data.pagos[i].inscripcion === hoy) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Inscripcion",
          monto: montos.inscripcion,
        });
      }
      if (data.pagos[i].cuota1 === hoy) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 1",
          monto: montos.cuota1,
        });
      }
      if (data.pagos[i].cuota2 === hoy) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );

        pdfData.push({
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 2",
          monto: montos.cuota2,
        });
      }
      if (data.pagos[i].cuota3 === hoy) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 3",
          monto: montos.cuota3,
        });
      }
      if (data.pagos[i].cuota4 === hoy) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 4",
          monto: montos.cuota4,
        });
      }
      if (data.pagos[i].cuota5 === hoy) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 5",
          monto: montos.cuota5,
        });
      }
    }
  } catch (e) {
    console.log(e);
  }

  return {
    pagos: allData,
    pdf: pdfData,
    estudiantes: estudiantesSinPagos.map((estudiante: Estudiante) => ({
      cedula: estudiante.cedula,
      nombre: estudiante.nombre,
    })),
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
      montoPreInscripcion: obj.monto_pre_inscripcion,
      montoInscripcion: obj.monto_inscripcion ?? 0,
      montoCuota1: obj.monto_cuota1 ?? 0,
      montoCuota2: obj.monto_cuota2 ?? 0,
      montoCuota3: obj.monto_cuota3 ?? 0,
      montoCuota4: obj.monto_cuota4 ?? 0,
      montoCuota5: obj.monto_cuota5 ?? 0,
    };

    const { ok, data } = await client.POST("/api/admin/add", payload);
    if (!ok) {
      return fail(400, { message: "Error al insertar" });
    }
  },
};
