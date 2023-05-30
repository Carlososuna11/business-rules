import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';
import { AbstractContextData } from '../../context';

export default class IsNull implements IOperator<boolean> {
	id = 'isNull';
	symbol = 'is Null';
	constructor(public operator: ICommand<unknown> | unknown) {}

	async execute(context: AbstractContextData): Promise<boolean> {
		const value = isCommand(this.operator) ? await this.operator.execute(context) : this.operator;
		return value === null || value === undefined;
	}

	toString(): string {
		return `${isCommand(this.operator) ? this.operator.toString() : String(this.operator)} ${this.symbol}`;
	}
}
