import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class Regex implements IFunction<boolean> {
	id = 'regex';
	typeGuard: TypeGuard = new TypeGuard(['string']);

	constructor(private readonly value: ICommand<string> | string, private readonly regex: ICommand<string> | string) {}

	private async validateValue(value: string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<boolean> {
		const stringValue = isCommand(this.value) ? await this.value.execute(context) : this.value;
		const regexValue = isCommand(this.regex) ? await this.regex.execute(context) : this.regex;

		await this.validateValue(stringValue, 'value');
		await this.validateValue(regexValue, 'regex');

		const regex = new RegExp(regexValue);

		return regex.test(stringValue);
	}

	toString(): string {
		return `${this.id}(${this.value.toString()}, ${this.regex.toString()})`;
	}
}
