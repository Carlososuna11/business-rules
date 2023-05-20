import ICommand from '../ICommand';
import IOperator from './IOperator';

export default class Not implements IOperator<boolean> {
	symbol = '!';
	id = 'not';

	operators: (boolean | ICommand<boolean>)[];
	constructor(...operators: (boolean | ICommand<boolean>)[]) {
		this.operators = operators;
	}

	public execute(): boolean {
		return this.operators.every((operator) => {
			return typeof operator === 'boolean' ? !operator : !operator.execute();
		});
	}
}
