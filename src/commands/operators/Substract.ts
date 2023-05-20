import { registerOperator } from '.';
import IOperator from '../../operators/IOperator';
import ICommand, { isCommand } from '../ICommand';

@registerOperator('substract')
export default class Substract implements IOperator<number | Date> {
	id = 'substract';
	symbol = '-';

	left: number | Date | ICommand<number | Date>;
	right: number | Date | ICommand<number | Date>;
	constructor(left: number | Date | ICommand<number | Date>, right: number | Date | ICommand<number | Date>) {
		this.left = left;
		this.right = right;
	}

	execute(): number | Date {
		let leftOperand = isCommand(this.left) ? this.left.execute() : this.left;
		let rightOperand = isCommand(this.right) ? this.right.execute() : this.right;

		if (this.left instanceof Date && this.right instanceof Date) {
			return new Date(this.left.getDate() - this.right.getDate());
			// } else if (this.left instanceof Date && typeof this.right === 'number') {
			//     return new Date(this.left.getTime() - this.right);
		} else if (typeof this.left === 'number' && typeof this.right === 'number') {
			return this.left - this.right;
		}
		throw new Error('Invalid operands, must be the same type');
	}
}

//TODO: Add operator.execute
