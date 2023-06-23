/**
 * Represents a logical AND operator that can operate on boolean values.
 */
import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class And implements IOperator<boolean> {
	/**
	 * The ID of the AND operator.
	 */
	id = 'and';

	/**
	 * The symbol used to represent the AND operator.
	 */
	symbol = '&&';

	/**
	 * A type guard that ensures that all operands are of boolean type.
	 */
	private typeGuard: TypeGuard = new TypeGuard(['boolean']);

	/**
	 * The operands that the AND operator operates on.
	 */
	public operands: (ICommand<boolean> | boolean)[] | ICommand<boolean[]> | ICommand<boolean>;

	/**
	 * Creates a new instance of the AND operator with the given operands.
	 * @param operands The operands to operate on.
	 */
	constructor(...operands: (ICommand<boolean> | boolean)[]);
	/**
	 * Creates a new instance of the AND operator with the given operand.
	 * @param operands The operand to operate on.
	 */
	constructor(operands: ICommand<boolean> | ICommand<boolean[]> | boolean);
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.operands = isCommand(args[0]) ? (args[0] as ICommand<boolean[]> | ICommand<boolean>) : (args as boolean[]);
		} else {
			this.operands = args as (ICommand<boolean> | boolean)[];
		}
	}

	/**
	 * Validates that the operand is of boolean type.
	 * @param value The value to validate.
	 * @param operandName The name of the operand being validated.
	 */
	private async validateOperand(value: boolean, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the AND operator on the given context.
	 * @param context The context to execute the operator on.
	 * @returns The result of the operation.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const operands = isCommand(this.operands) ? await this.operands.execute(context) : this.operands;

		if (Array.isArray(operands)) {
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

		await this.validateOperand(operands, 'operands');

		return operands;
	}

	/**
	 * Returns a string representation of the AND operator.
	 * @returns The string representation of the AND operator.
	 */
	toString(): string {
		const str = isCommand(this.operands)
			? this.operands.toString()
			: this.operands.map((e) => e.toString()).join(` ${this.symbol} `);
		return `(${str})`;
	}
}
