import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
    default: async ({locals:{login}, request}) =>{
        let loggued: Login = {
            logged: true
        };
        const { username, password }: { username?: string, password?: string } = Object.fromEntries(await request.formData())
        
        if (username === "pascadmin" && password === "iutppasc4l23") {
            login = loggued
            throw redirect(302, "/dash")
        } else {    
            return fail(400, {"message": "Usuario o pass incorrecto"})
        }
    }
}