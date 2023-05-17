import type { PageServerLoad } from "./$types";

export const load = (async ({ locals: { client } }) => {
  const { ok, data: estudiantes } = await client.GET("/api/students");
  if (!ok) {
    return { estudiantes: 0, pagos: 0 };
  }

  const { ok: okPagos, data: pagos } = await client.GET("/api/admin");
  if (!okPagos) {
    return { estudiantes: estudiantes.length, pagos: 0 };
  }

    let pagosDelMes: number = 0;
    pagos.pagos.forEach((pago: any) => {
        if (pago.pre_inscripcion.includes(`${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}`)) {
            pagosDelMes++;
        } else if (pago.inscripcion.includes(`${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}`)) {
            pagosDelMes++;
        } else if (pago.cuota1.includes(`${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}`)) {
            pagosDelMes++;
        } else if (pago.cuota2.includes(`${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}`)) {
            pagosDelMes++;
        } else if (pago.cuota3.includes(`${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}`)) {
            pagosDelMes++;
        } else if (pago.cuota4.includes(`${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}`)) {
            pagosDelMes++;
        } else if (pago.cuota5.includes(`${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1}`)) {
            pagosDelMes++;
        }
    })
  return { estudiantes: estudiantes.length, pagos: pagos.pagos.length, pagosDelMes: pagosDelMes };
}) satisfies PageServerLoad;
