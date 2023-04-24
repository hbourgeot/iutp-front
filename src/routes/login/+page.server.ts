import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logStore } from '$lib/resources/store';

export const actions: Actions = {
    default: async ({request}) =>{
        const { username, password }: { username?: string, password?: string } = Object.fromEntries(await request.formData())
        
        if (username === "pascadmin" && password === "iutppasc4l23") {
            logStore.set({log: "in"})
            throw redirect(302, "/dash")
        } else {    
            return fail(400, {"message": "Usuario o pass incorrecto"})
        }
    }
}