import { ValueException } from '../../exceptions';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class StandardDesviation implements IFunction<number> {
	id = 'standardDesviation';
	constructor(private readonly values: (ICommand<number | string> | number | string)[]) {}

	execute(): number {
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));
		// Paso 1: Calcular la media
		const media =
			Number(transformedValues.reduce((sum, value) => Number(sum) + Number(value), 0)) / transformedValues.length;

		// Paso 2: Calcular la suma de los cuadrados de las différencias entre cada valor y la media
		const sumSquaresDifferences = transformedValues.reduce(
			(sum, value) => Number(sum) + Math.pow(Number(value) - media, 2),
			0
		);

		// Paso 3: Dividir la suma de los cuadrados de las différencias entre la cantidad de valores
		const standarDesviation = Math.sqrt(Number(sumSquaresDifferences) / transformedValues.length);

		return standarDesviation;
	}
}

// execute(): number {
// 	// if (this.values.length === 0)  // Si la lista está vacía devolvemos una excepcion
// 	const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

// 	const allValuesAreNumbers = transformedValues.every((value) => !isNaN(Number(value)));

// 	if (!allValuesAreNumbers) {
// 		throw new ValueException(this.id, 'Values must be numbers or strings representing numbers');
// 	}

// 	return Math.max(...transformedValues.map((value) => Number(value)));
// }
