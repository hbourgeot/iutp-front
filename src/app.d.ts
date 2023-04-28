// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import { client } from "\/server/fetch";
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			client: client
		}
		// interface PageData {}
		// interface Platform {}
	}

	
}
interface Estudiante{
	cedula: string;
	correo: string;
	nombre: string;
	semestre: number;
	telefono: string;
	estado: string
}

interface Pagos{
	id: number,
	preInscripcion: string;
	inscripcion: string;
	cuota1: string;
	cuota2: string;
	cuota3: string;
	cuota4: string;
	cuota5: string;
	cedula_estudiante: string;
}

interface PagosEstudiante {
	estudiante: Estudiante;
	pago: Pagos;
}

export {Estudiante, Pagos, PagosEstudiante};
