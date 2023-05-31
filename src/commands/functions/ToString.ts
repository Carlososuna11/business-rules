import { AbstractContextData } from '../../context';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class ToString implements IFunction<string> {
	id = 'toString';

	constructor(private readonly value: ICommand<unknown> | unknown) {}

	async execute(context: AbstractContextData): Promise<string> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		const stringValue = transformedValue as string;

		return stringValue.toString();
	}

	toString(): string {
		const transformedValue = isCommand(this.value) ? this.value.toString() : String(this.value);
		return `${this.id}(${transformedValue.toString()})`;
	}
}
