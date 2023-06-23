/**
 * A class representing the Average Function.
 */
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Average implements IFunction<number> {
	/**
	 * The identifier of the Average function.
	 */
	id = 'average';

	/**
	 * An instance of TypeGuard to validate the type of operands.
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * The operands for the function.
	 */
	private operands:
		| (ICommand<number | string> | number | string)[]
		| ICommand<(number | string)[]>
		| ICommand<number | string>;

	/**
	 * Initializes a new instance of the Average class.
	 * @param operands The operands for the function.
	 */
	constructor(operands: ICommand<(number | string)[]> | number | string | ICommand<number | string>);

	/**
	 * Initializes a new instance of the Average class.
	 * @param operands The operands for the function.
	 */
	constructor(...operands: (ICommand<number | string> | number | string)[]);

	/**
	 * Initializes a new instance of the Average class.
	 * @param args The array of operands or the single operand for the function.
	 */
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.operands = isCommand(args[0])
				? (args[0] as ICommand<(number | string)[]> | ICommand<number | string>)
				: (args as (number | string)[]);
		} else {
			this.operands = args as (ICommand<number | string> | number | string)[];
		}
	}

	/**
	 * Validates if the value is of type number or string.
	 * @param value The value to validate.
	 * @param operandName The name of the operand to validate.
	 */
	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Validates if the list of values is of type number or string.
	 * @param value The list of values to validate.
	 * @param operandName The name of the operand to validate.
	 */
	private async validateListValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the Average function.
	 * @param context The context data for the function execution.
	 * @returns The average of the operands.
	 * @throws {ValueException} If the value is not a valid number.
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const operands = isCommand(this.operands) ? await this.operands.execute(context) : this.operands;

		if (Array.isArray(operands)) {
			const result = await Promise.all(
				operands.map(async (operand, index) => {
					const toEvaluate = isCommand(operand) ? await operand.execute(context) : operand;
					await this.validateValue(toEvaluate, `operands[${index}]`);

					if (isNaN(Number(toEvaluate))) {
						throw new ValueException(`On ${this.id} The value '${toEvaluate}' is not a valid number.`);
					}

					return Number(toEvaluate);
				})
			).catch((err) => {
				throw err;
			});

			return result.reduce((a, b) => a + b, 0) / result.length;
		}

		await this.validateListValue(operands, 'operands');

		if (isNaN(Number(operands))) {
			throw new ValueException(`On ${this.id}. The value '${operands}' is not a valid number.`);
		}

		return Number(operands);
	}

	/**
	 * Returns a string that represents the Average function.
	 * @returns A string that represents the Average function.
	 */
	toString(): string {
		const str = isCommand(this.operands) ? this.operands.toString() : this.operands.map((e) => e.toString()).join(`, `);
		return `${this.id}(${str})`;
	}
}
