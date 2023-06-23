import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import { ValueException } from '../../exceptions';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class StandardDesviation implements IFunction<number> {
	/**
	 * The id of the function.
	 */
	id = 'standardDesviation';

	/**
	 * The TypeGuard instance used to validate the types of the operands.
	 */
	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);

	/**
	 * The values to be used as operands in the function execution.
	 */
	private readonly values:
		| (ICommand<number | string> | number | string)[]
		| ICommand<(number | string)[]>
		| ICommand<number | string>;

	/**
	 * Creates an instance of StandardDesviation.
	 * @param {...((ICommand<number | string> | number | string)[])} values The values to be used as operands in the function execution.
	 * @memberof StandardDesviation
	 */
	constructor(...values: (ICommand<number | string> | number | string)[]);
	/**
	 * Creates an instance of StandardDesviation.
	 * @param {(ICommand<(number | string)[]> | ICommand<number | string> | number | string)} values The values to be used as operands in the function execution.
	 * @memberof StandardDesviation
	 */
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
	 * Validates a single operand to ensure it is a number or a string.
	 *
	 * @private
	 * @param {(number | string)} value The value to be validated.
	 * @param {string} operandName The name of the operand being validated.
	 * @memberof StandardDesviation
	 */
	private async validateOperand(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the standard deviation function with the provided operands and returns the result.
	 *
	 * @param {AbstractContextData} context The context data to be used during the execution.
	 * @returns {Promise<number>} The result of the standard deviation function execution.
	 * @memberof StandardDesviation
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

			const average = result.reduce((a, b) => a + b, 0) / result.length;
			const sum = result.reduce((a, b) => a + Math.pow(b - average, 2), 0);
			return Math.sqrt(sum / result.length);
		}

		await this.validateOperand(operands, 'operands');

		if (isNaN(Number(operands))) {
			throw new ValueException(`On ${this.id}. The value '${operands}' is not a valid number.`);
		}

		// the standard desviation of a number is 0
		return 0;
	}

	/**
	 * Returns a string representation of the standard deviation function with the provided operands.
	 *
	 * @returns {string} The string representation of the function.
	 * @memberof StandardDesviation
	 */
	toString(): string {
		const str = isCommand(this.values) ? this.values.toString() : this.values.map((e) => e.toString()).join(`, `);
		return `${this.id}(${str})`;
	}
}
