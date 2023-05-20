import IContext from './IContext';
import { Data } from '../../types';
import { registerContextMethod } from './index';

@registerContextMethod('get')
export default class Get implements IContext<unknown> {
	id = 'get';

	constructor(private readonly object: Data, private readonly key: string) {}

	execute(): unknown {
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
				return valueArray[index];
			}
			if (typeof value[propertyKey] === 'object') {
				value = value[propertyKey] as Data;
				continue;
			}
			return value[propertyKey];
		}
	}
}
