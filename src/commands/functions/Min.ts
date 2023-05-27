import { ValueException } from '../../exceptions';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Min implements IFunction<number | string> {
	id = 'min';
	constructor(private readonly values: (ICommand<number | string> | number | string)[]) {}

	execute(): number {
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

		const allValuesAreNumbers = transformedValues.every((value) => !isNaN(Number(value)));

		if (!allValuesAreNumbers) {
			throw new ValueException(this.id, 'Values must be numbers or strings representing numbers');
		}

		return Math.min(...transformedValues.map((value) => Number(value)));
	}

	toString(): string {
		return `${this.id}(${this.values.map((value) => (isCommand(value) ? value.toString() : value)).join(', ')})`;
	}
}
