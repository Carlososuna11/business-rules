import { AbstractContextData } from '../../context';
import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IFunction from './IFunction';

export default class BoolToNumber implements IFunction<number> {
	id = 'boolToNumber';

	typeGuard: TypeGuard = new TypeGuard(['boolean']);

	constructor(private readonly value: ICommand<boolean> | boolean) {}

	private async validateValue(value: boolean, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<number> {
		const transformedValue = isCommand(this.value) ? await this.value.execute(context) : this.value;

		await this.validateValue(transformedValue, 'value');

		return transformedValue ? 1 : 0;
	}

	toString(): string {
		return `${this.id}(${this.value.toString()})`;
	}
}
