import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import { ValueException } from '../../exceptions';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class StandardDesviation implements IFunction<number> {
	id = 'standardDesviation';

	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	private readonly values:
		| (ICommand<number | string> | number | string)[]
		| ICommand<(number | string)[]>
		| ICommand<number | string>;

	constructor(...values: (ICommand<number | string> | number | string)[]);
	constructor(values: ICommand<(number | string)[]> | ICommand<number | string> | number | string);
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.values = isCommand(args[0])
				? (args[0] as ICommand<(number | string)[]> | ICommand<number | string>)
				: (args as (number | string)[]);
		} else {
			this.values = args as (ICommand<number | string> | number | string)[];
		}
	}

	private async validateOperand(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<number> {
		const operands = isCommand(this.values) ? await this.values.execute(context) : this.values;

		if (Array.isArray(operands)) {
			const result = await Promise.all(
				operands.map(async (operand, index) => {
					const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
					await this.validateOperand(toEvaluate, `operands[${index}]`);
					if (isNaN(Number(toEvaluate))) {
						throw new ValueException(this.id, `The value '${toEvaluate}' is not a valid number.`);
					}
					return Number(toEvaluate);
				})
			).catch((err) => {
				throw err;
			});

			const average = result.reduce((a, b) => a + b, 0) / result.length;
			const sum = result.reduce((a, b) => a + Math.pow(b - average, 2), 0);
			return Math.sqrt(sum / result.length);
		}

		await this.validateOperand(operands, 'operands');

		if (isNaN(Number(operands))) {
			throw new ValueException(this.id, `The value '${operands}' is not a valid number.`);
		}

		// the standard desviation of a number is 0
		return 0;
	}

	toString(): string {
		const str = isCommand(this.values) ? this.values.toString() : this.values.map((e) => e.toString()).join(`, `);
		return `${this.id}(${str})`;
	}
}
