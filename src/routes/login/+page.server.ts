import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logStore } from '$lib/resources/store';
import { get } from 'svelte/store';

export const load: PageServerLoad = async () => {
    const status = get(logStore)
    if (status.log === "in") throw redirect(302, "/dash")
}

export const actions: Actions = {
    default: async ({request}) =>{
        const { username, password }: { username?: string, password?: string } = Object.fromEntries(await request.formData())
        
        logStore.set({log: "in"})
        throw redirect(302, "/dash")
        // if (username === "pascadmin" && password === "iutppasc4l23") {
        // } else {    
        //     return fail(400, {"message": "Usuario o pass incorrecto"})
        // }
    }
}