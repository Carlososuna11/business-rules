import IContext from './IContext';
import { AbstractContextData } from '../../context';
import { Data } from '../../types';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { BusinessRulesException } from '../../exceptions';

export default class Get implements IContext<unknown> {
	/**
	 * Identifier of the Get context
	 */
	id = 'get';

	private typeGuard: TypeGuard = new TypeGuard(['string']);

	/**
	 * Creates a new instance of the Get context
	 * @param {ICommand<string> | string} key - The key to be retrieved from the context data
	 */
	constructor(private readonly key: ICommand<string> | string) {}

	/**
	 * Validates that the operand is a string
	 * @param {string} value - The value to be validated
	 * @param {string} operandName - The name of the operand
	 * @returns {Promise<void>}
	 */
	private async validateOperand(value: string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	/**
	 * Executes the Get context
	 * @param {AbstractContextData} context - The context data
	 * @returns {Promise<unknown>} - The value retrieved from the context data
	 */
	async execute(context: AbstractContextData): Promise<unknown> {
		const data = context.getContextData();
		const key = isCommand(this.key) ? await this.key.execute(context) : this.key;
		await this.validateOperand(key, 'key');
		const keys = key.split('.');
		if (!keys.length) return undefined;
		if (!Object.entries(data).length) return undefined;

		let value = data;
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const indexMatch = key.match(/[(\d+)]/);
			let propertyKey = key;
			let index: number | undefined = undefined;
			if (indexMatch) {
				index = Number(indexMatch[0]);
				propertyKey = key.replace(`[${indexMatch[0]}]`, '');
			}

			if (value[propertyKey] === undefined) return undefined;

			if (index !== undefined) {
				if (!Array.isArray(value[propertyKey])) {
					throw new BusinessRulesException(`Cannot access index ${index} of ${propertyKey}`);
				}
				const valueArray = value[propertyKey] as unknown[];
				if (valueArray.length <= index) {
					throw new BusinessRulesException(`Index ${index} of ${propertyKey} is out of bounds`);
				}
				if (i === keys.length - 1) return valueArray[index];
				value = valueArray[index] as Data;
				continue;
			}

			if (i === keys.length - 1) return value[propertyKey];
			value = value[propertyKey] as Data;
		}
	}

	/**
	 * Returns the string representation of the Get context
	 * @returns {string} - The string representation of the key
	 */
	toString(): string {
		return `${this.key}`;
	}
}
