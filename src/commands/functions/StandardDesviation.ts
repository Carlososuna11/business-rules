import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class StandardDesviation implements IFunction<number> {
	id = 'standardDesviation';

	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	constructor(private readonly values: (ICommand<number | string> | number | string)[]) {}

	private async validateOperand(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<number> {
		for (let i = 0; i < this.values.length; i++) {
			const operand = this.values[i];
			const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
			await this.validateOperand(toEvaluate, `operands[${i}]`);
		}
		const transformedValues = await Promise.all(
			this.values.map(async (value) => (isCommand(value) ? await value.execute(context) : value))
		);
		const media =
			Number(transformedValues.reduce((sum, value) => Number(sum) + Number(value), 0)) / transformedValues.length;

		const sumSquaresDifferences = transformedValues.reduce(
			(sum, value) => Number(sum) + Math.pow(Number(value) - media, 2),
			0
		);

		const standarDesviation = Math.sqrt(Number(sumSquaresDifferences) / transformedValues.length);

		return standarDesviation;
	}

	toString(): string {
		return `${this.id}(${this.values.map((value) => (isCommand(value) ? value.toString() : value)).join(', ')})`;
	}
}
