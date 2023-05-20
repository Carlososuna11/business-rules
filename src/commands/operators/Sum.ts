import { registerOperator } from ".";
import IOperator from "../../operators/IOperator";
import ICommand from "../ICommand";

@registerOperator('sum')
export default class Sum implements IOperator<number> {
  id = 'sum';
  symbol = '+';

  left: number | ICommand<number>;
	right: number | ICommand<number>;

constructor(left: number | ICommand<number>, right: number | ICommand<number>) {
		this.left = left;
		this.right = right;
	}
	execute(): number {

		let rightOperand  = typeof this.right === 'number' ? this.right : this.right.execute();
		let leftOperand  = typeof this.left === 'number' ? this.left : this.left.execute();

		return leftOperand + rightOperand;


	}
}