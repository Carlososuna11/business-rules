/**
 * Represents a function to find the object with the maximum value of a given key in a list of objects.
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class MaxObject implements IFunction<object | undefined> {
	/**
	 * Unique identifier for the function.
	 */
	id = 'maxObject';

	/**
	 * A type guard instance for object type.
	 */
	typeGuard: TypeGuard = new TypeGuard(['object']);

	/**
	 * The list of objects to iterate over or a command that returns a list of objects.
	 */
	private readonly objects: (ICommand<object> | object)[] | ICommand<object[]>;

	/**
	 * The key that should be used to find the object with the maximum value.
	 */
	private readonly key: string;

	/**
	 * Creates an instance of MaxObject function.
	 * @param objects The list of objects to iterate over or a command that returns a list of objects.
	 * @param key The key that should be used to find the object with the maximum value.
	 */
	constructor(objects: (ICommand<object> | object)[] | ICommand<object[]>, key: string) {
		this.objects = objects;
		this.key = key;
	}

	/**
	 * Validates if the given value is an object.
	 * @param value The object to validate.
	 * @param operandName The name of the operand being validated.
	 * @returns A promise that resolves if the object is valid, otherwise throws an error.
	 */
	private async validateObject(value: object, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the function to find the object with the maximum value of a given key in a list of objects.
	 * @param context The context data.
	 * @returns A promise that resolves to the object with the maximum value of the given key in the list of objects.
	 */
	async execute(context: AbstractContextData): Promise<object | undefined> {
		const values = (isCommand(this.objects) ? await this.objects.execute(context) : this.objects) as object[];

		const result = await Promise.all(
			values.map(async (value, index) => {
				const toEvaluate = (isCommand(value) ? await value.execute(context) : value) as object;
				await this.validateObject(toEvaluate, `values[${index}]`);
				return toEvaluate;
			})
		).catch((err) => {
			throw err;
		});

		if (result.length === 0) {
			return undefined;
		}

		return result.reduce((prev, curr) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return prev[this.key] > curr[this.key] ? prev : curr;
		});
	}

	/**
	 * Returns a string representation of the function.
	 * @returns A string representation of the function.
	 */
	toString(): string {
		const str = isCommand(this.objects) ? this.objects.toString() : this.objects.map((e) => e.toString()).join(`, `);
		return `${this.id}(${str}, ${this.key})`;
	}
}
