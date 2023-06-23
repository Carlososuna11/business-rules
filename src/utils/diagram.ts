import { encode } from 'plantuml-encoder';
import { promises as fs } from 'fs';
import CONSTS from '../constants';
import { BusinessRulesException } from '../exceptions';

/**
 * Encodes a PlantUML diagram.
 *
 * @param diagram The PlantUML diagram to encode.
 * @returns The encoded PlantUML diagram.
 */
export function encodeDiagram(diagram: string) {
	return encode(diagram);
}

/**
 * Generates the URL to access a PlantUML diagram.
 *
 * @param diagram The PlantUML diagram to encode and generate the URL.
 * @returns The URL to access the encoded PlantUML diagram.
 */
export function getUrlDiagram(diagram: string) {
	return `${CONSTS.PLANTUML_URL}${encodeDiagram(diagram)}`;
}

/**
 * Saves a PlantUML diagram to a file.
 *
 * @param diagram The PlantUML diagram to save.
 * @param path The path where the file should be saved.
 * @throws {BusinessRulesException} If there is an error downloading or saving the diagram.
 * @returns A Promise that resolves when the diagram is successfully saved.
 */
export async function saveDiagram(diagram: string, path: string): Promise<void> {
	const url = getUrlDiagram(diagram);
	try {
		const response = await fetch(url);
		// Check if the response is successful
		if (!response.ok) {
			throw new BusinessRulesException(`Error donwloading the diagram: ${response.statusText}`);
		}
		const blob = await response.blob();
		const arrayBuffer = await blob.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);
		await fs.writeFile(path, buffer);
	} catch (error) {
		throw new BusinessRulesException(`Error donwloading the diagram: ${error}`);
	}
}
