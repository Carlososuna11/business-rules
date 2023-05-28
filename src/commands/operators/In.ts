import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';
import { TypeGuard } from '../../utils';

export default class In implements IOperator<boolean> {
	symbol = 'IN';
	id = 'in';

	objectTypeGuard: TypeGuard = new TypeGuard(['object']);
	propertyTypeGuard: TypeGuard = new TypeGuard(['string']);

	private object: Record<string, unknown> | ICommand<Record<string, unknown>>;
	private property: string | ICommand<string>;

	constructor(
		object: Record<string, unknown> | ICommand<Record<string, unknown>>,
		property: string | ICommand<string>
	) {
		this.object = object;
		this.property = property;
	}

	private validateObjectOperand(value: Record<string, unknown>, operandName: string): void {
		this.objectTypeGuard.evaluate(value, this.id, operandName);
	}

	private validatePropertyOperand(value: string, operandName: string): void {
		this.propertyTypeGuard.evaluate(value, this.id, operandName);
	}

	execute(): boolean {
		const object = isCommand(this.object) ? this.object.execute() : this.object;
		this.validateObjectOperand(object, 'object');
		const property = isCommand(this.property) ? this.property.execute() : this.property;
		this.validatePropertyOperand(property, 'property');

		return property in object;
	}

	toString(): string {
		return `${isCommand(this.object) ? this.object.toString() : String(this.object)} ${this.symbol} ${
			isCommand(this.property) ? this.property.toString() : String(this.property)
		}`;
	}
}
