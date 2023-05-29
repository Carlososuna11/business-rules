import IContext from './IContext';
import { Data } from '../../types';
import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';

export default class Set implements IContext<void> {
	id = 'set';
	constructor(private key: string, private value: ICommand<unknown> | unknown) {}

	async execute(context: AbstractContextData): Promise<void> {
		const data = context.getContextData();
		const keys = this.key.split('.');
		if (!keys.length) return undefined;
		if (!Object.entries(data).length) return undefined;

		let value = data;
		for (const key of keys) {
			const indexMatch = key.match(/[(\d+)]/);
			let propertyKey = key;
			let index: number | undefined = undefined;
			if (indexMatch) {
				index = Number(indexMatch[0]);
				propertyKey = key.replace(`[${indexMatch[0]}]`, '');
			}

			if (index !== undefined) {
				if (!Array.isArray(value[propertyKey])) {
					throw new Error(`Cannot access index ${index} of ${propertyKey}`);
				}
				const valueArray = value[propertyKey] as unknown[];
				if (valueArray.length <= index) {
					throw new Error(`Index ${index} of ${propertyKey} is out of bounds`);
				}
				if (typeof valueArray[index] === 'object') {
					value = valueArray[index] as Data;
					continue;
				}
				valueArray[index] = isCommand(this.value) ? await this.value.execute(context) : this.value;
				return;
			}
			if (typeof value[propertyKey] === 'object') {
				value = value[propertyKey] as Data;
				continue;
			}
			value[propertyKey] = isCommand(this.value) ? await this.value.execute(context) : this.value;
			return;
		}
	}

	toString(): string {
		return `${this.key} = ${isCommand(this.value) ? this.value.toString() : this.value}`;
	}
}
