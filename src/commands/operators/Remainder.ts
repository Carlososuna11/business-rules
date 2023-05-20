import { registerOperator } from '.';
import ICommand from '../ICommand';
import IOperator from './IOperator';

@registerOperator('remainder')
export default class Remainder implements IOperator<number> {
	id = 'remainder';
	symbol = '%';

	left: number | ICommand<number>;
	right: number | ICommand<number>;
	constructor(left: number | ICommand<number>, right: number | ICommand<number>) {
		this.left = left;
		this.right = right;
	}
	execute(): number {
		let rightOperand = typeof this.right === 'number' ? this.right : this.right.execute();
		let leftOperand = typeof this.left === 'number' ? this.left : this.left.execute();
		return leftOperand % rightOperand;
	}
}
