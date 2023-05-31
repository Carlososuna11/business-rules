import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import { IFunction } from '.';

export default class ToBoolean implements IFunction<boolean> {
	id = 'toBoolean';

	private typeGuard: TypeGuard = new TypeGuard(['string', 'number']);

	value: number | string | ICommand<number | string>;

	constructor(value: number | string | ICommand<number | string>) {
		this.value = value;
	}

	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<boolean> {
		const operand = isCommand(this.value) ? await this.value.execute(context) : this.value;
		await this.validateValue(operand, 'value');
		return !!operand;
	}

	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
