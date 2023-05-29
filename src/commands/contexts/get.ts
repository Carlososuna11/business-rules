import IContext from './IContext';
import { AbstractContextData } from '../../context';
import { Data } from '../../types';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';

export default class Get implements IContext<unknown> {
	id = 'get';

	private typeGuard: TypeGuard = new TypeGuard(['string']);

	constructor(private readonly key: ICommand<string> | string) {}

	private async validateOperand(value: string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<unknown> {
		const data = context.getContextData();
		const key = isCommand(this.key) ? await this.key.execute(context) : this.key;
		await this.validateOperand(key, 'key');
		const keys = key.split('.');
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

	toString(): string {
		return `${this.key}`;
	}
}
