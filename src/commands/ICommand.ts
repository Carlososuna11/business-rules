import { AbstractContextData } from '../context';

/**
 * Interface for command objects that have an id and a method to execute a specific action
 * @template T type of the result of the execution of the command
 */
export default interface ICommand<T> {
	/**
	 * Unique identifier for the command
	 */
	id: string;
	/**
	 * Method to execute the command and return a Promise that resolves with type T
	 * @param context Object containing the context information needed to execute the command
	 * @returns A Promise that resolves with type T
	 */
	execute(context: AbstractContextData): Promise<T>;
	/**
	 * Method to get a string representation of the command
	 * @returns A string representation of the command
	 */
	toString(): string;
}

/**
 * Type guard to determine if an object is an ICommand object
 * @template T type of the result of the execution of the command
 * @param value The object to be checked
 * @returns A boolean indicating whether the object is an ICommand<T> object or not
 */
export function isCommand<T>(value: unknown): value is ICommand<T> {
	if (value === null || value === undefined) return false;
	return (
		typeof value === 'object' &&
		'execute' in value &&
		typeof (value as ICommand<T>).execute === 'function' &&
		'id' in value &&
		typeof (value as ICommand<T>).id === 'string' &&
		'toString' in value &&
		typeof (value as ICommand<T>).toString === 'function'
	);
}
