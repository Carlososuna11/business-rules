import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

/**
 * The Or class represents the logical OR operator.
 * It takes one or more operands of boolean type and returns true
 * if any of the operands are true, otherwise it returns false.
 */
export default class Or implements IOperator<boolean> {
	/**
	 * The id of the operator.
	 */
	id = 'or';

	/**
	 * The symbol of the operator.
	 */
	symbol = '||';

	/**
	 * Type guard instance used for operand validation.
	 */
	private typeGuard: TypeGuard = new TypeGuard(['boolean']);

	/**
	 * The operands for the OR operator.
	 */
	public operands: (ICommand<boolean> | boolean)[] | ICommand<boolean[]> | ICommand<boolean>;

	/**
	 * Creates a new instance of the Or class with the given operands.
	 * @param operands The operands for the OR operator.
	 */
	constructor(...operands: (ICommand<boolean> | boolean)[]);

	/**
	 * Creates a new instance of the Or class with the given operand.
	 * @param operands The single operand for the OR operator.
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
	 * Validates the given operand value for the OR operator.
	 * @param value The operand value to be validated.
	 * @param operandName The name of the operand being validated.
	 */
	private async validateOperand(value: boolean, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the OR operator with the given context data.
	 * @param context The context data for executing commands.
	 * @returns The result of the OR operation.
	 */
	public async execute(context: AbstractContextData): Promise<boolean> {
		const operands = isCommand(this.operands) ? await this.operands.execute(context) : this.operands;

		if (Array.isArray(operands)) {
			for (let i = 0; i < operands.length; i++) {
				const operand = operands[i];
				const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
				await this.validateOperand(toEvaluate, `operands[${i}]`);
				if (toEvaluate) {
					return true;
				}
			}

			return false;
		}

		await this.validateOperand(operands, 'operands');

		return operands;
	}

	/**
	 * Returns the string representation of the OR operator.
	 * @returns The string representation of the OR operator.
	 */
	toString(): string {
		const str = isCommand(this.operands)
			? this.operands.toString()
			: this.operands.map((e) => e.toString()).join(` ${this.symbol} `);
		return `(${str})`;
	}
}
