import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Between<T> implements IOperator<boolean> {
	symbol = 'between';
	id = 'between';

	value: T | ICommand<T>;
	minValue: T | ICommand<T>;
	maxValue: T | ICommand<T>;

	constructor(value: T | ICommand<T>, minValue: T | ICommand<T>, maxValue: T | ICommand<T>) {
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
}
