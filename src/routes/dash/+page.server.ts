import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { logStore } from '$lib/resources/store';
import { get } from 'svelte/store';

export const load = (async ({locals}) => {
    const status = get(logStore)
    if (status.log !== "in"){
        throw redirect(302, "/login")
    }
    return {};
}) satisfies PageServerLoad;