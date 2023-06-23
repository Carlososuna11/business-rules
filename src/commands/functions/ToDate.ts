/**
 * Implementation of IFunction interface that converts a string to a Date object
 * @implements {IFunction<Date>}
 */
import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand from '../ICommand';
import IFunction from './IFunction';
import moment from 'moment';

export default class ToDate implements IFunction<Date> {
	/**
	 * Identifier of the ToDate function
	 */
	id = 'toDate';

	/**
	 * The value to be converted to a Date object
	 * @type {ICommand<string> | string}
	 * @private
	 */
	private readonly dateValue: ICommand<string> | string;

	/**
	 * The pattern of the input value
	 * @type {string}
	 * @private
	 */
	private readonly datePattern: string;

	/**
	 * Creates a ToDate function
	 * @param {ICommand<string> | string} dateValue - The value to be converted to a Date object
	 * @param {string} datePattern - The pattern of the input value
	 */
	constructor(dateValue: ICommand<string> | string, datePattern: string) {
		this.dateValue = dateValue;
		this.datePattern = datePattern;
	}

	/**
	 * Type guard instance used to validate the input value
	 * @type {TypeGuard}
	 */
	typeGuard: TypeGuard = new TypeGuard(['string']);

	/**
	 * Validates the input value
	 * @param {string} value - The value to be validated
	 * @param {string} operandName - The name of the operand to be validated
	 * @returns {Promise<void>}
	 * @private
	 */
	private async validateValue(value: string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Converts the input value to a Date object
	 * @param {AbstractContextData} context - The context object
	 * @returns {Promise<Date>} - The resulting Date object
	 */
	async execute(context: AbstractContextData): Promise<Date> {
		const dateValue = typeof this.dateValue === 'string' ? this.dateValue : await this.dateValue.execute(context);

		await this.validateValue(dateValue, 'dateValue');

		const date = moment(dateValue, this.datePattern).toDate();

		return date;
	}

	/**
	 * Returns a string representation of the ToDate function
	 * @returns {string}
	 */
	toString(): string {
		return `${this.id}(${this.dateValue.toString()}, '${this.datePattern}')`;
	}
}
