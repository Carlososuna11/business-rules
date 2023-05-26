import IOperator from './IOperator';
import ICommand from '../ICommand';

export default class Or implements IOperator<boolean> {
	id = 'or';
	symbol = '||';

	operators: (ICommand<boolean> | boolean)[];
	constructor(...operators: (ICommand<boolean> | boolean)[]) {
		this.operators = operators;
	}

	execute(): boolean {
		return this.operators.some((operator) => {
			return typeof operator === 'boolean' ? operator : operator.execute();
		});
	}

	toString(): string {
		const str = this.operators
			.map((operator) => {
				return typeof operator === 'boolean' ? operator : operator.toString();
			})
			.join(` ${this.symbol} `);
		return `(${str})`;
	}
}
