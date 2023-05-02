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
        const { login } = await client.POST("/api/usuario/login", payload)
        if (login) {
            logStore.set({ log: "in" })
            throw redirect(302, "/estudiantes")
        } else {
            return fail(400, {message: "Usuario o contraseña inválida"})
        }
    }
}