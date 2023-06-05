import { moneyBsConverter, moneyUsdConverter } from "$lib/resources/moneyConverter";
import type { Estudiante, Pago } from "../../../../app";
import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { client }, params, url }) => {
  const { ok, data } = await client.GET("/api/admin");
  const { ok: okey, data: estudiantes } = await client.GET("/api/students");
   const response = await fetch(
     "https://api.exchangedyn.com/markets/quotes/usdves/bcv"
   );
   const currency = await response.json();
   const bcv = currency.sources.BCV.quote;
  let pdfData: {
    fecha: string;
    cedula: string;
    nombre: string;
    pago: string;
    monto: string;
    montoNum: number;
    metodo: string;
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
  } else if (params.reporte === "mensual") {
    fecha = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1 < 10
        ? "0" + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1
    }`;
  }

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

  let filtro = url.searchParams.get("f");
  if (params.reporte === "semanal") {
    if (filtro) {
      for (const fecha of fechas) {
        for (let i = 0; i < data.pagos.length; i++) {

          if (data.pagos[i].pre_inscripcion.includes(fecha) && data.metodos[i].pre_inscripcion === filtro) {
            let estudiante: any = estudiantesConPagos.find(
              (estudiante: Estudiante) =>
                estudiante.cedula === data.pagos[i].cedula_estudiante
            );
            let montos = data.montos.find(
              (monto: Pago) => monto.id_pago === data.pagos[i].id
            );
            let metodos = data.metodos.find(
              (metodo: Pago) => metodo.id_pago === data.pagos[i].id
            );
            pdfData.push({
              fecha: data.pagos[i].pre_inscripcion,
              cedula: estudiante.cedula,
              nombre: estudiante.nombre,
              pago: "Pre Inscripcion",
              monto:
                metodos.pre_inscripcion === "dolares"
                  ? moneyUsdConverter(montos.pre_inscripcion)
                  : moneyBsConverter(montos.pre_inscripcion),
              montoNum:
                metodos.pre_inscripcion === "dolares" && filtro != "dolares"
                  ? parseInt(montos.pre_inscripcion) * bcv
                  : parseInt(montos.pre_inscripcion),
              metodo: metodos.pre_inscripcion,
            });
          }
          if (data.pagos[i].inscripcion.includes(fecha) && data.metodos[i].inscripcion === filtro) {
            let estudiante: any = estudiantesConPagos.find(
              (estudiante: Estudiante) =>
                estudiante.cedula === data.pagos[i].cedula_estudiante
            );
            let montos = data.montos.find(
              (monto: Pago) => monto.id_pago === data.pagos[i].id
            );
            let metodos = data.metodos.find(
              (metodo: Pago) => metodo.id_pago === data.pagos[i].id
            );
            pdfData.push({
              fecha: data.pagos[i].inscripcion,
              cedula: estudiante.cedula,
              nombre: estudiante.nombre,
              pago: "Inscripcion",
              monto:
                metodos.inscripcion === "dolares"
                  ? moneyUsdConverter(montos.inscripcion)
                  : moneyBsConverter(montos.inscripcion),
              montoNum:
                metodos.inscripcion === "dolares" && filtro != "dolares"
                  ? parseInt(montos.inscripcion) * bcv
                  : parseInt(montos.inscripcion),
              metodo: metodos.inscripcion,
            });
          }
          if (data.pagos[i].cuota1.includes(fecha) && data.metodos[i].cuota1 === filtro) {
            let estudiante: any = estudiantesConPagos.find(
              (estudiante: Estudiante) =>
                estudiante.cedula === data.pagos[i].cedula_estudiante
            );
            let montos = data.montos.find(
              (monto: Pago) => monto.id_pago === data.pagos[i].id
            );
            let metodos = data.metodos.find(
              (metodo: Pago) => metodo.id_pago === data.pagos[i].id
            );
            pdfData.push({
              fecha: data.pagos[i].cuota1,
              cedula: estudiante.cedula,
              nombre: estudiante.nombre,
              pago: "Cuota 1",
              monto:
                metodos.cuota1 === "dolares"
                  ? moneyUsdConverter(montos.cuota1)
                  : moneyBsConverter(montos.cuota1),
              montoNum:
                metodos.cuota1 === "dolares" && filtro != "dolares"
                  ? parseInt(montos.cuota1) * bcv
                  : parseInt(montos.cuota1),
              metodo: metodos.cuota1,
            });
          }
          if (data.pagos[i].cuota2.includes(fecha) && data.metodos[i].cuota2 === filtro) {
            let estudiante: any = estudiantesConPagos.find(
              (estudiante: Estudiante) =>
                estudiante.cedula === data.pagos[i].cedula_estudiante
            );
            let montos = data.montos.find(
              (monto: Pago) => monto.id_pago === data.pagos[i].id
            );
            let metodos = data.metodos.find(
              (metodo: Pago) => metodo.id_pago === data.pagos[i].id
            );

            pdfData.push({
              fecha: data.pagos[i].cuota2,
              cedula: estudiante.cedula,
              nombre: estudiante.nombre,
              pago: "Cuota 2",
              monto:
                metodos.cuota2 === "dolares"
                  ? moneyUsdConverter(montos.cuota2)
                  : moneyBsConverter(montos.cuota2),
              montoNum:
                metodos.cuota2 === "dolares" && filtro != "dolares"
                  ? parseInt(montos.cuota2) * bcv
                  : parseInt(montos.cuota2),
              metodo: metodos.cuota2,
            });
          }
          if (data.pagos[i].cuota3.includes(fecha) && data.metodos[i].cuota3 === filtro) {
            let estudiante: any = estudiantesConPagos.find(
              (estudiante: Estudiante) =>
                estudiante.cedula === data.pagos[i].cedula_estudiante
            );
            let montos = data.montos.find(
              (monto: Pago) => monto.id_pago === data.pagos[i].id
            );
            let metodos = data.metodos.find(
              (metodo: Pago) => metodo.id_pago === data.pagos[i].id
            );
            pdfData.push({
              fecha: data.pagos[i].cuota3,
              cedula: estudiante.cedula,
              nombre: estudiante.nombre,
              pago: "Cuota 3",
              monto:
                metodos.cuota3 === "dolares"
                  ? moneyUsdConverter(montos.cuota3)
                  : moneyBsConverter(montos.cuota3),
              montoNum:
                metodos.cuota3 === "dolares" && filtro != "dolares"
                  ? parseInt(montos.cuota3) * bcv
                  : parseInt(montos.cuota3),
              metodo: metodos.cuota3,
            });
          }
          if (data.pagos[i].cuota4.includes(fecha) && data.metodos[i].cuota4 === filtro) {
            let estudiante: any = estudiantesConPagos.find(
              (estudiante: Estudiante) =>
                estudiante.cedula === data.pagos[i].cedula_estudiante
            );
            let montos = data.montos.find(
              (monto: Pago) => monto.id_pago === data.pagos[i].id
            );
            let metodos = data.metodos.find(
              (metodo: Pago) => metodo.id_pago === data.pagos[i].id
            );
            pdfData.push({
              fecha: data.pagos[i].cuota4,
              cedula: estudiante.cedula,
              nombre: estudiante.nombre,
              pago: "Cuota 4",
              monto:
                metodos.cuota4 === "dolares"
                  ? moneyUsdConverter(montos.cuota4)
                  : moneyBsConverter(montos.cuota4),
              montoNum:
                metodos.cuota4 === "dolares" && filtro != "dolares"
                  ? parseInt(montos.cuota4) * bcv
                  : parseInt(montos.cuota4),
              metodo: metodos.cuota4,
            });
          }
          if (data.pagos[i].cuota5.includes(fecha) && data.metodos[i].cuota5 === filtro) {
            let estudiante: any = estudiantesConPagos.find(
              (estudiante: Estudiante) =>
                estudiante.cedula === data.pagos[i].cedula_estudiante
            );
            let montos = data.montos.find(
              (monto: Pago) => monto.id_pago === data.pagos[i].id
            );
            let metodos = data.metodos.find(
              (metodo: Pago) => metodo.id_pago === data.pagos[i].id
            );
            pdfData.push({
              fecha: data.pagos[i].cuota5,
              cedula: estudiante.cedula,
              nombre: estudiante.nombre,
              pago: "Cuota 5",
              monto:
                metodos.cuota5 === "dolares"
                  ? moneyUsdConverter(montos.cuota5)
                  : moneyBsConverter(montos.cuota5),
              montoNum:
                metodos.cuota5 === "dolares" && filtro != "dolares"
                  ? parseInt(montos.cuota5) * bcv
                  : parseInt(montos.cuota5),
              metodo: metodos.cuota5,
            });
          }
        }
      }
    } else {
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
          let metodos = data.metodos.find(
            (metodo: Pago) => metodo.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].pre_inscripcion,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Pre Inscripcion",
            monto: metodos.pre_inscripcion === "dolares" ? moneyUsdConverter(montos.pre_inscripcion) : moneyBsConverter(montos.pre_inscripcion),
            montoNum: metodos.pre_inscripcion === "dolares" && filtro != "dolares" ? parseInt(montos.pre_inscripcion) * bcv : parseInt(montos.pre_inscripcion),
            metodo: metodos.pre_inscripcion,
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
          let metodos = data.metodos.find(
            (metodo: Pago) => metodo.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].inscripcion,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Inscripcion",
            monto: metodos.inscripcion === "dolares" ? moneyUsdConverter(montos.inscripcion) : moneyBsConverter(montos.inscripcion),
            montoNum: metodos.inscripcion === "dolares" && filtro != "dolares" ? parseInt(montos.inscripcion) * bcv : parseInt(montos.inscripcion),
            metodo: metodos.inscripcion,
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
          let metodos = data.metodos.find(
            (metodo: Pago) => metodo.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].cuota1,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Cuota 1",
            monto: metodos.cuota1 === "dolares" ? moneyUsdConverter(montos.cuota1) : moneyBsConverter(montos.cuota1),
            montoNum: metodos.cuota1 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota1) * bcv : parseInt(montos.cuota1),
            metodo: metodos.cuota1,
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
          let metodos = data.metodos.find(
            (metodo: Pago) => metodo.id_pago === data.pagos[i].id
          );
  
          pdfData.push({
            fecha: data.pagos[i].cuota2,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Cuota 2",
            monto: metodos.cuota2 === "dolares" ? moneyUsdConverter(montos.cuota2) : moneyBsConverter(montos.cuota2),
            montoNum: metodos.cuota2 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota2) * bcv : parseInt(montos.cuota2),
            metodo: metodos.cuota2,
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
          let metodos = data.metodos.find(
            (metodo: Pago) => metodo.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].cuota3,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Cuota 3",
            monto: metodos.cuota3 === "dolares" ? moneyUsdConverter(montos.cuota3) : moneyBsConverter(montos.cuota3),
            montoNum: metodos.cuota3 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota3) * bcv : parseInt(montos.cuota3),
            metodo: metodos.cuota3,
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
          let metodos = data.metodos.find(
            (metodo: Pago) => metodo.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].cuota4,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Cuota 4",
            monto: metodos.cuota4 === "dolares" ? moneyUsdConverter(montos.cuota4) : moneyBsConverter(montos.cuota4),
            montoNum: metodos.cuota4 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota4) * bcv : parseInt(montos.cuota4),
            metodo: metodos.cuota4,
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
          let metodos = data.metodos.find(
            (metodo: Pago) => metodo.id_pago === data.pagos[i].id
          );
          pdfData.push({
            fecha: data.pagos[i].cuota5,
            cedula: estudiante.cedula,
            nombre: estudiante.nombre,
            pago: "Cuota 5",
            monto: metodos.cuota5 === "dolares" ? moneyUsdConverter(montos.cuota5) : moneyBsConverter(montos.cuota5),
            montoNum: metodos.cuota5 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota5) * bcv : parseInt(montos.cuota5),
            metodo: metodos.cuota5,
          });
        }
      }
      }
    }
  } else {
    if (filtro) {
            for (let i = 0; i < data.pagos.length; i++) {
      if (data.pagos[i].pre_inscripcion.includes(fecha) && data.metodos[i].pre_inscripcion === filtro) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].pre_inscripcion,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Pre Inscripcion",
          monto: metodos.pre_inscripcion === "dolares" ? moneyUsdConverter(montos.pre_inscripcion) : moneyBsConverter(montos.pre_inscripcion),
          montoNum: metodos.pre_inscripcion === "dolares" && filtro != "dolares" ? parseInt(montos.pre_inscripcion) * bcv : parseInt(montos.pre_inscripcion),
          metodo: metodos.pre_inscripcion,
        });
      }
      if (data.pagos[i].inscripcion.includes(fecha) && data.metodos[i].inscripcion === filtro) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].inscripcion,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Inscripcion",
          monto: metodos.inscripcion === "dolares" ? moneyUsdConverter(montos.inscripcion) : moneyBsConverter(montos.inscripcion),
          montoNum: metodos.inscripcion === "dolares" && filtro != "dolares" ? parseInt(montos.inscripcion) * bcv : parseInt(montos.inscripcion),
          metodo: metodos.inscripcion,
        });
      }
      if (data.pagos[i].cuota1.includes(fecha) && data.metodos[i].cuota1 === filtro) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota1,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 1",
          monto: metodos.cuota1 === "dolares" ? moneyUsdConverter(montos.cuota1) : moneyBsConverter(montos.cuota1),
          montoNum: metodos.cuota1 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota1) * bcv : parseInt(montos.cuota1),
          metodo: metodos.cuota1,
        });
      }
      if (data.pagos[i].cuota2.includes(fecha) && data.metodos[i].cuota2 === filtro) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota2,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 2",
          monto: metodos.cuota2 === "dolares" ? moneyUsdConverter(montos.cuota2) : moneyBsConverter(montos.cuota2),
          montoNum: metodos.cuota2 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota2) * bcv : parseInt(montos.cuota2),
          metodo: metodos.cuota2,
        });
      }
      if (data.pagos[i].cuota3.includes(fecha) && data.metodos[i].cuota3 === filtro) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota3,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 3",
          monto: metodos.cuota3 === "dolares" ? moneyUsdConverter(montos.cuota3) : moneyBsConverter(montos.cuota3),
          montoNum: metodos.cuota3 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota3) * bcv : parseInt(montos.cuota3),
          metodo: metodos.cuota3,
        });
      }
      if (data.pagos[i].cuota4.includes(fecha) && data.metodos[i].cuota4 === filtro) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota4,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 4",
          monto: metodos.cuota4 === "dolares" ? moneyUsdConverter(montos.cuota4) : moneyBsConverter(montos.cuota4),
          montoNum: metodos.cuota4 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota4) * bcv : parseInt(montos.cuota4),
          metodo: metodos.cuota4,
        });
      }
      if (data.pagos[i].cuota5.includes(fecha) && data.metodos[i].cuota5 === filtro) {
        let estudiante: any = estudiantesConPagos.find(
          (estudiante: Estudiante) =>
            estudiante.cedula === data.pagos[i].cedula_estudiante
        );
        let montos = data.montos.find(
          (monto: Pago) => monto.id_pago === data.pagos[i].id
        );
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota5,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 5",
          monto: metodos.cuota5 === "dolares" ? moneyUsdConverter(montos.cuota5) : moneyBsConverter(montos.cuota5),
          montoNum: metodos.cuota5 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota5) * bcv : parseInt(montos.cuota5),
          metodo: metodos.cuota5,
        });
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
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].pre_inscripcion,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Pre Inscripcion",
          monto: metodos.pre_inscripcion === "dolares" ? moneyUsdConverter(montos.pre_inscripcion) : moneyBsConverter(montos.pre_inscripcion),
          montoNum: metodos.pre_inscripcion === "dolares" && filtro != "dolares" ? parseInt(montos.pre_inscripcion) * bcv : parseInt(montos.pre_inscripcion),
          metodo: metodos.pre_inscripcion,
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
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].inscripcion,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Inscripcion",
          monto: metodos.inscripcion === "dolares" ? moneyUsdConverter(montos.inscripcion) : moneyBsConverter(montos.inscripcion),
          montoNum: metodos.inscripcion === "dolares" && filtro != "dolares" ? parseInt(montos.inscripcion) * bcv : parseInt(montos.inscripcion),
          metodo: metodos.inscripcion,
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
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota1,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 1",
          monto: metodos.cuota1 === "dolares" ? moneyUsdConverter(montos.cuota1) : moneyBsConverter(montos.cuota1),
          montoNum: metodos.cuota1 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota1) * bcv : parseInt(montos.cuota1),
          metodo: metodos.cuota1,
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
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota2,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 2",
          monto: metodos.cuota2 === "dolares" ? moneyUsdConverter(montos.cuota2) : moneyBsConverter(montos.cuota2),
          montoNum: metodos.cuota2 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota2) * bcv : parseInt(montos.cuota2),
          metodo: metodos.cuota2,
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
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota3,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 3",
          monto: metodos.cuota3 === "dolares" ? moneyUsdConverter(montos.cuota3) : moneyBsConverter(montos.cuota3),
          montoNum: metodos.cuota3 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota3) * bcv : parseInt(montos.cuota3),
          metodo: metodos.cuota3,
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
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota4,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 4",
          monto: metodos.cuota4 === "dolares" ? moneyUsdConverter(montos.cuota4) : moneyBsConverter(montos.cuota4),
          montoNum: metodos.cuota4 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota4) * bcv : parseInt(montos.cuota4),
          metodo: metodos.cuota4,
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
        let metodos = data.metodos.find(
          (metodo: Pago) => metodo.id_pago === data.pagos[i].id
        );
        pdfData.push({
          fecha: data.pagos[i].cuota5,
          cedula: estudiante.cedula,
          nombre: estudiante.nombre,
          pago: "Cuota 5",
          monto: metodos.cuota5 === "dolares" ? moneyUsdConverter(montos.cuota5) : moneyBsConverter(montos.cuota5),
          montoNum: metodos.cuota5 === "dolares" && filtro != "dolares" ? parseInt(montos.cuota5) * bcv : parseInt(montos.cuota5),
          metodo: metodos.cuota5,
        });
      }
      }
    }
  }
  return { pdfData, param: params.reporte, filtro: filtro ?? "nada", bcv: bcv };
}) satisfies PageServerLoad;
