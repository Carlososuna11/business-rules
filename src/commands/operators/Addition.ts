import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
/**
 * Class representing an addition operator for numbers and strings.
 * @implements IOperator<number>
 */
export default class Addition implements IOperator<number> {
	/** The identifier of the addition operator. */
	id = 'addition';
	/** The symbol used to represent the addition operator. */
	symbol = '+';
	/** A type guard used to validate the operands. */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	/** The left operand of the addition. */
	left: number | string | ICommand<number | string>;
	/** The right operand of the addition. */
	right: number | string | ICommand<number | string>;

	/**
	 * Create an addition operator.
	 * @param left - The left operand of the addition.
	 * @param right - The right operand of the addition.
	 */
	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Validates that the given operand is a valid number or string.
	 * @param value - The operand to validate.
	 * @param operandName - The name of the operand being validated.
	 * @throws {ValueException} If the operand is not a valid number or string.
	 */
	private async validateOperand(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the addition operation and returns the resulting value.
	 * @param context - The context data, not used in this implementation.
	 * @returns The result of the addition operation.
	 * @throws {ValueException} If either operand is not a valid number.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;
		await this.validateOperand(rightOperand, 'right');
		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		await this.validateOperand(leftOperand, 'left');

		if (isNaN(Number(rightOperand))) {
			throw new ValueException(`On ${this.id}. The value '${rightOperand}' is not a valid number.`);
		}
		if (isNaN(Number(leftOperand))) {
			throw new ValueException(`On ${this.id}. The value '${leftOperand}' is not a valid number.`);
		}
		return Number(leftOperand) + Number(rightOperand);
	}

	/**
	 * Returns a string representation of the addition operation.
	 * @returns A string representation of the addition operation.
	 */
	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
