import IFunction from './IFunction';
import ICommand, { isCommand } from '../ICommand';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class Lower implements IFunction<string> {
	id = 'lower';

	typeGuard: TypeGuard = new TypeGuard(['string']);
	constructor(private readonly value: ICommand<string> | string) {}

	private async validateValue(value: string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<string> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		await this.validateValue(transformedValue, 'value');

		return transformedValue.toLowerCase();
	}

	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
