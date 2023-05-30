import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Between implements IOperator<boolean> {
	symbol = 'between';
	id = 'between';

	typeGuard: TypeGuard = new TypeGuard(['number', 'string', 'date']);
	value: number | string | Date | ICommand<number | string | Date>;
	minValue: number | string | Date | ICommand<number | string | Date>;
	maxValue: number | string | Date | ICommand<number | string | Date>;

	constructor(
		value: number | string | Date | ICommand<number | string | Date>,
		minValue: number | string | Date | ICommand<number | string | Date>,
		maxValue: number | string | Date | ICommand<number | string | Date>
	) {
		this.value = value;
		this.minValue = minValue;
		this.maxValue = maxValue;
	}

	private async validateValue(value: number | string | Date, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<boolean> {
		const val = isCommand(this.value) ? await this.value.execute(context) : this.value;
		await this.validateValue(val, 'value');

		const min = isCommand(this.minValue) ? await this.minValue.execute(context) : this.minValue;
		await this.validateValue(min, 'minValue');

		const max = isCommand(this.maxValue) ? await this.maxValue.execute(context) : this.maxValue;
		await this.validateValue(max, 'maxValue');

		return val >= min && val <= max;
	}

	toString(): string {
		return `${isCommand(this.value) ? this.value.toString() : this.value} ${this.symbol} (${
			isCommand(this.minValue) ? this.minValue.toString() : this.minValue
		} and ${isCommand(this.maxValue) ? this.maxValue.toString() : this.maxValue})`;
	}
}
