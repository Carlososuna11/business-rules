/**
 * Represents a function that returns the object with the minimum value for the given key,
 * from an array of objects or a command that returns an array of objects.
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class MinObject implements IFunction<object | undefined> {
	/**
	 * The unique identifier of the function.
	 */
	id = 'minObject';
	/**
	 * A type guard instance to validate the type of the objects.
	 */
	typeGuard: TypeGuard = new TypeGuard(['object']);
	/**
	 * An array of objects or a command that returns an array of objects.
	 */
	private readonly objects: (ICommand<object> | object)[] | ICommand<object[]>;
	/**
	 * The key to compare the objects and find the minimum value.
	 */
	private readonly key: string;

	/**
	 * Constructs a new instance of the MinObject function.
	 * @param objects An array of objects or a command that returns an array of objects.
	 * @param key The key to compare the objects and find the minimum value.
	 */
	constructor(objects: (ICommand<object> | object)[] | ICommand<object[]>, key: string) {
		this.objects = objects;
		this.key = key;
	}

	/**
	 * Validates that the given object is of type object.
	 * @param value The object to validate.
	 * @param operandName The name of the operand that contains the object.
	 */
	private async validateObject(value: object, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the function and returns the object with the minimum value for the given key,
	 * from an array of objects or a command that returns an array of objects.
	 * @param context The context used to execute the command.
	 * @returns The object with the minimum value for the given key, or undefined if the array is empty.
	 * @throws If any error occurs while executing the command.
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
			return prev[this.key] < curr[this.key] ? prev : curr;
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
