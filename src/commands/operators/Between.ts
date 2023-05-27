import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Between implements IOperator<boolean> {
	symbol = 'between';
	id = 'between';

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

	execute(): boolean {
		const val = isCommand(this.value) ? this.value.execute() : this.value;
		const min = isCommand(this.minValue) ? this.minValue.execute() : this.minValue;
		const max = isCommand(this.maxValue) ? this.maxValue.execute() : this.maxValue;

		return val >= min && val <= max;
	}

	toString(): string {
		return `${isCommand(this.value) ? this.value.toString() : this.value} ${this.symbol} (${
			isCommand(this.minValue) ? this.minValue.toString() : this.minValue
		} and ${isCommand(this.maxValue) ? this.maxValue.toString() : this.maxValue})`;
	}
}
