import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Min implements IFunction<number> {
	id = 'min';
	constructor(private readonly values: (ICommand<number> | number)[]) {}

	execute(): number {
		// if (this.values.length === 0)  // Si la lista está vacía devolvemos una excepcion
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

		return Math.min(...transformedValues);
	}
}
