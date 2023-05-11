import type { Estudiante, Pago } from "../../../app";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { client }, params, url }) => {
  const { ok, data } = await client.GET("/api/admin");
  const { ok: okey, data: estudiantes } = await client.GET("/api/students");
  let pdfData: {
    fecha: string;
    cedula: string;
    nombre: string;
    pago: string;
    monto: string;
  }[] = [];
  let fecha: string = "";
  let fechas: string[] = [];
  if (params.reporte === "dia") {
    fecha = url.searchParams.get("d") as unknown as string || `${new Date().getFullYear()}-${
      new Date().getMonth() + 1 > 9
        ? new Date().getMonth() + 1
        : "0" + (new Date().getMonth() + 1)
    }-${
      new Date().getDate() > 9
        ? new Date().getDate()
        : "0" + new Date().getDate()
    }`;
  } else if (params.reporte === "semanal") {
    let prev = new Date(
      new Date().getMonth() == 0
        ? new Date().getFullYear() - 1
        : new Date().getFullYear(),
      new Date().getMonth() + 2 - 1,
      1
    );
    let now = new Date();
    if (new Date().getDate() < 8) {
      for (let i = 1; i < 8; i++) {
        let days = now.getDate() - i;
        if (days <= -1) {
          fechas.push(
            `${prev.getFullYear()}-${
              prev.getMonth() + 1 < 10
                ? "0" + (prev.getMonth() + 1)
                : prev.getMonth() + 1
            }-${
              prev.getDate() + days < 10
                ? "0" + (prev.getDate() + days)
                : prev.getDate() + days
            }`
          );
        } else {
          fechas.push(
            `${now.getFullYear()}-${
              now.getMonth() + 1 < 10
                ? "0" + (now.getMonth() + 1)
                : now.getMonth() + 1
            }-${days < 10 ? "0" + days : days}`
          );
        }
      }
    } else {
      for (let i = 0; i < 7; i++) {
        fechas.push(
          `${new Date().getFullYear()}-${
            new Date().getMonth() + 1 < 10
              ? "0" + (new Date().getMonth() + 1)
              : new Date().getMonth() + 1
          }-${
            new Date().getDate() - i < 10
              ? "0" + (new Date().getDate() - i)
              : new Date().getDate() - i
          }`
        );
      }
    }
    console.log(fechas);
  } else if (params.reporte === "mensual") {
    fecha = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1
    }`;
  }
  console.log(fecha);

  let estudiantesConPagos: any[] = [];
  let estudiantesSinPagos: any[] = [];
  estudiantes.forEach((estudiante: any) => {
    let pago = data.pagos.filter((pago: any) => {
      if (pago.cedula_estudiante === estudiante.cedula) return pago;
    });

    if (!pago[0]) {
      estudiantesSinPagos.push(estudiante);
    } else {
      estudiantesConPagos.push(estudiante);
    }
  });
  if (params.reporte === "semanal") {
    for (const fecha of fechas) {
      for (let i = 0; i < data.pagos.length; i++) {
        if (data.pagos[i].pre_inscripcion.includes(fecha)) {
          let estudiante: any = estudiantesConPagos.find(
            (estudiante: Estudiante) =>
              estudiante.cedula === data.pagos[i].cedula_estudiante
          );
          let montos = data.montos.find(
            (monto: Pago) => monto.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].pre_inscripcion,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Pre Inscripcion",
            monto: montos.pre_inscripcion,
          });
        }
        if (data.pagos[i].inscripcion.includes(fecha)) {
          let estudiante: any = estudiantesConPagos.find(
            (estudiante: Estudiante) =>
              estudiante.cedula === data.pagos[i].cedula_estudiante
          );
          let montos = data.montos.find(
            (monto: Pago) => monto.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].inscripcion,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Inscripcion",
            monto: montos.inscripcion,
          });
        }
        if (data.pagos[i].cuota1.includes(fecha)) {
          let estudiante: any = estudiantesConPagos.find(
            (estudiante: Estudiante) =>
              estudiante.cedula === data.pagos[i].cedula_estudiante
          );
          let montos = data.montos.find(
            (monto: Pago) => monto.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].cuota1,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Cuota 1",
            monto: montos.cuota1,
          });
        }
        if (data.pagos[i].cuota2.includes(fecha)) {
          let estudiante: any = estudiantesConPagos.find(
            (estudiante: Estudiante) =>
              estudiante.cedula === data.pagos[i].cedula_estudiante
          );
          let montos = data.montos.find(
            (monto: Pago) => monto.id_pago === data.pagos[i].id
          );
  
          pdfData.push({
            fecha: data.pagos[i].cuota2,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Cuota 2",
            monto: montos.cuota2,
          });
        }
        if (data.pagos[i].cuota3.includes(fecha)) {
          let estudiante: any = estudiantesConPagos.find(
            (estudiante: Estudiante) =>
              estudiante.cedula === data.pagos[i].cedula_estudiante
          );
          let montos = data.montos.find(
            (monto: Pago) => monto.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].cuota3,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Cuota 3",
            monto: montos.cuota3,
          });
        }
        if (data.pagos[i].cuota4.includes(fecha)) {
          let estudiante: any = estudiantesConPagos.find(
            (estudiante: Estudiante) =>
              estudiante.cedula === data.pagos[i].cedula_estudiante
          );
          let montos = data.montos.find(
            (monto: Pago) => monto.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].cuota4,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Cuota 4",
            monto: montos.cuota4,
          });
        }
        if (data.pagos[i].cuota5.includes(fecha)) {
          let estudiante: any = estudiantesConPagos.find(
            (estudiante: Estudiante) =>
              estudiante.cedula === data.pagos[i].cedula_estudiante
          );
          let montos = data.montos.find(
            (monto: Pago) => monto.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].cuota5,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Cuota 5",
            monto: montos.cuota5,
          });
        }
      }
    }
  } else {
    for (let i = 0; i < data.pagos.length; i++) {
      if (data.pagos[i].pre_inscripcion.includes(fecha)) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].pre_inscripcion,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Pre Inscripcion",
          monto: montos.pre_inscripcion,
        });
      }
      if (data.pagos[i].inscripcion.includes(fecha)) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].inscripcion,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Inscripcion",
          monto: montos.inscripcion,
        });
      }
      if (data.pagos[i].cuota1.includes(fecha)) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota1,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 1",
          monto: montos.cuota1,
        });
      }
      if (data.pagos[i].cuota2.includes(fecha)) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota2,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 2",
          monto: montos.cuota2,
        });
      }
      if (data.pagos[i].cuota3.includes(fecha)) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota3,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 3",
          monto: montos.cuota3,
        });
      }
      if (data.pagos[i].cuota4.includes(fecha)) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota4,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 4",
          monto: montos.cuota4,
        });
      }
      if (data.pagos[i].cuota5.includes(fecha)) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota5,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 5",
          monto: montos.cuota5,
        });
      }
    }
  }
  return { pdfData, param: params.reporte };
}) satisfies PageServerLoad;
