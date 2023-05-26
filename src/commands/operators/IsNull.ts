import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';

export default class IsNull implements IOperator<boolean> {
	id = 'isNull';
	symbol = 'is Null';
	constructor(public operator: ICommand<unknown> | unknown) {}

	execute(): boolean {
		const value = isCommand(this.operator) ? this.operator.execute() : this.operator;
		return value === null || value === undefined;
	}

	toString(): string {
		return `${isCommand(this.operator) ? this.operator.toString() : String(this.operator)} ${this.symbol}`;
	}
}
