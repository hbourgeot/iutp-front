import { logStore } from '$lib/resources/store';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { get } from 'svelte/store';

export const load: LayoutServerLoad = async () => {
    const status = get(logStore)
    if (status.log === "in") throw redirect(302, "/dash")
}