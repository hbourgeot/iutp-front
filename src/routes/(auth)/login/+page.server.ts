import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { logIn } from '$lib/server/auth';

export const load: PageServerLoad = async ({locals:{user}}) => {
    if (user) {
      throw redirect(300, "/inicio")
    }

    return {}
};

export const actions: Actions = {
    default: async (event) =>{
        const { username, password }: { username: string, password: string } = Object.fromEntries(await event.request.formData()) as {username: string, password: string}
        const payload = {usuario: username, clave: password}

        const { ok, data } = await logIn(event, { username, password });
        if (!ok) {
          return fail(400, { message: data.message });
    }

    throw redirect(300, "/inicio")
    }
}