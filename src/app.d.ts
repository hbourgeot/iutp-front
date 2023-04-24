// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			login: Login;
		}
		// interface PageData {}
		// interface Platform {}
	}

	interface Login{
		logged: boolean;
	}
}

export {};
