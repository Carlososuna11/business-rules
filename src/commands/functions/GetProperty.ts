/**
 * Represents a class that implements the IFunction interface and is used to get a property from an object.
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class GetProperty implements IFunction<object> {
	/**
	 * A unique identifier for the GetProperty function.
	 */
	id = 'geProperty';

	/**
	 * An instance of the TypeGuard class used for validating the object type.
	 */
	typeGuard: TypeGuard = new TypeGuard(['object']);

	/**
	 * The object from which to retrieve the property.
	 */
	private readonly object: ICommand<object> | object;

	/**
	 * The key of the property to retrieve from the object.
	 */
	private readonly key: string | ICommand<string>;

	/**
	 * Constructs a new instance of the GetProperty class.
	 * @param object The object from which to retrieve the property.
	 * @param key The key of the property to retrieve from the object.
	 */
	constructor(object: ICommand<object> | object, key: string | ICommand<string>) {
		this.object = object;
		this.key = key;
	}

	/**
	 * Validates that the provided value is of type object.
	 * @param value The value to validate.
	 * @param operandName The name of the operand being validated.
	 */
	private async validateObject(value: object, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the GetProperty function and retrieves the specified property from the object.
	 * @param context The context data for the current execution.
	 * @returns The retrieved property.
	 */
	async execute(context: AbstractContextData): Promise<object> {
		const value = (isCommand(this.object) ? await this.object.execute(context) : this.object) as object;
		await this.validateObject(value, `value`);

		const key = isCommand(this.key) ? await this.key.execute(context) : this.key;

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return value[key];
	}

	/**
	 * Returns a string representation of the GetProperty function.
	 * @returns A string representation of the GetProperty function.
	 */
	toString(): string {
		const str = isCommand(this.object) ? this.object.toString() : this.object;
		return `${this.id}(${str}, ${this.key.toString()})`;
	}
}
