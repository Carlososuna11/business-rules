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
		for (let i = 0; i < keys.length; i++) {
			const key = keys[i];
			const indexMatch = key.match(/[(\d+)]/);
			let propertyKey = key;
			let index: number | undefined = undefined;
			if (indexMatch) {
				index = Number(indexMatch[0]);
				propertyKey = key.replace(`[${indexMatch[0]}]`, '');
			}

			console.log('AQUIIIIIIII:',{ propertyKey, index });

			if (value[propertyKey] === undefined) return undefined;

			if (index !== undefined) {
				if (!Array.isArray(value[propertyKey])) {
					throw new Error(`Cannot access index ${index} of ${propertyKey}`);
				}
				const valueArray = value[propertyKey] as unknown[];
				if (valueArray.length <= index) {
					throw new Error(`Index ${index} of ${propertyKey} is out of bounds`);
				}
				if (i === keys.length - 1) return valueArray[index];
				value = valueArray[index] as Data;
				continue;
			}

			if (i === keys.length - 1) return value[propertyKey];
			value = value[propertyKey] as Data;
		}
	}

	toString(): string {
		return `${this.key}`;
	}
}
