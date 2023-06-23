import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { AbstractContextData } from '../../context';

/**
 * Represents the IsNull operator that checks if a value is null or undefined.
 */
export default class IsNull implements IOperator<boolean> {
	/**
	 * The unique identifier of the operator.
	 */
	id = 'isNull';

	/**
	 * The string symbol that represents the operator.
	 */
	symbol = 'is Null';

	/**
	 * Initializes a new instance of the IsNull class.
	 * @param operator The value to check for null or undefined.
	 */
	constructor(public operator: ICommand<unknown> | unknown) {}

	/**
	 * Executes the IsNull operator.
	 * @param context The context data to use during execution.
	 * @returns A boolean indicating if the value is null or undefined.
	 */
	async execute(context: AbstractContextData): Promise<boolean> {
		const value = isCommand(this.operator) ? await this.operator.execute(context) : this.operator;
		return value === null || value === undefined;
	}

	/**
	 * Returns a string representation of the IsNull operator.
	 * @returns A string representation of the IsNull operator.
	 */
	toString(): string {
		return `${isCommand(this.operator) ? this.operator.toString() : String(this.operator)} ${this.symbol}`;
	}
}
