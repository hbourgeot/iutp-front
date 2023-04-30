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

interface Pago{
	id: number,
	pre_inscripcion: string;
	inscripcion: string;
	cuota1: string;
	cuota2: string;
	cuota3: string;
	cuota4: string;
	cuota5: string;
	cedula_estudiante: string;
}

interface Monto {
	id: number,
	pre_inscripcion: number;
	inscripcion: number;
	cuota1: number;
	cuota2: number;
	cuota3: number;
	cuota4: number;
	cuota5: number;
	id_pago: number
}

interface PagosEstudiante {
	estudiante: Estudiante;
	pago: Pago;
}

interface MontoPagos {
	monto: Monto;
	pago: Pago;
}

export {Estudiante, Pago, PagosEstudiante, Monto, MontoPagos};
