import { ValueException } from '../../exceptions';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Max implements IFunction<number | string> {
	id = 'max';
	constructor(private readonly values: (ICommand<number | string> | number | string)[]) {}

	execute(): number {
		// if (this.values.length === 0)  // Si la lista está vacía devolvemos una excepcion
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

		const allValuesAreNumbers = transformedValues.every((value) => !isNaN(Number(value)));

		if (!allValuesAreNumbers) {
			throw new ValueException(this.id, 'Values must be numbers or strings representing numbers');
		}

		return Math.max(...transformedValues.map((value) => Number(value)));
	}
}
