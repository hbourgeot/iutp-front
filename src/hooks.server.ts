import { client } from "$lib/server/fetch";
import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import type { Usuario } from "./app";
import { getAccessToken, getUser } from "$lib/server/auth";
import { decode } from "jsonwebtoken";

const authHandler: Handle = async ({ event, resolve }) => {
  if (!event.url.pathname.includes("/logout")) {
    const accessToken = getAccessToken(event);
    const verifyToken = accessToken?.split(" ")[1] ?? "";
    if (accessToken) {
      try {
        const decodedToken = decode(verifyToken) as {
          exp: number;
          rol: string;
        };
        const currentTime = Math.floor(Date.now() / 1000);
        if (currentTime <= decodedToken.exp) {
          event.locals.user = (await getUser(
            accessToken
          )) as unknown as Usuario;
        } else {
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/login",
            },
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
  return await resolve(event);
};

const clientHandler: Handle = async ({ event, resolve }) => {
  event.locals.client = {
    GET: async (endpoint: string, body?: object, headers?: any) =>
      await client(endpoint, "GET", body, headers),
    POST: async (endpoint: string, body?: object, headers?: any) =>
      await client(endpoint, "POST", body, headers),
    PUT: async (endpoint: string, body?: object, headers?: any) =>
      await client(endpoint, "PUT", body, headers),
    PATCH: async (endpoint: string, body?: object, headers?: any) =>
      await client(endpoint, "PATCH", body, headers),
    DELETE: async (endpoint: string, body?: object, headers?: any) =>
      await client(endpoint, "DELETE", body, headers),
  };

  return await resolve(event);
};

export const handle = sequence(authHandler,clientHandler);
