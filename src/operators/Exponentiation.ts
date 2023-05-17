import IOperator from './IOperator';

export default class Exponentiation implements IOperator<number> {
    base: number;
	exponent: number;
	constructor(base: number, exponent: number) {
		this.exponent = exponent;
		this.base = base;
	}
	execute(): number {
		return this.base ** this.exponent;
	}
}
