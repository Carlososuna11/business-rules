import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class Xor implements IOperator<boolean> {
	id = 'xor';
	symbol = '^';

	private typeGuard: TypeGuard = new TypeGuard(['boolean']);

	public operands: (ICommand<boolean> | boolean)[] | ICommand<boolean[]> | ICommand<boolean>;

	constructor(...operands: (ICommand<boolean> | boolean)[]);
	constructor(operands: ICommand<boolean> | ICommand<boolean[]> | boolean);
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.operands = isCommand(args[0]) ? (args[0] as ICommand<boolean[]> | ICommand<boolean>) : (args as boolean[]);
		} else {
			this.operands = args as (ICommand<boolean> | boolean)[];
		}
	}

	private async validateValue(value: boolean, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<boolean> {
		const operands = isCommand(this.operands) ? await this.operands.execute(context) : this.operands;

		if (Array.isArray(operands)) {
			const results = await Promise.all(
				operands.map(async (operand, index) => {
					const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
					await this.validateValue(toEvaluate, `operands[${index}]`);
					return toEvaluate;
				})
			).catch((e) => {
				throw e;
			});
			return results.reduce((acc, curr) => acc !== curr, false);
		}

		await this.validateValue(operands, 'operands');

		return operands;
	}

	toString(): string {
		const str = isCommand(this.operands)
			? this.operands.toString()
			: this.operands.map((e) => e.toString()).join(` ${this.symbol} `);
		return `(${str})`;
	}
}
