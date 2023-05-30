import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand from '../ICommand';
import IFunction from './IFunction';

export default class ParseFloat implements IFunction<number> {
	id = 'parseFloat';

	typeGuard: TypeGuard = new TypeGuard(['string']);
	constructor(private readonly value: ICommand<string> | string) {}

	private async validateValue(value: string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<number> {
		const stringValue = typeof this.value === 'string' ? this.value : await this.value.execute(context);

		await this.validateValue(stringValue, 'value');

		return parseFloat(stringValue);
	}

	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
