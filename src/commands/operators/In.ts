import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';
import { TypeGuard } from '../../utils';
import { AbstractContextData } from '../../context';

export default class In implements IOperator<boolean> {
	symbol = 'IN';
	id = 'in';

	objectTypeGuard: TypeGuard = new TypeGuard(['object']);
	propertyTypeGuard: TypeGuard = new TypeGuard(['string']);

	private object: Record<string, unknown> | ICommand<Record<string, unknown>>;
	private property: string | ICommand<string>;

	constructor(
		property: string | ICommand<string>,
		object: Record<string, unknown> | ICommand<Record<string, unknown>>
	) {
		this.object = object;
		this.property = property;
	}

	private async validateObjectOperand(value: Record<string, unknown>, operandName: string): Promise<void> {
		await this.objectTypeGuard.evaluate(value, this.id, operandName);
	}

	private async validatePropertyOperand(value: string, operandName: string): Promise<void> {
		await this.propertyTypeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<boolean> {
		const object = isCommand(this.object) ? await this.object.execute(context) : this.object;
		await this.validateObjectOperand(object, 'object');

		const property = isCommand(this.property) ? await this.property.execute(context) : this.property;
		await this.validatePropertyOperand(property, 'property');

		return property in object;
	}

	toString(): string {
		return `${isCommand(this.object) ? this.object.toString() : String(this.object)} ${this.symbol} ${
			isCommand(this.property) ? this.property.toString() : String(this.property)
		}`;
	}
}
