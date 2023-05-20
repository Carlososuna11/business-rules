import { registerOperator } from '.';
import ICommand from '../ICommand';
import IOperator from './IOperator';

@registerOperator('multiply')
export default class Multiply implements IOperator<number> {
	symbol = '*';
	id= 'multiply';
	
	left: number | ICommand<number>;
	right: number | ICommand<number>;
	constructor(left: number | ICommand<number>, right: number | ICommand<number>) {
		this.left = left;
		this.right = right;
	}
	execute(): number {

		let leftOperand = typeof this.left === 'number' ? this.left : this.left.execute();
		let rightOperand = typeof this.right === 'number' ? this.right : this.right.execute();
		return leftOperand * rightOperand;
	}
}
