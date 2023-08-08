import { baseURL } from "$env/static/private";
import type { RequestEvent } from "@sveltejs/kit";

export const getUser = async (token: string) => {
  try {
    let headers = {
      Accept: "*/*",
      Authorization: token,
    };

    const res: Response = await fetch(`${baseURL}/api/usuario/refresh`, {
      method: "GET",
      headers,
    });
    const { data: user } = await res.json();

    return user;
  } catch (error) {
    console.error(error);
  }
};

export const logIn = async (
  { locals: { client }, cookies }: RequestEvent,
  { username, password }: { username?: string; password?: string }
) => {
  const { ok, status, data } = await client.POST("/api/usuario/login", {
    usuario: username,
    clave: password,
  });
  console.log(ok, status, data);
  if (!ok) {
    return { ok, data };
  }

  /* systemLogger.info(
    ` ${data.estudiante.nombre} ha iniciado sesion`
  ); */

  cookies.set("access_token", data.access_token, {
    httpOnly: true,
    path: "/",
  });
  

  return { ok, status, data };
};

export const getAccessToken = (event: RequestEvent) => {
  const { cookies } = event;

  const access_token = cookies.get("access_token");

  if (access_token) {
    return access_token;
  }
};