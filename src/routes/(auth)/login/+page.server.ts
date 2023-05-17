import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logStore } from '$lib/resources/store';
import type { Usuario } from '../../../app';

export const actions: Actions = {
    default: async ({request, locals:{client, user}}) =>{
        const { username, password }: { username: string, password: string } = Object.fromEntries(await request.formData()) as {username: string, password: string}
        const payload = {usuario: username, clave: password}
        const { login } = await client.POST("/api/usuario/login", payload)
        if (login) {
            logStore.set({ log: "in" })
            throw redirect(302, "/inicio")
        } else {
            return fail(400, {message: "Usuario o contraseña inválida"})
        }
    }
}