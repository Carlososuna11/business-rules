import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Max implements IFunction<number | string> {
	id = 'max';

	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	constructor(private readonly values: (ICommand<number | string> | number | string)[]) {}

	private async validateOperand(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<number> {
		try {
			for (let i = 0; i < this.values.length; i++) {
				const operand = this.values[i];
				const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
				await this.validateOperand(toEvaluate, `operands[${i}]`);
			}

			const transformedValues = this.values.map(async (value) =>
				isCommand(value) ? await value.execute(context) : value
			);

			const allValuesAreNumbers = transformedValues.every((value) => !isNaN(Number(value)));

			if (!allValuesAreNumbers) {
				throw new ValueException(this.id, 'Values must be numbers or strings representing numbers');
			}

			return Math.max(...transformedValues.map((value) => Number(value)));
		} catch (error) {
			// Manejo del error
			console.error(error);
			throw error;
		}
	}

	toString(): string {
		return `${this.id}(${this.values.map((value) => (isCommand(value) ? value.toString() : value)).join(', ')})`;
	}
}
