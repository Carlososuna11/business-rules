/**
 * Represents a command that sets a value in the context data.
 * @implements {IContext<void>}
 */
import IContext from './IContext';
import { Data } from '../../types';
import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import { BusinessRulesException } from '../../exceptions';

export default class Set implements IContext<void> {
	/**
	 * The unique identifier of the Set command.
	 */
	id = 'set';

	/**
	 * Creates an instance of Set.
	 * @param {string} key - The key representing the location in the context data where the value will be set.
	 * @param {ICommand<unknown> | unknown} value - The value to be set in the context data at the specified location.
	 */
	constructor(private key: string, private value: ICommand<unknown> | unknown) {}

	/**
	 * Executes the Set command by setting the specified value in the context data at the specified location.
	 * @param {AbstractContextData} context - The context data where the value will be set.
	 * @returns {Promise<void>} A Promise that resolves when the value has been set in the context data.
	 */
	async execute(context: AbstractContextData): Promise<void> {
		const data = context.getContextData();
		const keys = this.key.split('.');
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

			if (index !== undefined) {
				if (!Array.isArray(value[propertyKey])) {
					throw new BusinessRulesException(`Cannot access index ${index} of ${propertyKey}`);
				}
				const valueArray = value[propertyKey] as unknown[];
				if (valueArray.length <= index) {
					throw new BusinessRulesException(`Index ${index} of ${propertyKey} is out of bounds`);
				}
				if (i === keys.length - 1) {
					valueArray[index] = isCommand(this.value) ? await this.value.execute(context) : this.value;
					return;
				}
				value = valueArray[index] as Data;
				continue;
			}
			if (i === keys.length - 1) {
				value[propertyKey] = isCommand(this.value) ? await this.value.execute(context) : this.value;
				return;
			}
			value = value[propertyKey] as Data;
		}
	}

	/**
	 * Returns a string representation of the Set command.
	 * @returns {string} A string representation of the Set command.
	 */
	toString(): string {
		return `${this.key} := ${isCommand(this.value) ? this.value.toString() : this.value}`;
	}
}
