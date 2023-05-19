import IData from './IData';
import { Data } from '../types';

export default class Get implements IData<unknown> {
	/*
    get a value from object,
    the object is passed as the first argument
    the key is passed as the second argument

    example:
    {
        "$data.get": [
            "user.name[0].first"
        ]
    }

    will return the value of user.name

    if the key is not found, it will return undefined
    if the key is found but the value is undefined, it will return null
   */

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
