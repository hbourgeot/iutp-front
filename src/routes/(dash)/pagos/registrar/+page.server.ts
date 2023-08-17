import { fail, redirect } from "@sveltejs/kit";
import type { Estudiante } from "../../../../app";
import type { Actions, PageServerLoad } from "./$types";

export const load = (async ({ locals: { client } }) => {
  const { ok, data } = await client.GET("/api/pagos");
  const { ok: okey, data: estudiantes } = await client.GET("/api/students");
  if (!ok || !okey) {
    return { estudiantes: [] };
  }
  let estudiantesCedula: { cedula: string; nombre: string }[] = estudiantes.map((estudiante: Estudiante) => ({cedula: estudiante.cedula, nombre: estudiante.nombre}));

  const response = await fetch(
    "https://api.exchangedyn.com/markets/quotes/usdves/bcv"
  );
  const currency = await response.json();
  const bcv = currency.sources.BCV.quote;

  return { estudiantes: estudiantesCedula, tasa: parseFloat(bcv) };
}) satisfies PageServerLoad;

export const actions: Actions = {
  default: async ({ locals: { client }, request }) => {
    const form = await request.formData();
    let obj = Object.fromEntries(form) as unknown as any;
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
      return fail(400, { message: data.message });
    }

    let billetesPreInscripcion = form.getAll("billetesPreInscripcion") as any[];
    let billetesInscripcion = form.getAll("billetesInscripcion") as any[];
    let billetesCuota1 = form.getAll("billetesCuota1") as unknown as any[];
    let billetesCuota2 = form.getAll("billetesCuota2") as unknown as any[];
    let billetesCuota3 = form.getAll("billetesCuota3") as unknown as any[];
    let billetesCuota4 = form.getAll("billetesCuota4") as unknown as any[];
    let billetesCuota5 = form.getAll("billetesCuota5") as unknown as any[];

    billetesPreInscripcion = billetesPreInscripcion.map(billete => (JSON.parse(billete))).map(billete => ({codigo: billete.codigo, cantidad: billete.cantidad, factura: ''}))
    billetesInscripcion = billetesInscripcion.map(billete => (JSON.parse(billete))).map(billete => ({codigo: billete.codigo, cantidad: billete.cantidad, factura: ''}))
    billetesCuota1 = billetesCuota1.map(billete => (JSON.parse(billete))).map(billete => ({codigo: billete.codigo, cantidad: billete.cantidad, factura: ''}))
    billetesCuota2 = billetesCuota2.map(billete => (JSON.parse(billete))).map(billete => ({codigo: billete.codigo, cantidad: billete.cantidad, factura: ''}))
    billetesCuota3 = billetesCuota3.map(billete => (JSON.parse(billete))).map(billete => ({codigo: billete.codigo, cantidad: billete.cantidad, factura: ''}))
    billetesCuota4 = billetesCuota4.map(billete => (JSON.parse(billete))).map(billete => ({codigo: billete.codigo, cantidad: billete.cantidad, factura: ''}))
    billetesCuota5 = billetesCuota5.map(billete => (JSON.parse(billete))).map(billete => ({codigo: billete.codigo, cantidad: billete.cantidad, factura: ''}))

    let billetes: any[] = [];

    if (obj.metodo_pre_inscripcion == "dolares") {
      billetes.push(billetesPreInscripcion.length > 1 ? billetesPreInscripcion.map(billete => ({...billete, factura: data})) : {codigo: billetesPreInscripcion[0].codigo, cantidad: billetesPreInscripcion[0].cantidad, factura: data} );
    }
    if (obj.metodo_inscripcion == "dolares") {
      billetes.push(billetesInscripcion.length > 1 ? billetesInscripcion.map(billete => ({...billete, factura: data})) : {codigo: billetesInscripcion[0].codigo, cantidad: billetesInscripcion[0].cantidad, factura: data} );
    }
    if (obj.metodo_cuota1 == "dolares") {
      billetes.push(billetesCuota1.length > 1 ? billetesCuota1.map(billete => ({...billete, factura: data})) : {codigo: billetesCuota1[0].codigo, cantidad: billetesCuota1[0].cantidad, factura: data} );
    }
    if (obj.metodo_cuota2 == "dolares") {
      billetes.push(billetesCuota2.length > 1 ? billetesCuota2.map(billete => ({...billete, factura: data})) : {codigo: billetesCuota2[0].codigo, cantidad: billetesCuota2[0].cantidad, factura: data} );
    }
    if (obj.metodo_cuota3 == "dolares") {
      billetes.push(billetesCuota3.length > 1 ? billetesCuota3.map(billete => ({...billete, factura: data})) : {codigo: billetesCuota3[0].codigo, cantidad: billetesCuota3[0].cantidad, factura: data} );
    }
    if (obj.metodo_cuota4 == "dolares") {
      billetes.push(billetesCuota4.length > 1 ? billetesCuota4.map(billete => ({...billete, factura: data})) : {codigo: billetesCuota4[0].codigo, cantidad: billetesCuota4[0].cantidad, factura: data} );
    }
    if (obj.metodo_cuota5 == "dolares") {
      billetes.push(billetesCuota5.length > 1 ? billetesCuota5.map(billete => ({...billete, factura: data})) : {codigo: billetesCuota5[0].codigo, cantidad: billetesCuota5[0].cantidad, factura: data} );
    }

    for (const billete of billetes) {
      const { ok, data } = await client.POST("/api/billetes/add", billete);
      if (!ok) {
        return fail(400, { message: data.message });
      }
    }
  },
};
