import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class MinDate implements IFunction<Date> {
	id = 'minDate';
	constructor(private readonly values: (ICommand<Date> | Date)[]) {}

	execute(): Date {
		// if (this.values.length === 0)  // Si la lista está vacía devolvemos una excepcion
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

		let minValue = transformedValues[0]; // Inicializamos el valor mínimo con el primer elemento de la lista
		for (let i = 1; i < transformedValues.length; i++) {
			const currentValue = transformedValues[i];
			if (currentValue < minValue) {
				minValue = currentValue; // Si el valor actual es menor que el valor mínimo, actualizamos el valor mínimo
			}
		}
		return minValue;
	}
}
