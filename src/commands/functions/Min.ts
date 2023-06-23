/**
 * Represents the Min function which implements the IFunction interface
 */
import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Min implements IFunction<number> {
	/**
	 * The ID of the Min function
	 */
	id = 'min';

	/**
	 * An instance of TypeGuard class
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * An array of operands to be used in the Min function
	 */
	private readonly operands:
		| (ICommand<number | string> | number | string)[]
		| ICommand<(number | string)[]>
		| ICommand<number | string>;

	/**
	 * Creates an instance of the Min class.
	 * @param operands An array of operands to be used in the Min function
	 */
	constructor(...operands: (ICommand<number | string> | number | string)[]);
	/**
	 * Creates an instance of the Min class.
	 * @param operands An array of operands to be used in the Min function
	 */
	constructor(operands: ICommand<(number | string)[]> | ICommand<number | string> | number | string);
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
	 * Validates if the given operand is a valid number or string.
	 * @param value The operand to be validated
	 * @param operandName The name of the operand being validated
	 */
	private async validateOperand(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the Min function and returns the minimum value.
	 * @param context The context object
	 * @returns The minimum value of the operands
	 * @throws {ValueException} If the operand is not a valid number
	 */
	async execute(context: AbstractContextData): Promise<number> {
		const operands = isCommand(this.operands) ? await this.operands.execute(context) : this.operands;

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

			return Math.min(...result);
		}

		await this.validateOperand(operands, 'operands');

		if (isNaN(Number(operands))) {
			throw new ValueException(`On ${this.id}. The value '${operands}' is not a valid number.`);
		}

		return Number(operands);
	}

	/**
	 * Returns the string representation of the Min function.
	 * @returns The string representation of the Min function
	 */
	toString(): string {
		const str = isCommand(this.operands) ? this.operands.toString() : this.operands.map((e) => e.toString()).join(`, `);
		return `${this.id}(${str})`;
	}
}
