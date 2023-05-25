import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';

export default class IsNull implements IOperator<boolean> {
	id = 'isNull';
	symbol = 'isNull';

	operator: ICommand<unknown> | unknown;
	constructor(operator: ICommand<unknown> | unknown) {
		this.operator = operator;
	}

	execute(): boolean {
		return isCommand(this.operator)
			? this.operator.execute() === null || this.operator.execute() === undefined
			: this.operator === null || this.operator === undefined;
	}
}
