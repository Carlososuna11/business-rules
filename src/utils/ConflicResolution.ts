import { Data } from '../types';

export function specificityLevel(data: Data, nivel = 0): number {
	let length = nivel;

	if (typeof data === 'object') {
		for (const clave in data) {
			length += clave.length;
			const valor = data[clave];

			if (Array.isArray(valor) && valor.length > 0) {
				for (const elemento of valor) {
					length += specificityLevel(elemento, length);
				}
			}
		}
	}

	return length;
}
