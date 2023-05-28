import { TypeGuard } from '../../utils';
import ICommand, { isCommand } from '../ICommand';
import IOperator from './IOperator';

export default class Root implements IOperator<number> {
	id = 'root';
	symbol = 'sqrt';

	private typeGuard: TypeGuard = new TypeGuard(['number', 'string']);
	radicand: number | string | ICommand<number | string>;
	index: number | string | ICommand<number | string>;

	constructor(
		radicand: number | string | ICommand<number | string>,
		index: number | string | ICommand<number | string>
	) {
		this.radicand = radicand;
		this.index = index;
	}
	

	private validateValue(value: number | string, operandName: string): void {
		this.typeGuard.evaluate(value, this.id, operandName);
	}

	execute(): number {
		const radicandOperand = isCommand(this.radicand) ? this.radicand.execute() : this.radicand;
		this.validateValue(radicandOperand, 'radicandOperand');

		const indexOperand = isCommand(this.index) ? this.index.execute() : this.index;
		this.validateValue(indexOperand, 'indexOperand');

		return Math.pow(Number(radicandOperand), 1 / Number(indexOperand));
	}

	toString(): string {
		return `${this.symbol}(${this.radicand.toString()}, ${this.index.toString()})`;
	}
}
