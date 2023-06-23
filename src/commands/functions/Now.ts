import IFunction from './IFunction';
import { AbstractContextData } from '../../context';

/**
 * A class that implements the IFunction interface to return the current date and time.
 */
export default class Now implements IFunction<Date> {
	/**
	 * Unique identifier for the function.
	 */
	id = 'now';

	/**
	 * Executes the function with the given context and returns a Date object.
	 * @param context The context data to execute the function with.
	 * @returns A Date object representing the current date and time.
	 */
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async execute(context: AbstractContextData): Promise<Date> {
		return new Date();
	}

	/**
	 * Returns a string representation of the function.
	 * @returns A string of the form "<id>()".
	 */
	toString(): string {
		return `${this.id}()`;
	}
}
