import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class MaxDate implements IFunction<Date> {
	id = 'maxDate';
	constructor(private readonly values: (ICommand<Date> | Date)[]) {}

	execute(): Date {
		const transformedValues = this.values.map((value) => (isCommand(value) ? value.execute() : value));

		let maxValue = transformedValues[0];
		for (let i = 1; i < transformedValues.length; i++) {
			const currentValue = transformedValues[i];
			if (currentValue > maxValue) {
				maxValue = currentValue;
			}
		}
		return maxValue;
	}

	toString(): string {
		return `${this.id}(${this.values.map((value) => (isCommand(value) ? value.toString() : value)).join(', ')})`;
	}
}
