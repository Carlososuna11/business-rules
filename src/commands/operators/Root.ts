import { registerOperator } from '.';
import ICommand from '../ICommand';
import IOperator from './IOperator';

@registerOperator('root')
export default class Root implements IOperator<number> {
	id = 'root';
	symbol = 'sqrt';

	radicand: number | ICommand<number>;
	index: number | ICommand<number>;
	constructor(radicand: number | ICommand<number>, index: number | ICommand<number>) {
		this.index = index;
		this.radicand = radicand;
	}
	execute(): number {
		let radicandOperand = typeof this.radicand === 'number' ? this.radicand : this.radicand.execute();
		let indexOperand = typeof this.index === 'number' ? this.index : this.index.execute();

		return Math.pow(radicandOperand, 1 / indexOperand);
	}
}
