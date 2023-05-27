import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class MinDate implements IFunction<Date> {
	id = 'minDate';
	constructor(private readonly values: (ICommand<Date> | Date)[]) {}

	execute(): Date {
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

		let minValue = transformedValues[0];
		for (let i = 1; i < transformedValues.length; i++) {
			const currentValue = transformedValues[i];
			if (currentValue < minValue) {
				minValue = currentValue;
			}
		}
		return minValue;
	}

	toString(): string {
		return `${this.id}(${this.values.map((value) => (isCommand(value) ? value.toString() : value)).join(', ')})`;
	}
}
