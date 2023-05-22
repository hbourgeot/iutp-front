import type { PageServerLoad } from './$types';

export const load = (async ({fetch}) => {
    const response = await fetch("https://api.exchangedyn.com/markets/quotes/usdves/bcv");
    const currency = await response.json();
    const bcv = currency.sources.BCV.quote;
    return {bcv: bcv};
}) satisfies PageServerLoad;