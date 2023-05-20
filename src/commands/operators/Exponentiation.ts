import ICommand from '../ICommand';
import IOperator from './IOperator';

export default class Exponentiation implements IOperator<number> {
	symbol = '**';
	id = 'exponentiation';

	base: number | ICommand<number>;
	exponent: number | ICommand<number>;
	constructor(base: number | ICommand<number>, exponent: number | ICommand<number>) {
		this.exponent = exponent;
		this.base = base;
	}
	execute(): number {
		const baseOperand = typeof this.base === 'number' ? this.base : this.base.execute();
		const exponentOperand = typeof this.exponent === 'number' ? this.exponent : this.exponent.execute();

		return baseOperand ** exponentOperand;
	}
}
