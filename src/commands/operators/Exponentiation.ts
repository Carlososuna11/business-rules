/**
 * Exponentiation class that implements IOperator<number> interface.
 * Represents an operation that calculates the result of raising the left operand to the power of the right operand.
 */
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Exponentiation implements IOperator<number> {
	/**
	 * The operator identifier.
	 */
	id = 'exponentiation';

	/**
	 * The operator symbol.
	 */
	symbol = '**';

	/**
	 * A TypeGuard instance to validate the type of the operands.
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * The left operand of the operator.
	 */
	left: number | string | ICommand<number | string>;

	/**
	 * The right operand of the operator.
	 */
	right: number | string | ICommand<number | string>;

	/**
	 * Creates an instance of Exponentiation.
	 * @param left The left operand of the operator.
	 * @param right The right operand of the operator.
	 */
	constructor(left: number | string | ICommand<number | string>, right: number | string | ICommand<number | string>) {
		this.left = left;
		this.right = right;
	}

	/**
	 * Validates a value to ensure that it is a valid numeric or string operand.
	 * @param value The value to validate.
	 * @param operandName The name of the operand.
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the exponentiation operation.
	 * @param context An object that contains data that might be used during the execution of the command.
	 * @returns The result of the operation.
	 * @throws {ValueException} If one of the operands is not a valid number.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const rightOperand = isCommand(this.right) ? await this.right.execute(context) : this.right;
		await this.validateValue(rightOperand, 'rightOperand');

		const leftOperand = isCommand(this.left) ? await this.left.execute(context) : this.left;
		await this.validateValue(leftOperand, 'leftOperand');

		if (isNaN(Number(rightOperand))) {
			throw new ValueException(`On ${this.id}. The value '${rightOperand}' is not a valid number.`);
		}
		if (isNaN(Number(leftOperand))) {
			throw new ValueException(`On ${this.id}. The value '${leftOperand}' is not a valid number.`);
		}

		return Number(leftOperand) ** Number(rightOperand);
	}

	/**
	 * Returns a string representation of the operator expression.
	 * @returns A string representation of the operator expression.
	 */
	toString(): string {
		return `${this.left.toString()} ${this.symbol} ${this.right.toString()}`;
	}
}
