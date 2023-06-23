/**
 * Represents the XOR operator.
 */
import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class Xor implements IOperator<boolean> {
	/**
	 * The id of the XOR operator.
	 */
	id = 'xor';

	/**
	 * The symbol used to represent the XOR operator.
	 */
	symbol = '^';

	/**
	 * A TypeGuard instance used to validate operands.
	 */
	private typeGuard: TypeGuard = new TypeGuard(['boolean']);

	/**
	 * The operands used in the XOR operation.
	 */
	public operands: (ICommand<boolean> | boolean)[] | ICommand<boolean[]> | ICommand<boolean>;

	/**
	 * Creates a new instance of the XOR operator with the specified operands.
	 * @param operands The operands used in the XOR operation.
	 */
	constructor(...operands: (ICommand<boolean> | boolean)[]);
	/**
	 * Creates a new instance of the XOR operator with the specified operand.
	 * @param operands The operand used in the XOR operation.
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
	 * Validates that the specified value is a boolean value.
	 * @param value The value to validate.
	 * @param operandName The name of the operand being validated.
	 */
	private async validateValue(value: boolean, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the XOR operation.
	 * @param context The context used to execute the command.
	 * @returns The result of the XOR operation.
	 */
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

	/**
	 * Returns a string representation of the XOR operator.
	 * @returns A string representation of the XOR operator.
	 */
	toString(): string {
		const str = isCommand(this.operands)
			? this.operands.toString()
			: this.operands.map((e) => e.toString()).join(` ${this.symbol} `);
		return `(${str})`;
	}
}
