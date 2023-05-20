import { registerOperator } from '.';
import ICommand from '../ICommand';
import IOperator from './IOperator';

@registerOperator('lessThan')
export default class LessThan implements IOperator<boolean> {
	symbol = '<';
	id= 'lessThan';

	left: number | ICommand<number>;
	right: number | ICommand<number>;
	constructor(left: number | ICommand<number>, right: number | ICommand<number>) {
		this.left = left;
		this.right = right;
	}
	execute(): boolean {

		let leftOperand = typeof this.left === 'number' ? this.left : this.left.execute();
		let rightOperand = typeof this.right === 'number' ? this.right : this.right.execute();


		return leftOperand < rightOperand;
	}
}
