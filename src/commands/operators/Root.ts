import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

/**
 * Class representing a square root operator.
 * @implements {IOperator<number>}
 */
export default class Root implements IOperator<number> {
	/**
	 * ID of the operator.
	 * @type {string}
	 */
	id = 'root';
	/**
	 * Symbol of the operator.
	 * @type {string}
	 */
	symbol = 'sqrt';
	/**
	 * TypeGuard instance to validate input types.
	 * @type {TypeGuard}
	 * @private
	 */
	private typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	/**
	 * Radicand of the square root.
	 * @type {number | string | ICommand<number | string>}
	 */
	radicand: number | string | ICommand<number | string>;
	/**
	 * Index of the square root.
	 * @type {number | string | ICommand<number | string>}
	 */
	index: number | string | ICommand<number | string>;

	/**
	 * Creates a square root operator.
	 * @param {number | string | ICommand<number | string>} radicand - The radicand of the square root.
	 * @param {number | string | ICommand<number | string>} index - The index of the square root.
	 */
	constructor(
		radicand: number | string | ICommand<number | string>,
		index: number | string | ICommand<number | string>
	) {
		this.radicand = radicand;
		this.index = index;
	}

	/**
	 * Validates that a given value is a valid number or string.
	 * @param {number | string} value - The value to validate.
	 * @param {string} operandName - The name of the operand being validated.
	 * @returns {Promise<void>}
	 * @private
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the square root operation.
	 * @param {AbstractContextData} context - The context data.
	 * @returns {Promise<number>} The result of the square root operation.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const radicandOperand = isCommand(this.radicand) ? await this.radicand.execute(context) : this.radicand;
		await this.validateValue(radicandOperand, 'radicandOperand');

		const indexOperand = isCommand(this.index) ? await this.index.execute(context) : this.index;
		await this.validateValue(indexOperand, 'indexOperand');

		if (isNaN(Number(radicandOperand))) {
			throw new ValueException(`On ${this.id}. The value '${radicandOperand}' is not a valid number.`);
		}
		if (isNaN(Number(indexOperand))) {
			throw new ValueException(`On ${this.id}. The value '${indexOperand}' is not a valid number.`);
		}

		return Math.pow(Number(radicandOperand), 1 / Number(indexOperand));
	}

	/**
	 * Returns a string representation of the square root operator.
	 * @returns {string} The string representation of the square root operator.
	 */
	toString(): string {
		return `${this.symbol}(${this.radicand.toString()}, ${this.index.toString()})`;
	}
}
