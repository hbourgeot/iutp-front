import { logStore } from '$lib/resources/store';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    logStore.set({log: "out"})
    throw redirect(303, "/login")
}) satisfies PageServerLoad;