/**
 * Represents a greater than or equal to operator that can be applied to numbers, strings, or dates.
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class GreaterEqualThan implements IOperator<boolean> {
	/**
	 * The unique identifier of the operator.
	 */
	id = 'greaterEqualThan';

	/**
	 * The symbol representing the greater than or equal to operator.
	 */
	symbol = '>=';

	/**
	 * An object that handles type checking of operands.
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string', 'date']);

	/**
	 * The left-hand operand of the operator, which can be a value or a command.
	 */
	left: number | string | Date | ICommand<number | string | Date>;

	/**
	 * The right-hand operand of the operator, which can be a value or a command.
	 */
	right: number | string | Date | ICommand<number | string | Date>;

	/**
	 * Creates a new instance of the GreaterEqualThan operator.
	 * @param left The left-hand operand of the operator.
	 * @param right The right-hand operand of the operator.
	 */
	constructor(
		left: number | string | Date | ICommand<number | string | Date>,
		right: number | string | Date | ICommand<number | string | Date>
	) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Validates that the given value matches one of the supported data types.
	 * @param value The value to validate.
	 * @param operandName The name of the operand being validated.
	 */
	private async validateValue(value: number | string | Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the greater than or equal to operator on the given context data.
	 * @param context The context data to execute the operator on.
	 * @returns A boolean indicating whether the left-hand operand is greater than or equal to the right-hand operand.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;
		await this.validateValue(rightOperand, 'rightOperand');

		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		await this.validateValue(leftOperand, 'leftOperand');

		return Number(leftOperand) >= Number(rightOperand);
	}

	/**
	 * Returns a string representation of the greater than or equal to operator.
	 * @returns A string representation of the greater than or equal to operator.
	 */
	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
