import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';
import { AbstractContextData } from '../../context';

/**
 * Represents the "equal to" operator (==) that compares two operands for equality.
 */
export default class Equal implements IOperator<boolean> {
	/**
	 * The symbol that represents the operator.
	 */
	symbol = '==';

	/**
	 * The unique identifier of the operator.
	 */
	id = 'equal';

	/**
	 * The left operand of the operator.
	 */
	left: unknown | ICommand<unknown>;

	/**
	 * The right operand of the operator.
	 */
	right: unknown | ICommand<unknown>;

	/**
	 * Creates a new instance of the Equal operator.
	 * @param left The left operand of the operator.
	 * @param right The right operand of the operator.
	 */
	constructor(left: unknown | ICommand<unknown>, right: unknown | ICommand<unknown>) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Executes the Equal operator and compares the left and right operands for equality.
	 * @param context The context in which to execute the operator.
	 * @returns A Promise that resolves to a boolean indicating whether the operands are equal.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;

		return leftOperand === rightOperand;
	}

	/**
	 * Returns a string representation of the Equal operator.
	 * @returns A string representing the Equal operator.
	 */
	toString(): string {
		return `${isCommand(this.left) ? this.left.toString() : String(this.left)} ${this.symbol} ${
			isCommand(this.right) ? this.right.toString() : String(this.right)
		}`;
	}
}
