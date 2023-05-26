import IOperator from './IOperator';
import ICommand from '../ICommand';

export default class And implements IOperator<boolean> {
	id = 'and';
	symbol = '&&';

	operators: (ICommand<boolean> | boolean)[];
	constructor(...operators: (ICommand<boolean> | boolean)[]) {
		this.operators = operators;
	}

	execute(): boolean {
		return this.operators.every((operator) => {
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
