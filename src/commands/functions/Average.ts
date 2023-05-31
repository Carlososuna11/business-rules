import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Average implements IFunction<number> {
	id = 'average';

	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	private operands:
		| (ICommand<number | string> | number | string)[]
		| ICommand<(number | string)[]>
		| ICommand<number | string>;

	constructor(...operands: (ICommand<number | string> | number | string)[]);
	constructor(operands: ICommand<(number | string)[]> | number | string | ICommand<number | string>);
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.operands = isCommand(args[0])
				? (args[0] as ICommand<(number | string)[]> | ICommand<number | string>)
				: (args as (number | string)[]);
		} else {
			this.operands = args as (ICommand<number | string> | number | string)[];
		}
	}

	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	private async validateListValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<number> {
		const operands = isCommand(this.operands) ? await this.operands.execute(context) : this.operands;

		if (Array.isArray(operands)) {
			const result = await Promise.all(
				operands.map(async (operand, index) => {
					const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
					await this.validateValue(toEvaluate, `operands[${index}]`);

					if (isNaN(Number(toEvaluate))) {
						throw new ValueException(this.id, `The value '${toEvaluate}' is not a valid number.`);
					}

					return Number(toEvaluate);
				})
			).catch((err) => {
				throw err;
			});

			return result.reduce((a, b) => a + b, 0) / result.length;
		}

		await this.validateListValue(operands, 'operands');

		if (isNaN(Number(operands))) {
			throw new ValueException(this.id, `The value '${operands}' is not a valid number.`);
		}

		return Number(operands);
	}

	toString(): string {
		const str = isCommand(this.operands) ? this.operands.toString() : this.operands.map((e) => e.toString()).join(`, `);
		return `${this.id}(${str})`;
	}
}
