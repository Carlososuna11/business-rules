/**
 * In operator implementation that verifies if a property exists in a given object.
 * @implements {IOperator<boolean>}
 */
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class In implements IOperator<boolean> {
	/**
	 * Operator symbol used for string representations
	 */
	symbol = 'IN';

	/**
	 * Operator id used for error messages.
	 */
	id = 'in';

	/**
	 * Type guard for validating the type of the object operand.
	 */
	objectTypeGuard: TypeGuard = new TypeGuard(['object']);

	/**
	 * Type guard for validating the type of the property operand.
	 */
	propertyTypeGuard: TypeGuard = new TypeGuard(['string']);

	/**
	 * Object operand to verify the existence of the property in.
	 */
	private object: Record<string, unknown> | ICommand<Record<string, unknown>>;

	/**
	 * Property operand to verify if it exists within the object.
	 */
	private property: string | ICommand<string>;

	/**
	 * In operator constructor.
	 * @param {string | ICommand<string>} property Property operand to verify if it exists within the object.
	 * @param {Record<string, unknown> | ICommand<Record<string, unknown>>} object Object operand to verify the existence of the property in.
	 */
	constructor(
		property: string | ICommand<string>,
		object: Record<string, unknown> | ICommand<Record<string, unknown>>
	) {
		this.object = object;
		this.property = property;
	}

	/**
	 * Validates the type of the object operand.
	 * @param {Record<string, unknown>} value Value to validate.
	 * @param {string} operandName Name of the operand being validated.
	 * @returns {Promise<void>} Promise that resolves if the value is valid, and rejects with an error message otherwise.
	 */
	private async validateObjectOperand(value: Record<string, unknown>, operandName: string): Promise<void> {
		await this.objectTypeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Validates the type of the property operand.
	 * @param {string} value Value to validate.
	 * @param {string} operandName Name of the operand being validated.
	 * @returns {Promise<void>} Promise that resolves if the value is valid, and rejects with an error message otherwise.
	 */
	private async validatePropertyOperand(value: string, operandName: string): Promise<void> {
		await this.propertyTypeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the In operator.
	 * @param {AbstractContextData} context Context object containing values to resolve commands if any.
	 * @returns {Promise<boolean>} Promise that resolves with the result of the operator execution.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const object = isCommand(this.object) ? await this.object.execute(context) : this.object;
		await this.validateObjectOperand(object, 'object');

		const property = isCommand(this.property) ? await this.property.execute(context) : this.property;
		await this.validatePropertyOperand(property, 'property');

		return property in object;
	}

	/**
	 * Returns a string representation of the In operator.
	 * @returns {string} String representation of the In operator.
	 */
	toString(): string {
		return `${isCommand(this.object) ? this.object.toString() : String(this.object)} ${this.symbol} ${
			isCommand(this.property) ? this.property.toString() : String(this.property)
		}`;
	}
}
