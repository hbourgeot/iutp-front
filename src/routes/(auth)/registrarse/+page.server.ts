import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logStore } from '$lib/resources/store';
import { get } from 'svelte/store';

export const load: PageServerLoad = async () => {
    const status = get(logStore)
    if (status.log === "in") throw redirect(302, "/dash")
}

export const actions: Actions = {
    default: async ({request, locals:{client}}) =>{
        const { username, password }: { username?: string, password?: string } = Object.fromEntries(await request.formData())
        const payload = {usuario: username, clave: password}
        const { register } = await client.POST("/api/usuario/register", payload)
        if (register!=="") {
            return fail(400, {message: "Error al registrar, puede que ya exista un usuario con ese nombre."})
        } else {
            throw redirect(302, "/login")
        }
    }
}