import { Data } from '../types';

/**
 * Calculates the specificity level of a given data object recursively
 * @param data The data object to calculate the specificity level for
 * @param nivel The starting level of specificity (default 0)
 * @returns The specificity level of the data object
 */
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
