import type { PageServerLoad } from './$types';

export const load = (async ({locals:{client}}) => {
    const {ok, data} = await client.GET("/api/admin")
    if (!ok) {
        return {pagos: []}
    }
    return {pagos: data};
}) satisfies PageServerLoad;