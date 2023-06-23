/**
 * Represents a maximum function that returns the maximum value between a set of numbers or strings.
 */
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Max implements IFunction<number> {
	/**
	 * The unique identifier of the function.
	 */
	id = 'max';

	/**
	 * The type guard to validate the operands of the function.
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * The list of operands to be evaluated to find the maximum value.
	 */
	private readonly values:
		| (ICommand<number | string> | number | string)[]
		| ICommand<(number | string)[]>
		| ICommand<number | string>;

	/**
	 * Creates an instance of Max.
	 * @param values The values or commands to be evaluated to find the maximum value.
	 */
	constructor(...values: (ICommand<number | string> | number | string)[]);
	constructor(values: ICommand<(number | string)[]> | ICommand<number | string> | number | string);
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.values = isCommand(args[0])
				? (args[0] as ICommand<(number | string)[]> | ICommand<number | string>)
				: (args as (number | string)[]);
		} else {
			this.values = args as (ICommand<number | string> | number | string)[];
		}
	}

	/**
	 * Validates the given operand based on the type guard.
	 * @param value The value to be validated.
	 * @param operandName The name of the operand being validated.
	 */
	private async validateOperand(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the function and returns the maximum value found.
	 * @param context The context data to be used during execution.
	 * @returns The maximum value found.
	 * @throws {ValueException} If an operand is not a valid number or string.
	 * @throws {Error} If an error occurs while evaluating the operands.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const operands = isCommand(this.values) ? await this.values.execute(context) : this.values;

		if (Array.isArray(operands)) {
			const result = await Promise.all(
				operands.map(async (operand, index) => {
					const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
					await this.validateOperand(toEvaluate, `operands[${index}]`);
					if (isNaN(Number(toEvaluate))) {
						throw new ValueException(`On ${this.id}. The value '${toEvaluate}' is not a valid number.`);
					}
					return Number(toEvaluate);
				})
			).catch((err) => {
				throw err;
			});

			return Math.max(...result);
		}

		await this.validateOperand(operands, 'operands');

		if (isNaN(Number(operands))) {
			throw new ValueException(`On ${this.id}. The value '${operands}' is not a valid number.`);
		}

		return Number(operands);
	}

	/**
	 * Returns a string representation of the function.
	 * @returns A string representation of the function.
	 */
	toString(): string {
		const str = isCommand(this.values) ? this.values.toString() : this.values.map((e) => e.toString()).join(`, `);
		return `${this.id}(${str})`;
	}
}
