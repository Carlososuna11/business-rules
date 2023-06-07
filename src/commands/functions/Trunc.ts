import { AbstractContextData } from '../../context';
import { ValueException } from '../../exceptions';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Trunc implements IFunction<number> {
	id = 'trunc';

	typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	constructor(private readonly value: ICommand<number | string> | number | string) {}

	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<number> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		await this.validateValue(transformedValue, 'value');

		if (isNaN(Number(transformedValue))) {
			throw new ValueException(`On ${this.id}. Value must be a number or a string representing a number`);
		}
		return Math.trunc(Number(transformedValue));
	}

	toString(): string {
		return `${this.id}(${isCommand(this.value) ? this.value.toString() : String(this.value)})`;
	}
}
