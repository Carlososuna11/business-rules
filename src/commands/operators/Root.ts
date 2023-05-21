import ICommand from '../ICommand';
import IOperator from './IOperator';

export default class Root implements IOperator<number> {
	id = 'root';
	symbol = 'sqrt';

	radicand: number | string | ICommand<number | string>;
	index: number | string | ICommand<number | string>;

	constructor(
		radicand: number | string | ICommand<number | string>,
		index: number | string | ICommand<number | string>
	) {
		this.radicand = radicand;
		this.index = index;
	}
	execute(): number {
		const indexOperand =
			typeof this.index === 'number' || typeof this.index === 'string' ? this.index : this.index.execute();
		const radicandOperand =
			typeof this.radicand === 'number' || typeof this.radicand === 'string' ? this.radicand : this.radicand.execute();

		return Math.pow(Number(radicandOperand), 1 / Number(indexOperand));
	}
}
