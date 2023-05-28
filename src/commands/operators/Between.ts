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

	private validateValue(value: number | string | Date, operandName: string): void {
		this.typeGuard.evaluate(value, this.id, operandName);
	}


	execute(): boolean {
		const val = isCommand(this.value) ? this.value.execute() : this.value;
		this.validateValue(val, 'value');

		const min = isCommand(this.minValue) ? this.minValue.execute() : this.minValue;
		this.validateValue(min, 'minValue');

		const max = isCommand(this.maxValue) ? this.maxValue.execute() : this.maxValue;
		this.validateValue(max, 'maxValue');

		return val >= min && val <= max;
	}

	toString(): string {
		return `${isCommand(this.value) ? this.value.toString() : this.value} ${this.symbol} (${
			isCommand(this.minValue) ? this.minValue.toString() : this.minValue
		} and ${isCommand(this.maxValue) ? this.maxValue.toString() : this.maxValue})`;
	}
}
