import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';
export default class And implements IOperator<boolean> {
	id = 'and';
	symbol = '&&';

	private typeGuard: TypeGuard = new TypeGuard(['boolean']);

	public operands: (ICommand<boolean> | boolean)[] | ICommand<boolean[]>;

	constructor(...operands: (ICommand<boolean> | boolean)[]);
	constructor(operands: ICommand<boolean[]>);
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.operands = args[0] as ICommand<boolean[]>;
		} else {
			this.operands = args as (ICommand<boolean> | boolean)[];
		}
	}

	private async validateOperand(value: boolean, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<boolean> {
		const operands = isCommand(this.operands) ? await this.operands.execute(context) : this.operands;

		for (let i = 0; i < operands.length; i++) {
			const operand = operands[i];
			const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
			await this.validateOperand(toEvaluate, `operands[${i}]`);
			if (!toEvaluate) {
				return false;
			}
		}
		return true;
	}

	toString(): string {
		const str = isCommand(this.operands)
			? this.operands.toString()
			: this.operands.map((e) => e.toString()).join(` ${this.symbol} `);
		return `(${str})`;
	}
}
