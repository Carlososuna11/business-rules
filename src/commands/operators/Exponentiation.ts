import { registerOperator } from '.';
import ICommand from '../ICommand';
import IOperator from './IOperator';

@registerOperator('exponentiation')
export default class Exponentiation implements IOperator<number> {
	symbol = '**';
	id= 'exponentiation';

	base: number | ICommand<number>;
	exponent: number | ICommand<number>;
	constructor(base: number | ICommand<number>, exponent: number | ICommand<number>) {
		this.exponent = exponent;
		this.base = base;
	}
	execute(): number {

		let baseOperand = typeof this.base === 'number' ? this.base : this.base.execute();
		let exponentOperand = typeof this.exponent === 'number' ? this.exponent : this.exponent.execute();

		return baseOperand ** exponentOperand;
	}
}
