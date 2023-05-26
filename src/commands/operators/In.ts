import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class In<T> implements IOperator<boolean> {
	symbol = 'IN';
	id = 'in';

	object: Record<string, T> | ICommand<Record<string, T>>;
	property: string | ICommand<string>;

	constructor(object: Record<string, T> | ICommand<Record<string, T>>, property: string | ICommand<string>) {
		this.object = object;
		this.property = property;
	}

	execute(): boolean {
		const object = isCommand(this.object) ? this.object.execute() : this.object;
		const property = isCommand(this.property) ? this.property.execute() : this.property;

		return property in object;
	}

	toString(): string {
		return `${isCommand(this.object) ? this.object.toString() : String(this.object)} ${this.symbol} ${
			isCommand(this.property) ? this.property.toString() : String(this.property)
		}`;
	}
}
