import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';

export default class IsNull implements IOperator<boolean> {
	id = 'isNull';
	symbol = 'isNull';

	operators: (ICommand<unknown> | unknown)[];
	constructor(...operators: (ICommand<unknown> | unknown)[]) {
		this.operators = operators;
	}

	execute(): boolean {
		return this.operators.some((operator) => {
			if (isCommand(operator)) {
				const value = operator.execute();
				return value === null || value === undefined;
			}
			return operator === null || operator === undefined;
		});
	}
}
