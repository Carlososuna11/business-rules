import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Average implements IFunction<number> {
	id = 'average';
	constructor(private readonly values: (ICommand<number> | number)[]) {}

	execute(): number {
		// if (this.values.length === 0)  // Si la lista está vacía devolvemos una excepcion
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

		const sum = transformedValues.reduce((acumm, value) => acumm + value, 0);
		return sum / transformedValues.length;
	}
}
