/**
 * A class that implements the IFunction interface and provides the functionality to convert a given value to a string.
 */
import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class ToString implements IFunction<string> {
	/**
	 * The identifier of the ToString instance.
	 */
	id = 'toString';

	/**
	 * Creates a new instance of the ToString class.
	 * @param value An object of type ICommand or unknown that represents the value to be converted to string
	 */
	constructor(private readonly value: ICommand<unknown> | unknown) {}

	/**
	 * Executes the ToString instance to convert the value to a string.
	 * @param context An instance of the AbstractContextData class that represents the context of the execution.
	 * @return A Promise that resolves to a string representation of the value.
	 */
	async execute(context: AbstractContextData): Promise<string> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		const stringValue = transformedValue as string;

		return stringValue.toString();
	}

	/**
	 * Returns a string representation of the ToString instance.
	 * @return A string that represents the ToString instance.
	 */
	toString(): string {
		const transformedValue = isCommand(this.value) ? this.value.toString() : String(this.value);
		return `${this.id}(${transformedValue.toString()})`;
	}
}
