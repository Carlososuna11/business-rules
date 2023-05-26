import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

// TODO: remove and use RegExp instead
export default class Like implements IOperator<boolean> {
	id = 'like';
	symbol = 'LIKE';

	expression: string | ICommand<string>;
	pattern: string | ICommand<string>;
	position: 'BEGIN' | 'END' | 'ANY';

	constructor(
		expression: string | ICommand<string>,
		pattern: string | ICommand<string>,
		position: 'BEGIN' | 'END' | 'ANY'
	) {
		this.expression = expression;
		this.pattern = pattern;
		this.position = position;
	}

	execute(): boolean {
		const expression = isCommand(this.expression) ? this.expression.execute() : this.expression;
		const pattern = isCommand(this.pattern) ? this.pattern.execute() : this.pattern;

		switch (this.position) {
			case 'BEGIN':
				return expression.startsWith(pattern);
			case 'END':
				return expression.endsWith(pattern);
			case 'ANY':
				return expression.match(pattern) !== null;
			default:
				throw new Error('Invalid position');
		}
	}
}
