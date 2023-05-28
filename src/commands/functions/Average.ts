import { ValueException } from '../../exceptions';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';
import IsNaN from './IsNaN';

export default class Average implements IFunction<number> {
	id = 'average';
	constructor(private readonly values: (ICommand<number | string> | number | string)[]) {}

	execute(): number {
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

		const allValuesAreNumbers = transformedValues.every((value) => !IsNaN(value));

		if (!allValuesAreNumbers) {
			throw new ValueException(this.id, 'Values must be numbers or strings representing numbers');
		}

		const sum = transformedValues.reduce((acumm, value) => Number(acumm) + Number(value), 0);
		return Number(sum) / transformedValues.length;
	}

	toString(): string {
		return `${this.id}(${this.values.map((value) => (isCommand(value) ? value.toString() : value)).join(', ')})`;
	}
}
