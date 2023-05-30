import { AbstractContextData } from '../../context';
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

	private async validateValue(value: number | string, operandName: string): Promise<void> {
		await this.typeGuard.evaluate(value, this.id, operandName);
	}

	async execute(context: AbstractContextData): Promise<number> {
		const radicandOperand = isCommand(this.radicand) ? await this.radicand.execute(context) : this.radicand;
		await this.validateValue(radicandOperand, 'radicandOperand');

		const indexOperand = isCommand(this.index) ? await this.index.execute(context) : this.index;
		await this.validateValue(indexOperand, 'indexOperand');

		return Math.pow(Number(radicandOperand), 1 / Number(indexOperand));
	}

	toString(): string {
		return `${this.symbol}(${this.radicand.toString()}, ${this.index.toString()})`;
	}
}
