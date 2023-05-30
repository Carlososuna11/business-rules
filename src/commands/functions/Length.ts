import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Length implements IFunction<number> {
	id = 'length';

	private readonly values: (ICommand<unknown> | unknown)[] | ICommand<unknown[]> | unknown[];

	constructor(...values: (ICommand<unknown> | unknown)[]);
	constructor(values: ICommand<unknown[]>);
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.values = args[0] as ICommand<unknown[]>;
		} else {
			this.values = args as (ICommand<unknown> | unknown)[];
		}
	}

	async execute(context: AbstractContextData): Promise<number> {
		const values = isCommand(this.values) ? await this.values.execute(context) : this.values;

		const transformedValues = await Promise.all(
			values.map(async (value) => (isCommand(value) ? await value.execute(context) : value))
		);

		return transformedValues.length;
	}

	toString(): string {
		const str = isCommand(this.values)
			? this.values.toString()
			: this.values.map((e) => (isCommand(e) ? e.toString() : String(e))).join(`, `);
		return `${this.id}(${str})`;
	}
}
