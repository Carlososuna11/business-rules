import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Length implements IFunction<number> {
	id = 'length';
	constructor(private readonly values: (ICommand<unknown> | unknown)[]) {}

	async execute(context: AbstractContextData): Promise<number> {
		const transformedValues = await Promise.all(
			this.values.map(async (value) => (isCommand(value) ? await value.execute(context) : value))
		);

		return transformedValues.length;
	}

	toString(): string {
		return `${this.id}(${this.values.map((value) => (isCommand(value) ? value.toString() : value)).join(', ')})`;
	}
}
