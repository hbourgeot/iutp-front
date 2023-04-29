import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logStore } from '$lib/resources/store';
import { get } from 'svelte/store';

export const load = (async ({locals:{client}}) => {
    const status = get(logStore)
    if (status.log !== "in"){
        throw redirect(302, "/login")
    }

    const date = new Date()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const {total: estudiantes} = await client.GET(`api/students/count`)
    const {total: pagosDelDia} = await client.GET(`api/admin/count/month/${month > 9 ? month : '0'+month}`)
    const {total: pagosDelMes} = await client.GET(`api/admin/count/day/${day > 9 ? day : '0'+day}`)
    return {estudiantes, pagosDelDia, pagosDelMes};
}) satisfies PageServerLoad;