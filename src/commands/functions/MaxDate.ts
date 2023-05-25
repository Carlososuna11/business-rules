import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class MaxDate implements IFunction<Date> {
	id = 'maxDate';
	constructor(private readonly values: (ICommand<Date> | Date)[]) {}

	execute(): Date {
		// if (this.values.length === 0)  // Si la lista está vacía devolvemos una excepcion
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

		let maxValue = transformedValues[0]; // Inicializamos el valor máximo con el primer elemento de la lista
		for (let i = 1; i < transformedValues.length; i++) {
			const currentValue = transformedValues[i];
			if (currentValue > maxValue) {
				maxValue = currentValue; // Si el valor actual es mayor que el valor máximo, actualizamos el valor máximo
			}
		}
		return maxValue;
	}
}
