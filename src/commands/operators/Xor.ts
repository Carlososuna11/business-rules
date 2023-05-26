import IOperator from './IOperator';
import ICommand, { isCommand } from '../ICommand';

export default class Xor implements IOperator<boolean> {
	id = 'xor';
	symbol = '^';

	operators: (ICommand<boolean> | boolean)[];
	constructor(...operators: (ICommand<boolean> | boolean)[]) {
		this.operators = operators;
	}

	execute(): boolean {
		return (
			this.operators.reduce((prev, curr) => {
				const previous = isCommand(prev) ? prev.execute() : prev;
				const current = isCommand(curr) ? curr.execute() : curr;

				return previous !== current;
			}) != false
		);
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
