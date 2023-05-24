import IContext from './IContext';
import { Data } from '../../types';
import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';

export default class Set<T extends AbstractContextData> implements IContext<void> {
	id = 'set';
	constructor(private contextData: T, private key: string, private value: ICommand<unknown> | unknown) {}

	execute(): void {
		const context: Data = this.contextData.getContextData();
		const keys = this.key.split('.');
		if (!keys.length) return undefined;
		if (!Object.entries(context).length) return undefined;

		let value = context;
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
				valueArray[index] = isCommand(this.value) ? this.value.execute() : this.value;
				return;
			}
			if (typeof value[propertyKey] === 'object') {
				value = value[propertyKey] as Data;
				continue;
			}
			value[propertyKey] = isCommand(this.value) ? this.value.execute() : this.value;
			return;
		}
	}
}
