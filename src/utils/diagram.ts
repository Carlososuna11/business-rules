import { encode } from 'plantuml-encoder';
import { promises as fs } from 'fs';
import CONSTS from '../constants';
import { BusinessRulesException } from '../exceptions';

export function encodeDiagram(diagram: string) {
	return encode(diagram);
}

export function getUrlDiagram(diagram: string) {
	return `${CONSTS.PLANTUML_URL}${encodeDiagram(diagram)}`;
}

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
