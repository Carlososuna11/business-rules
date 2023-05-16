import IOperator from './IOperator';

export default class Or implements IOperator<boolean> {
	operators: (IOperator<boolean> | boolean)[];
	constructor(...operators: (IOperator<boolean> | boolean)[]) {
		this.operators = operators;
	}

	public execute(): boolean {
		return this.operators.some((operator) => {
			return typeof operator === 'boolean' ? operator : operator.execute();
		});
	}
}
