import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class MinDate implements IFunction<Date> {
	id = 'minDate';

	typeGuard: TypeGuard = new TypeGuard(['date']);
	constructor(private readonly values: (ICommand<Date> | Date)[]) {}

	private async validateValue(value: Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<Date> {
		const transformedValues = await Promise.all(
			this.values.map(async (value) => (isCommand(value) ? await value.execute(context) : value))
		);

		let minValue = transformedValues[0];
		for (let i = 1; i < transformedValues.length; i++) {
			const currentValue = transformedValues[i];

			await this.validateValue(currentValue, `value[${i}]`);

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
