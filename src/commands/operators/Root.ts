import ICommand from '../ICommand';
import IOperator from './IOperator';

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
		const radicandOperand = typeof this.radicand === 'number' ? this.radicand : this.radicand.execute();
		const indexOperand = typeof this.index === 'number' ? this.index : this.index.execute();

		return Math.pow(radicandOperand, 1 / indexOperand);
	}
}
