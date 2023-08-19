import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ locals: { user } }) => {
  if (user) throw redirect(302, "/estudiantes");
  throw redirect(302, "/login");
};
