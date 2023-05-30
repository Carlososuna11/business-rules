import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class MinDate implements IFunction<Date> {
	id = 'minDate';

	typeGuard: TypeGuard = new TypeGuard(['date']);
	private readonly values: (ICommand<Date> | Date)[] | ICommand<Date[]>;

	constructor(...values: (ICommand<Date> | Date)[]);
	constructor(values: ICommand<Date[]>);
	constructor(...args: unknown[]) {
		if (args.length === 1) {
			this.values = args[0] as ICommand<Date[]>;
		} else {
			this.values = args as (ICommand<Date> | Date)[];
		}
	}

	private async validateValue(value: Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<Date> {
		const values = isCommand(this.values) ? await this.values.execute(context) : this.values;

		const result = await Promise.all(
			values.map(async (value, index) => {
				const toEvaluate = isCommand(value) ? await value.execute(context) : value;
				await this.validateValue(toEvaluate, `values[${index}]`);
				return toEvaluate.getTime();
			})
		).catch((err) => {
			throw err;
		});

		return new Date(Math.min(...result));
	}

	toString(): string {
		const str = isCommand(this.values) ? this.values.toString() : this.values.map((e) => e.toString()).join(`, `);
		return `${this.id}(${str})`;
	}
}
