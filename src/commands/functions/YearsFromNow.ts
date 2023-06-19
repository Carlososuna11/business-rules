import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class YearsFromNow implements IFunction<number> {
	id = 'yearsFromNow';
	typeGuard: TypeGuard = new TypeGuard(['date']);

	constructor(private readonly date: ICommand<Date> | Date) {}

	private async validateValue(value: Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<number> {
		const evaluatedDate = isCommand(this.date) ? await this.date.execute(context) : this.date;

		await this.validateValue(evaluatedDate, 'date');

		const today = new Date();
		const diffTime = Math.abs(today.getTime() - evaluatedDate.getTime());
		console.log('Diff es:', diffTime);
		const diffYears = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));

		return diffYears;
	}

	toString(): string {
		return `${this.id}(${this.date.toString()})`;
	}
}
