import IData from './IData';
import { Data } from '../types';

export default class Set implements IData<void> {
	constructor(private object: Data, private key: string, private value: unknown) {}

	execute(): void {
		const keys = this.key.split('.');
		if (!keys.length) return undefined;
		if (!Object.entries(this.object).length) return undefined;

		let value = this.object;
		for (const key of keys) {
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
				valueArray[index] = this.value;
				return;
			}
			if (typeof value[propertyKey] === 'object') {
				value = value[propertyKey] as Data;
				continue;
			}
			value[propertyKey] = this.value;
			return;
		}
	}
}
