import { encode } from 'plantuml-encoder';
import fs from 'fs';

export function encodeDiagram(diagram: string) {
	return encode(diagram);
}

export function getUrlDiagram(diagram: string) {
	return `https://www.plantuml.com/plantuml/png/${encodeDiagram(diagram)}`;
}

export async function saveDiagram(url: string, destination: string): Promise<void> {
	try {
		// Fetch the image from the URL
		const response = await fetch(url);

		// Check if the response is successful
		if (!response.ok) {
			throw new Error(`Error donwloading the diagram: ${response.statusText}`);
		}

		// Convert the fetched data into a Blob
		const imageBlob = await response.blob();

		// Convert the Blob to a Buffer
		const buffer = await blobToBuffer(imageBlob);

		// Save the buffer to a file
		fs.writeFile(destination, buffer, (error) => {
			if (error) {
				throw new Error(`Error saving the diagram: ${error.message}`);
			}
		});
	} catch (error) {
		console.error(`Error donwloading the diagram: ${error}`);
	}
}

function blobToBuffer(blob: Blob): Promise<Buffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(Buffer.from(reader.result as ArrayBuffer));
		reader.onerror = () => reject(new Error('Error converting blob to buffer'));
		reader.readAsArrayBuffer(blob);
	});
}
